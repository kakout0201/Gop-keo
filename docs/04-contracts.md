# Contracts — Server Actions + Zod

Trạng thái: Bước 7, đã chốt Q1–Q14 (2026-10-24), chờ GATE. Ký hiệu `(Qn)`, `[Qn]` = quyết định đã chốt.
Mọi thao tác ghi là **Server Action** trong `lib/actions/*`. Đọc dữ liệu là hàm server `getTripView`
gọi từ Server Component (không phải action). Không có REST API ngoài `/api/health`.

## 1. Quy ước chung

```ts
// lib/schemas.ts
import { z } from "zod";

export const Slug = z.string().regex(/^[A-Za-z0-9]{16}$/);
export const Id = z.string().uuid();
export const Vnd = z.number().int().safe();                 // số nguyên VND
export const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/); // ngày theo giờ VN
const cleanText = (min: number, max: number) =>
  z.string().transform((s) => s.normalize("NFC").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim())
   .pipe(z.string().min(min).max(max));
export const MemberName = cleanText(1, 30).refine((s) => nameKey(s).length > 0, "Tên cần có chữ hoặc số");
export const TripTitle = cleanText(1, 60);
export const ExpenseTitle = cleanText(1, 60);
export const PlaceName = cleanText(1, 80);
```

Kết quả mọi action:
```ts
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: ErrorCode; message: string; details?: Record<string, unknown> } };
```
`message` là câu tiếng Việt hiện thẳng cho người dùng. Action **không** ném lỗi ra client; lỗi bất ngờ →
`INTERNAL` ("Có lỗi, bạn thử lại nhé.") và ghi log server (không kèm dữ liệu nhạy cảm).

| ErrorCode | Khi nào | Câu hiện |
|---|---|---|
| `VALIDATION` | Zod lỗi | theo trường, `details.fieldErrors` |
| `TRIP_NOT_FOUND` | slug sai | Không tìm thấy kèo này. Kiểm tra lại link trong Zalo. |
| `NOT_MEMBER` | thiết bị chưa chọn tên | Chọn tên của bạn trước nhé. |
| `FORBIDDEN` | không có quyền theo R9 | Chỉ {ai} mới làm được việc này. |
| `FORBIDDEN` + `details.reason = "NEW_DEVICE_COOLDOWN"` | lưu/xóa TK nhận tiền từ máy gắn vào tên có sẵn < 24 giờ (PRD R12) | Máy mới cần đợi 24 giờ mới được đổi tài khoản nhận tiền. Bạn dùng máy cũ, hoặc quay lại sau {giờ}. (`{giờ}` từ `details.allowedAt`, dạng "21:05 24/11") |
| `TRIP_CLOSED` | vote/sửa lựa chọn khi đã chốt | Kèo đã chốt, không vote được nữa. |
| `NAME_TAKEN` | tên mới trùng tên có sẵn | Đã có "{tên}" trong kèo. Bạn là {tên} này à? (`details.memberId`) |
| `NAME_IN_USE_ELSEWHERE` | chọn tên đang có máy khác giữ, chưa xác nhận [Q5] | Tên {tên} đang được dùng trên một máy khác. Đây là bạn trên máy mới? |
| `LIMIT_REACHED` | quá 20 người / 200 khoản / 20 kèo mỗi ngày | Kèo đã đủ 20 người. (v.v.) |
| `STALE` | version khoản chi cũ, hoặc số tiền dòng chuyển đã đổi | Số liệu vừa thay đổi. Mình đã tải số mới. (`details.current`) |
| `NO_PAYOUT_ACCOUNT` | xem tin nhắc khi chưa nhập TK | Nhập tài khoản trước để mọi người quét mã. |
| `NOTHING_TO_PAY` | đánh dấu dòng đã trả xong | Dòng này đã trả xong. |
| `RATE_LIMITED` | vượt giới hạn theo IP (kiến trúc D8) | Bạn thao tác hơi nhanh, đợi chút nhé. (`details.retryAfterSec`) |
| `INTERNAL` | lỗi khác | Có lỗi, bạn thử lại nhé. |

Thứ tự kiểm trong mọi action có `slug`:
1. Zod parse → `VALIDATION`.
2. Tìm kèo theo slug → `TRIP_NOT_FOUND`.
3. Đọc cookie `gk_device` → thiết bị (có thể không có) → thành viên của thiết bị trong kèo này.
4. Mọi id trong input phải thuộc kèo này (truy vấn luôn lọc `trip_id`) → nếu không: `TRIP_NOT_FOUND`
   (không tiết lộ id có tồn tại ở kèo khác).
