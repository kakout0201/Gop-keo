# Kiến trúc — Góp Kèo v1

Trạng thái: Bước 7, đã chốt Q12 (2026-10-24), chờ GATE.
Liên quan: [01-prd.md](01-prd.md), [03-schema.sql](03-schema.sql), [04-contracts.md](04-contracts.md).

## 1. Tổng quan
```
Điện thoại (trình duyệt Zalo)
   │  HTTPS, cookie gk_device (httpOnly)
   ▼
Vercel — Next.js App Router (TypeScript)
   ├─ Server Components: đọc kèo, render HTML có sẵn dữ liệu
   ├─ Server Actions: mọi thao tác ghi (Zod kiểm tra đầu vào → kiểm quyền → ghi DB)
   ├─ lib/domain (thuần TS, không I/O): chia tiền, số dư, kế hoạch chuyển, VietQR, tin nhắn
   └─ lib/db (server-only): Supabase client dùng service role key
   ▼
Supabase Postgres (Singapore) — RLS bật trên mọi bảng, không có policy cho anon/authenticated
```
Không có API công khai nào khác ngoài `/api/health`. Trình duyệt **không** nói chuyện trực tiếp với Supabase.

## 2. Quyết định chính

### D1. Truy cập dữ liệu chỉ từ server, danh tính bằng cookie thiết bị (Q12)
- Server Actions và Server Components dùng **service role key** (biến môi trường server-only,
  import qua module có `import "server-only"`). Không đưa anon key xuống trình duyệt.
- RLS bật trên mọi bảng và **không có policy** cho `anon`/`authenticated` → ai lấy được anon key cũng
  không đọc/ghi được gì. Đây là lớp chặn thứ hai; lớp kiểm quyền chính nằm trong TS (dễ test).
- Danh tính: cookie `gk_device` = 32 byte ngẫu nhiên (base64url), `HttpOnly; Secure; SameSite=Lax;
  Path=/; Max-Age=400 ngày`. DB chỉ lưu `sha256(token)`. Cookie được tạo **khi ghi lần đầu** (tạo kèo,
  chọn tên), không tạo khi chỉ xem → bot xem trước link của Zalo không tạo rác.
- **Thay cho Supabase Anonymous Auth** (đã chốt Q12: bỏ việc "bật auth ẩn danh" ở PLAYBOOK Bước 19). Lý do: (1) toàn bộ luật quyền ở một chỗ, test bằng Vitest; (2) trang đọc không cần tạo
  phiên → HTML nhanh hơn, không sinh user ẩn danh cho mỗi lần mở link; (3) không phải viết RLS phức tạp
  cho quy tắc "chỉ người đã chọn tên mới thấy số TK".
- Đánh đổi: lộ service role key là lộ toàn bộ DB → chỉ đặt ở Vercel (Production/Preview) và
  `.env.local`, không bao giờ có tiền tố `NEXT_PUBLIC_`, có test chặn (xem 05-test-plan §5).
- Phương án đã loại: Supabase Anonymous Auth + RLS theo `auth.uid()`; truy cập theo link qua
  hàm `SECURITY DEFINER open_trip(slug)`. An toàn tương đương nhưng luật quyền nằm trong SQL, khó test hơn,
  và mỗi lần mở link phải tạo phiên.

### D2. Link kèo là "chìa khóa"
`/k/{slug}`, slug 16 ký tự base62 ngẫu nhiên (≈ 95 bit) tạo bằng `crypto.getRandomValues`. Không có
trang liệt kê kèo. Thẻ xem trước (Open Graph) chỉ có tên kèo và "{người tạo} rủ", không có tiền hay số TK.

### D3. Logic tiền là hàm thuần trong `lib/domain`
- `splitEqual(amount, memberIdsTheoThứTựVàoKèo, payerId)` → phần từng người (R3).
- `computeBalances(expenses)` → số dư (R4).
- `planTransfers(balances, payments, members)` → các dòng chuyển (R5), gồm dòng hoàn lại.
- `progress(lines)` (R7), `diffForMember(before, after)` (banner P11).
Phần chia của mỗi khoản được **tính ở server khi lưu** và lưu vào `expense_shares` (DB kiểm tổng bằng
số tiền). Số dư và kế hoạch chuyển **tính khi đọc**, không lưu → không bao giờ lệch.
Mọi số tiền là `number` nguyên (≤ 9·10^15 an toàn); kiểm `Number.isSafeInteger` ở biên.