5. Kiểm quyền bằng `lib/domain/permissions.ts` (hàm thuần, có unit test) → `NOT_MEMBER` / `FORBIDDEN`.
6. Ghi trong một giao dịch, ghi `trip_events`, `revalidatePath(`/k/${slug}`, "layout")`.

`ensureDevice()`: action nào cần danh tính mà chưa có cookie thì tạo thiết bị + đặt cookie (chỉ các action
đánh dấu **(tạo cookie)**: `createTrip`, `claimMember`, `joinAsNewMember`). Trước khi tạo thiết bị mới gọi
`rateLimit("create_device:ip", 30/1h, 100/24h)` → vượt thì `RATE_LIMITED`, không tạo gì. Có cookie hợp lệ thì
không đếm.

`rateLimit(bucket, windows)` (kiến trúc D8): IP lấy từ `x-real-ip`, không có thì phần tử đầu của
`x-forwarded-for`, không có nữa thì `"local"`; chuẩn hóa (IPv6 → /64); `key_hash = HMAC-SHA256(IP_HASH_SECRET,
bucket + ":" + ip)`. Kiểm **trước** khi ghi bất cứ gì khác. Không bao giờ trả IP hay hash về client, không log.

## 2. Đọc: `getTripView(slug)` (server-only)

```ts
type TripView = {
  trip: { slug: string; title: string; status: "voting" | "closed"; createdAt: string;
          closed?: { dateOptionId: string; placeOptionId: string | null; closedAt: string } };
  viewer: { memberId: string | null; isCreator: boolean };
  members: { id: string; name: string; joinOrder: number; initials: string; colorIndex: number;
             hasVoted: boolean; hasPayoutAccount: boolean;
             isNew: boolean }[];   // vào kèo < 48 giờ và không phải người tạo → nhãn "mới" (PRD R1)
  creatorMemberId: string;
  dateOptions: { id: string; start: string; end: string; label: string;   // "T7–CN 21–22/11"
                 voterIds: string[]; leading: boolean }[];
  placeOptions: { id: string; name: string; pricePerNightVnd: number | null; url: string | null;
                  voterIds: string[]; leading: boolean }[];
  voteSummary: { votedCount: number; memberCount: number; notVotedIds: string[] };
  expenses: { id: string; title: string; amountVnd: number; payerId: string; version: number;
              shares: { memberId: string; amountVnd: number }[]; excludedIds: string[];
              edited: boolean; canEdit: boolean; createdAt: string }[];
  totals: { expenseCount: number; expenseSumVnd: number };
  balances: { memberId: string; balanceVnd: number }[];        // + nhận, − nợ (R4)
  transfers: TransferLine[];                                     // R5, cả nhóm
  progress: { doneLines: number; totalLines: number; paidVnd: number; totalVnd: number };  // R7
  me: null | {
    toPay: TransferLine[];        // dòng tôi phải chuyển (kể cả hoàn lại), còn > 0
    toReceive: TransferLine[];    // dòng người khác phải chuyển cho tôi
    receivingTotalVnd: number; receivedVnd: number;
    payoutAccount: PayoutAccountView | null;
    breakdown: MyBreakdown;                     // US-22
    canEditPayoutAccount: { ok: true } | { ok: false; allowedAt: string };  // R12: máy mới < 24 giờ
    unseenChanges: ExpenseChangesBanner | null;   // P11 + khoản mới do người khác ghi (PRD R10)
    dots: { keo: boolean; chiTieu: boolean; traTien: boolean };   // R10
  };
  accounts: Record<string, PayoutAccountView>;  // [Q4] chỉ có khi viewer.memberId != null;
                                                // chỉ chứa người nhận trong me.toPay
  activity: { id: number; kind: string; actorId: string | null; text: string; createdAt: string }[]; // 30 dòng mới nhất
  // gồm cả "Hùng vừa lưu tài khoản nhận tiền (MB Bank)", "Hùng báo chưa nhận được 870.000 ₫ từ Khoa"
};

// me.breakdown (US-22): phần của tôi theo từng khoản, để giải thích gộp nợ ở S10
type MyBreakdown = {
  items: { expenseId: string; title: string; amountVnd: number; payerId: string;
           myShareVnd: number;          // 0 nếu tôi không bị tính ("không tính bạn")
           iPaidVnd: number }[];        // = amountVnd nếu tôi là người trả, ngược lại 0
  totalShareVnd: number;                // Σ myShareVnd
  totalPaidVnd: number;                 // Σ iPaidVnd
  balanceVnd: number;                   // totalPaidVnd − totalShareVnd (R4)
  netTransferredVnd: number;            // đã chuyển đi − đã nhận về (không tính lần đã hủy)
  lines: TransferLine[];                // = me.toPay ∪ me.toReceive
};

type TransferLine = {
  fromId: string; toId: string;
  kind: "pay" | "refund";        // refund: hoàn lại sau khi sửa chi tiêu
  planVnd: number;               // L[d→c] (với refund: 0)
  paidVnd: number;               // đã chuyển ròng
  remainingVnd: number;          // > 0: còn phải chuyển; 0: xong
  lastPayment?: { id: string; at: string; method: "sent" | "received"; recordedById: string };
  // lần chuyển còn hiệu lực gần nhất trên dòng; người nhận dùng id này cho disputePayment / voidPayment
  lastDispute?: { at: string; amountVnd: number; markedAt: string };  // US-21: "Hùng báo chưa nhận được…
  transferNote: string;          // nội dung CK [Q11], vd "GOPKEO VT2 KHOA"
};

type PayoutAccountView = { memberId: string; bankBin: string; bankName: string;
                           accountNumber: string; accountName: string;
                           recentWarning: null | { reason: "changed" | "new_device"; at: string } };
                           // R12.2: "changed" nếu changed_at < 48h; else "new_device" nếu lưu từ máy claimed < 48h
                           // của chính mình: accountNumber trả về đầy đủ; S11 tự rút gọn "···2222"

type ExpenseChangesBanner = {
  upToEventId: number;                 // gửi lại trong markChangesSeen
  items: {                             // mới nhất trước; chỉ sự kiện của NGƯỜI KHÁC làm đổi phần/số nhận của tôi
    eventId: number; kind: "created" | "updated" | "deleted";
    actorId: string; at: string; expenseTitle: string; amountVnd: number;
    summary: string;                   // "chia 6 người → chia 5 người" | "phần của bạn 20.000 ₫" | "đã xóa"
    myShareBeforeVnd: number; myShareAfterVnd: number;   // khoản mới: before = 0
  }[];
  // tổng hợp cho cả banner (như P11):
  myOweBeforeVnd: number; myOweNowVnd: number;          // tổng phải trả trước/sau các thay đổi
  myPaidVnd: number;                   // tôi đã chuyển ròng
  refund?: { fromId: string; amountVnd: number };      // tôi được hoàn
  extraToPayVnd?: number;              // tôi phải trả thêm
  others: { memberIds: string[]; deltaVnd: number }[]; // "mỗi người trả thêm 20.000 ₫"
};
```
Quy tắc: `getTripView` không bao giờ trả `token_hash`, `device_id`, số TK của người không nằm trong
`me.toPay` (trừ của chính mình). Nếu slug sai → `notFound()`.

## 3. Actions

Ký hiệu quyền theo R9 PRD. Mọi action có `slug` trừ `createTrip`.

### 3.1 Kèo — `lib/actions/trip.ts`

**`createTrip`** (tạo cookie) — US-01
```ts
z.object({
  title: TripTitle,
  creatorName: MemberName,
  dateRanges: z.array(z.object({ start: IsoDate, end: IsoDate })).min(1).max(10),
  places: z.array(z.object({
    name: PlaceName,
    pricePerNightVnd: Vnd.min(0).max(1_000_000_000).nullable(),
    url: z.string().url().startsWith("https://").max(500).nullable(),
  })).max(6),
})
// kiểm thêm: start ≤ end, end − start ≤ 13 ngày, start ≥ hôm nay (giờ VN), các khoảng không chồng nhau
→ { slug: string }
```
Lỗi: `VALIDATION`, `LIMIT_REACHED` (20 kèo/thiết bị/24h), `RATE_LIMITED` (`create_trip:ip` 10/1h, 50/24h).
Ghi: trip, member #1, member_devices (`claimed_via='created'`), options, event `trip_created`. Sau đó client chuyển tới `/k/{slug}/chia-se`.

**`updateTrip`** — US-08 · người tạo · chỉ khi `voting`
```ts
z.object({ slug: Slug, title: TripTitle,
  dateRanges: /* như trên */, places: z.array(z.object({ id: Id.optional(), name: PlaceName,
  pricePerNightVnd: ..., url: ... })).max(6) })
→ { ok: true }
```
Lựa chọn ngày giữ nguyên nếu `start` không đổi; lựa chọn bị bỏ thì xóa cùng phiếu. Lỗi: `FORBIDDEN`, `TRIP_CLOSED`.

**`closeTrip`** — US-06 · người tạo · chỉ khi `voting`
```ts
z.object({ slug: Slug, dateOptionId: Id, placeOptionId: Id.nullable() })
// placeOptionId bắt buộc nếu kèo có ≥ 1 chỗ
→ { ok: true }
```