### D4. Thuật toán kế hoạch chuyển (R5 chi tiết)
```
Đầu vào: B (số dư từ chi tiêu), P (các lần chuyển chưa hoàn tác), thứ tự vào kèo
D = người nợ (B<0) theo |B| giảm dần, hòa → vào kèo trước
C = người được nợ (B>0) theo B giảm dần, hòa → vào kèo trước   (thứ tự cố định)
fit(rd, rc): với từng d theo D: tìm c đầu tiên trong C có rc[c] ≥ rd[d] → giao hết;
             không có → rải cho các c theo C còn rc>0 cho tới khi hết rd[d]
1. P0 = fit(|B| của D, B của C)                        -- kế hoạch gốc
2. net[d→c] = Σ P(d→c) − Σ P(c→d)
   với các cặp net>0, d∈D, c∈C, theo thời điểm chuyển đầu tiên:
      L[d→c] += min(net, rd, rc); trừ rd, rc            -- giữ cặp đã trả
3. với từng dòng P0 theo thứ tự: L[d→c] += min(P0[d→c] − L[d→c] (≥0), rd, rc); trừ rd, rc
4. fit(rd, rc) phần còn lại, cộng vào L
5. Dòng: với mỗi cặp có L>0 hoặc net≠0: còn = L[d→c] − net[d→c]
      còn > 0 → d chuyển c;  còn < 0 → c hoàn lại d |còn|;  = 0 → đã xong
```
Tính chất (có property test): tổng các dòng của mỗi người = số dư − số đã chuyển ròng; nếu mọi lần chuyển
≤ dòng kế hoạch gốc thì L = P0 (đánh dấu đã trả không làm đổi dòng khác); không dòng nào âm sau bước 5.

### D5. Vẽ trang và làm mới
- Trang kèo là Server Component: 1 lượt đọc (các truy vấn chạy song song) → `buildTripView()` thuần TS →
  props cho các component client nhỏ (vote, sheet, copy, QR).
- Ghi qua Server Action → `revalidatePath('/k/[slug]', 'layout')` → trang cập nhật.
- Không realtime. Khi tab trình duyệt hiện lại (`visibilitychange`) và mỗi 60 giây khi đang mở trang,
  gọi `router.refresh()`.
- Vote: cập nhật lạc quan (`useOptimistic`), lỗi thì quay lại và báo.
- Xung đột sửa khoản chi: `expenses.version`; sửa với version cũ → lỗi `STALE` → tải lại số mới.

### D6. VietQR tại máy
- `lib/domain/vietqr.ts` dựng chuỗi EMVCo: 00 "01", 01 "12" (QR động), 38 (GUID `A000000727`,
  01 = BIN + số TK, 02 `QRIBFTTA`), 53 "704", 54 số tiền, 58 "VN", 62/08 nội dung, 63 CRC16-CCITT.
- Vẽ bằng thư viện `qrcode` (npm) thành **ảnh PNG `<img>`** để chạm giữ là lưu được trong webview.
- "Lưu ảnh QR": tạo PNG có QR + dòng chữ (số tiền, người nhận) rồi tải về bằng `<a download>`; nếu
  webview chặn tải thì vẫn còn cách chạm giữ ảnh (ghi chú ngay dưới nút). Kiểm ở Bước 18.
- Danh sách ngân hàng: file tĩnh `lib/domain/banks.ts` (BIN, tên ngắn), chụp từ danh sách ngân hàng
  VietQR/Napas lúc code, ghi nguồn và ngày trong file.

### D8. Giới hạn tần suất theo thiết bị và IP
- Bảng `rate_limit_hits (bucket, key_hash, created_at)`. Mỗi lần gọi action có giới hạn: đếm số dòng cùng
  `bucket` + `key_hash` trong cửa sổ thời gian; vượt → `RATE_LIMITED` (theo IP) hoặc `LIMIT_REACHED` (theo thiết bị);
  không vượt → chèn 1 dòng. Đếm + chèn trong cùng giao dịch, khóa theo `pg_advisory_xact_lock(hashtext(bucket||key))`
  để hai yêu cầu song song không cùng lọt.