**`reopenVoting`** — US-07 [Q7] · người tạo · chỉ khi `closed`
```ts
z.object({ slug: Slug }) → { ok: true }
```

### 3.2 Thành viên — `lib/actions/members.ts`

**`claimMember`** (tạo cookie) — US-04, US-20 [Q5]
```ts
z.object({ slug: Slug, memberId: Id, confirmOtherDevice: z.boolean().default(false) })
→ { memberId: string }
```
- Thiết bị đang là thành viên khác trong kèo → đổi sang thành viên mới (bỏ gắn cũ).
- Thành viên đã có thiết bị khác và `confirmOtherDevice=false` → `NAME_IN_USE_ELSEWHERE`.
- Xác nhận → thêm thiết bị, event `member_new_device` (ai cũng thấy).
- Mọi lần gắn qua action này ghi `member_devices.claimed_via='claimed'` → 24 giờ không lưu/xóa được TK (R12).
  Kết quả kèm `payoutCooldownUntil: string | null` để UI báo trước nếu người này là người được nợ.

**`joinAsNewMember`** (tạo cookie) — US-04
```ts
z.object({ slug: Slug, displayName: MemberName }) → { memberId: string }
```
Lỗi: `NAME_TAKEN` (kèm `details.memberId`), `LIMIT_REACHED` (20 người), `RATE_LIMITED` (`join_member:ip` 30/1h).
Ghi member + member_devices (`claimed_via='created'`). Event `member_joined`.

**`releaseClaim`** — "· đổi"
```ts
z.object({ slug: Slug }) → { ok: true }
```

### 3.3 Vote — `lib/actions/votes.ts`

**`setVote`** — US-04 · thành viên · chỉ khi `voting`
```ts
z.object({ slug: Slug, kind: z.enum(["date", "place"]), optionId: Id, on: z.boolean() })
→ { votedCount: number; memberCount: number }
```
Lặp lại cùng giá trị là không lỗi (idempotent). Lỗi: `NOT_MEMBER` (client mở sheet "Bạn là ai?",
chọn tên xong gọi lại `setVote`), `TRIP_CLOSED`.

### 3.4 Chi tiêu — `lib/actions/expenses.ts`

```ts
const ExpenseInput = z.object({
  slug: Slug,
  title: ExpenseTitle,
  amountVnd: Vnd.min(1_000).max(500_000_000),
  payerId: Id,
  splitMemberIds: z.array(Id).min(1).max(20),   // không trùng
});
```
Phần chia tính ở server bằng `splitEqual` (R3); client dùng **cùng hàm** để xem trước ở S7.

**`createExpense`** — US-09 · thành viên
```ts
ExpenseInput → { expenseId: string }
```
Lỗi: `NOT_MEMBER`, `LIMIT_REACHED` (200 khoản). Event `expense_created` (payload.after).

**`updateExpense`** — US-11 · người ghi / người trả / người tạo kèo [Q3]
```ts
ExpenseInput.extend({ expenseId: Id, expectedVersion: z.number().int().min(1) })
→ { expenseId: string; version: number }
```
Lỗi: `FORBIDDEN`, `STALE` (version khác → `details.current` là khoản chi hiện tại). Thay toàn bộ
`expense_shares`, `version + 1`. Event `expense_updated` (payload.before/after: title, amount, payer, shares).

**`deleteExpense`** — US-11 · như trên
```ts
z.object({ slug: Slug, expenseId: Id, expectedVersion: z.number().int().min(1) }) → { ok: true }
```
Xóa mềm. Event `expense_deleted`.

**`markChangesSeen`** — nút "Đã hiểu" (P11) · thành viên
```ts
z.object({ slug: Slug, upToEventId: z.number().int().min(0) }) → { ok: true }
```

### 3.5 Tài khoản nhận tiền — `lib/actions/accounts.ts`

**`savePayoutAccount`** — US-12 · chính mình
```ts
z.object({
  slug: Slug,
  bankBin: z.string().regex(/^\d{6}$/).refine(isKnownBankBin),
  accountNumber: z.string().transform((s) => s.replace(/[\s.-]/g, "")).pipe(z.string().regex(/^\d{4,19}$/)),
  accountName: z.string().transform(toBankName).pipe(z.string().regex(/^[A-Z][A-Z ]{0,48}[A-Z]$/)),
})
// toBankName: bỏ dấu (đ→D), IN HOA, chỉ giữ A–Z và khoảng trắng, gộp khoảng trắng
→ { ok: true }
```
Lỗi: `NOT_MEMBER`, `FORBIDDEN` (`NEW_DEVICE_COOLDOWN`, khi máy gọi có `claimed_via='claimed'` và gắn < 24 giờ).
`changed_at = now()` nếu thành viên đã từng có event `account_saved`, ngược lại `null`.
`saved_by_device_id = máy gọi`, `saved_from_claimed_device = (claimed_via của máy gọi = 'claimed')`.
Event `account_saved` (payload `{ bankBin, bankName, isChange }`; không có số TK, tên chủ TK).

**`deletePayoutAccount`** — US-12 · chính mình
```ts
z.object({ slug: Slug }) → { ok: true }
```
Lỗi: như `savePayoutAccount` (cùng quy tắc 24 giờ). Event `account_deleted`.

### 3.6 Trả tiền — `lib/actions/payments.ts`

**`markSent`** — US-14 · người nợ trên dòng
```ts
z.object({ slug: Slug, toMemberId: Id, kind: z.enum(["pay", "refund"]), expectedAmountVnd: Vnd.min(1) })
→ { paymentId: string }
```
Server tính lại kế hoạch; tìm dòng `from = tôi, to = toMemberId, kind` có `remainingVnd > 0`.
Không có → `NOTHING_TO_PAY`. `remainingVnd ≠ expectedAmountVnd` → `STALE` (`details.current`).
Ghi payment `method='sent'`, số tiền = `remainingVnd`. Event `payment_recorded`.

**`markReceived`** — US-19 [Q13] · người được nhận trên dòng
```ts
z.object({ slug: Slug, fromMemberId: Id, kind: z.enum(["pay", "refund"]), expectedAmountVnd: Vnd.min(1) })
→ { paymentId: string }
```
Như `markSent`, `method='received'`.

**`voidPayment`** — US-14 · người đã ghi lần chuyển
```ts
z.object({ slug: Slug, paymentId: Id }) → { ok: true }
```
Đã hoàn tác rồi → `{ ok: true }` (idempotent). Ghi `void_reason='undo'`. Event `payment_voided`.

**`disputePayment`** — US-21 · người nhận (`to_member_id`) của lần chuyển
```ts
z.object({ slug: Slug, paymentId: Id }) → { ok: true }
```
Chỉ cho lần chuyển `method='sent'`, chưa hủy, `to_member_id` = tôi; ngược lại `FORBIDDEN` (lần do chính tôi
đánh dấu "Đã nhận" thì dùng `voidPayment`). Đã bị hủy (bất kể lý do) → `{ ok: true }`.
Ghi `voided_at`, `voided_by_member_id = tôi`, `void_reason='disputed'`. Event `payment_disputed`
(payload `{ paymentId, fromMemberId, amountVnd, markedAt }`). Dòng của người trả quay lại "chưa trả" và có
`lastDispute`.

## 4. Hàm thuần dùng chung (client + server) — `lib/domain`
| Hàm | Vào | Ra |
|---|---|---|
| `splitEqual(amount, splitIdsByJoinOrder, payerId)` | số tiền, id theo thứ tự vào kèo, người trả | `{ memberId, amountVnd }[]`, `roundingNote` (câu S7 hoặc null) |
| `computeBalances(expenses)` | khoản chi chưa xóa + phần chia | `Map<memberId, number>` |
| `planTransfers(balances, payments, joinOrder)` | như D4 | `TransferLine[]` (chưa có `transferNote`) |
| `progress(lines)` | | R7 |
| `transferNote(tripTitle, payerName)` | [Q11] | `"GOPKEO VT2 KHOA"` |
| `buildVietQrPayload({ bin, accountNumber, amountVnd, note })` | | chuỗi EMVCo |
| `nameKey(name)` | tên | NFD, bỏ dấu, đ→d, thường, **chỉ giữ `[a-z0-9]`**; rỗng → `VALIDATION` "Tên cần có chữ hoặc số" |
| `toBankName(name)` / `initials(members)` | | |
| `formatVnd(n)` | | `"870.000 ₫"` (dùng U+00A0 trước ₫) |
| `formatDateRange(start, end)` | | `"T7–CN 21–22/11"` |
| `reminderText({ mode, style, ... })` | R11 | chuỗi |
| `explainMyShare(memberId, expenses, payments)` | US-22 | `MyBreakdown` (trừ `lines`) |
| `canEditPayoutAccount(claim, now)` | R12 | `{ ok } \| { ok:false, allowedAt }` |
| `can(action, ctx)` | quyền R9 | boolean |

## 5. `/api/health`
`GET` → `200 { ok: true, version: string, db: "ok" }` hoặc `503 { ok: false, db: "error" }`.
Không cần cookie, không trả dữ liệu người dùng.