- Mức (PRD §6): `create_trip:device` 20/24h (đếm luôn từ `trips.created_by_device_id`), `create_trip:ip` 10/1h và
  50/24h, `join_member:ip` 30/1h, `create_device:ip` 30/1h và 100/24h.
- `ensureDevice()` (dùng bởi mọi action tạo cookie: `createTrip`, `claimMember`, `joinAsNewMember`) chỉ kiểm
  `create_device:ip` **khi thật sự tạo thiết bị mới** (request chưa có cookie hợp lệ); có cookie rồi thì không đếm.
  Chặn việc xóa cookie liên tục để có danh tính mới (né giới hạn theo thiết bị).
- **Lấy IP trên Vercel:** trong Server Action dùng `headers()` của `next/headers`, đọc `x-real-ip`; không có thì lấy
  phần tử **đầu tiên** của `x-forwarded-for`. Trên Vercel hai header này do nền tảng đặt (Vercel ghi đè
  `x-forwarded-for` từ client), nên client không giả được. Ngoài Vercel (local) không có header → key `"local"`.
  Không dùng IP cho việc gì khác ngoài giới hạn tần suất.
- **Chuẩn hóa:** IPv4 giữ nguyên; IPv6 lấy prefix /64 (một máy có thể đổi địa chỉ trong /64).
- **Lưu dạng hash:** `key_hash = HMAC-SHA256(IP_HASH_SECRET, bucket + ":" + ip)` (32 byte). Không bao giờ lưu
  hay log IP gốc. `IP_HASH_SECRET` là biến môi trường server-only mới (≥ 32 byte ngẫu nhiên), chủ dự án tạo ở
  Bước 10 cùng các biến khác. Đổi khóa thì bộ đếm cũ hết tác dụng (chấp nhận).
- Dọn: mỗi lần chèn, xóa dòng `created_at < now() − 7 ngày` của cùng bucket (giới hạn 500 dòng/lần).
- Đánh đổi: 4G dùng CGNAT → nhiều người chung IP, nên mức theo IP để rộng; theo thiết bị là lớp chính.

### D9. Chống chiếm tài khoản nhận tiền (PRD R12)
- `member_devices.claimed_via` = `'created'` (máy tạo ra tên: `createTrip`, `joinAsNewMember`) hoặc `'claimed'`
  (máy gắn vào tên có sẵn: `claimMember`). `savePayoutAccount`/`deletePayoutAccount` trả `FORBIDDEN` (lý do
  `NEW_DEVICE_COOLDOWN`) nếu máy gọi có `claimed_via = 'claimed'` và `created_at > now() − 24h`.
- `payout_accounts.changed_at`: đặt bằng `now()` khi lưu mà thành viên **đã từng** có tài khoản (có event
  `account_saved` trước đó, kể cả đã xóa). Lần đầu: `null`.
- `payout_accounts.saved_by_device_id` + `saved_from_claimed_device` (ảnh chụp `claimed_via = 'claimed'` lúc lưu, vì
  dòng `member_devices` có thể đổi sau đó khi máy bấm "đổi").
- `getTripView` trả `recentWarning` cho TK của người nhận: `{ reason: "changed", at: changed_at }` nếu
  `changed_at > now() − 48h`; ngược lại `{ reason: "new_device", at: updated_at }` nếu `saved_from_claimed_device`
  và `updated_at > now() − 48h` (kể cả lần nhập đầu); ngược lại `null` → S10 hiện cảnh báo tương ứng (PRD R12.2).
- Event `account_saved` (payload: `bankBin`, `bankName`, `isChange`) và `account_deleted` hiện trong hoạt động;
  payload không có số TK hay tên chủ TK.
- Kiểm thời gian theo đồng hồ DB (`now()`), không theo giờ máy người dùng.

### D10. Hàm SQL cho mọi thao tác ghi (duyệt ở GATE Bước 8, 2026-10-24)
- Mỗi Server Action, sau khi kiểm Zod và tính toán bằng `lib/domain`, gọi **một** hàm `plpgsql` `app_<việc>` qua
  `supabase.rpc`; hàm làm mọi lệnh ghi trong một giao dịch và trả `jsonb` `{ ok: true, ... }` hoặc `{ ok: false, code }`.
- Mỗi hàm: `security invoker`, `set search_path = public`; `revoke execute on function ... from public, anon, authenticated;`
  `grant execute on function ... to service_role;`.
- Câu đầu tiên của mọi hàm ghi: `perform pg_advisory_xact_lock(hashtext(p_trip_id::text));` (tạo kèo và tạo thiết bị:
  khóa theo khóa giới hạn tần suất). Mọi ghi vào cùng một kèo vì vậy chạy tuần tự.
- **Kiểm lại trong hàm** mọi điều kiện phụ thuộc trạng thái, không tin kết quả server đã đọc trước đó: thành viên/quyền,
  trạng thái kèo, giới hạn số lượng, `expenses.version`, và `trips.money_version` cho `markSent`/`markReceived`.
- `trips.money_version` tăng 1 mỗi khi khoản chi hoặc lần chuyển thay đổi (tạo/sửa/xóa khoản, ghi/hoàn tác/hủy lần
  chuyển). `remainingVnd` do TS tính (thuật toán D4) chỉ đúng với một `money_version`; hàm `app_mark_sent` /
  `app_mark_received` nhận `p_expected_money_version` và trả `STALE` nếu đã khác, nên 2 lệnh song song không ghi 2 lần.
- Migration tên theo chuẩn Supabase CLI `supabase/migrations/YYYYMMDDHHMMSS_ten.sql`, mỗi slice một file.

### D7. Cấu trúc thư mục (dự kiến, Bước 9 tạo)
```
app/
  page.tsx                       trang chủ
  tao/page.tsx                   S1
  k/[slug]/layout.tsx            tải TripView, thanh tab
  k/[slug]/page.tsx              S3/S6
  k/[slug]/(sheets)/...          S4 dạng bottom sheet (component, không route riêng)
  k/[slug]/chia-se/page.tsx      S2
  k/[slug]/sua/page.tsx          S1 chế độ sửa
  k/[slug]/chot/page.tsx         S5
  k/[slug]/chi-tieu/page.tsx     S8
  k/[slug]/chi-tieu/them/page.tsx, [id]/page.tsx   S7
  k/[slug]/tra-tien/page.tsx     S10 + S11
  k/[slug]/tra-tien/tai-khoan/page.tsx            S9
  k/[slug]/tra-tien/nhac/page.tsx                 P20/P21/P16
  api/health/route.ts
lib/
  domain/   money.ts split.ts balances.ts transfers.ts vietqr.ts banks.ts text.ts reminders.ts permissions.ts trip-view.ts
  db/       client.ts (server-only) queries.ts
  actions/  trip.ts members.ts votes.ts expenses.ts payments.ts accounts.ts
  device.ts (cookie gk_device)
  schemas.ts (Zod)
components/  theo tên trong tokens.md (Button, MoneyText, MemberAvatar, ...)
supabase/migrations/  YYYYMMDDHHMMSS_init.sql (từ 03-schema.sql), rồi mỗi slice một file hàm SQL
tests/  unit/ integration/ e2e/
```

## 3. Thư viện dự kiến
next, react, typescript, tailwindcss, @supabase/supabase-js, zod, qrcode, server-only;
dev: vitest, fast-check, @playwright/test, @axe-core/playwright, eslint, prettier, supabase CLI.
Không dùng thư viện UI nặng; component tự viết theo tokens.

## 4. Môi trường
| Môi trường | DB | Ghi chú |
|---|---|---|
| Local | Supabase local (Docker) hoặc project dev trên cloud — **chốt ở Bước 9** | `.env.local` (Claude không đọc) |
| Preview (Vercel) | Supabase dev | mỗi PR |
| Production | Supabase prod, Singapore | Bước 19 |
Biến môi trường: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server-only), `IP_HASH_SECRET` (server-only, D8), `APP_URL`. Không có biến `NEXT_PUBLIC_*` chứa khóa.

## 5. Bảo mật
| Mối đe dọa | Chặn |
|---|---|
| Đoán link kèo | slug ~95 bit; không liệt kê; trả cùng 1 trang 404 cho mọi slug sai |
| Đọc DB bằng anon key | RLS bật, không policy; anon key không dùng ở client |
| Lộ service role key | chỉ server, `server-only`, test quét bundle client không có chuỗi khóa |
| Thao tác vào kèo khác (IDOR) | mọi action nhận `slug` + id; server kiểm id thuộc đúng kèo và thiết bị là thành viên có quyền |
| Mạo danh (chọn tên người khác) | chấp nhận ở v1 (không tài khoản), có hỏi lại + ghi hoạt động công khai **[Q5]** |
| **Chiếm tài khoản nhận tiền** (chọn tên người được nợ rồi thay số TK của mình) — P0 | D9: máy gắn vào tên có sẵn phải đợi 24 giờ mới lưu/xóa được TK; TK đổi trong 48 giờ **hoặc** được lưu từ máy `claimed` (kể cả lần đầu) → cảnh báo trên thẻ S10 của người nợ; mọi lần lưu/xóa TK hiện trong hoạt động (không có số TK) |
| **Khoản chi giả** (tạo tên gần giống "Tuấn." hay "Tuấn😀" rồi ghi khoản chi mình "đã trả" để cả nhóm nợ mình) | khóa tên chỉ giữ chữ/số nên tên gần giống bị coi là trùng (PRD R1); thành viên < 48 giờ có nhãn "mới"; banner R10 báo cả khoản chi **mới** do người khác ghi làm đổi phần của tôi; hoạt động công khai; giới hạn tạo tên/thiết bị theo IP (D8) |
| Xóa cookie liên tục để có thiết bị mới (né giới hạn theo thiết bị) | `create_device:ip` 30/giờ, 100/24h trong `ensureDevice()`; máy mới gắn vào tên có sẵn vẫn chịu 24 giờ (D9) |
| Người nợ đánh dấu "đã chuyển" khống | người nhận bấm "Chưa nhận được" (hủy lần đánh dấu, ghi hoạt động); nhãn nhắc kiểm tra app ngân hàng |
| Mạo danh người tạo kèo để chốt/sửa khoản | chấp nhận ở v1; mọi thay đổi có hoạt động trước/sau; ghi lại ở 7. Rủi ro |
| Sửa bậy chi tiêu | quyền theo R9 + lịch sử trước/sau **[Q3]** |
| Lộ số TK | chỉ trả về cho thiết bị đã chọn tên **[Q4]**; không log; không gửi bên thứ ba |
| XSS qua tên/ghi chú | React escape; không dùng `dangerouslySetInnerHTML`; giới hạn độ dài, bỏ ký tự điều khiển |
| CSRF | Server Actions của Next (kiểm Origin) + cookie SameSite=Lax |
| Spam / tạo kèo, tên hàng loạt | giới hạn theo thiết bị **và** theo IP (D8); IP chỉ lưu HMAC, xóa sau 7 ngày |
| Link độc trong "link chỗ" | chỉ cho `https://`, hiện tên miền, mở với `rel="noopener noreferrer nofollow"` |

## 6. Quan sát
- `/api/health`: kiểm kết nối DB (1 truy vấn `select 1`), trả `{ ok, version }`.
- Log server: không chứa token, IP, số TK, nội dung tin nhắn. Lỗi có mã (`code`) như trong 04-contracts.
- Vercel Analytics (Web Vitals) để đo M7 — **chưa chốt**, có thể bật ở Bước 19 (miễn phí gói Hobby).

## 7. Rủi ro kỹ thuật
- Trình duyệt Zalo có thể xóa cookie → mất "danh tính"; cách gỡ: chọn lại tên (Q5).
- Webview chặn tải file → giữ cách chạm giữ ảnh QR.
- Kế hoạch chuyển có thể đổi người nhận sau khi sửa chi tiêu (đã giảm bằng bước "giữ cặp đã trả");
  banner P11 giải thích thay đổi cho người bị ảnh hưởng.
- Ai chọn tên người tạo kèo cũng có quyền người tạo (chốt, sửa mọi khoản). v1 chấp nhận vì có hoạt động công
  khai; nếu bug bash thấy cần, áp quy tắc 24 giờ của D9 cho quyền người tạo.
