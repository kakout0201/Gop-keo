# Test plan — Góp Kèo v1

Trạng thái: Bước 7, chờ GATE. Áp dụng từ Bước 10 (slice 00) đến Bước 18.
Nguyên tắc: **test trước, code sau** cho mọi logic tiền và quyền; mỗi lỗi P0–P1 có test tái hiện trước khi sửa.

## 1. Các tầng test
| Tầng | Công cụ | Phạm vi | Chạy khi |
|---|---|---|---|
| Unit | Vitest + fast-check | `lib/domain/*` (tiền, kế hoạch chuyển, VietQR, chữ, tin nhắn, quyền) | mỗi lần lưu (`npm test`), CI |
| Integration | Vitest + Supabase (local hoặc dev, chốt ở Bước 9) | Server Actions + `getTripView` với DB thật, schema/ràng buộc | `npm run test:int`, CI |
| E2E | Playwright (Chromium, viewport 360×780 và 390×844, Android UA) | luồng người dùng theo [06-acceptance.md](06-acceptance.md) | trước mỗi `/ship`, Bước 17 |
| Smoke | Playwright, tag `@smoke` | trang chủ, `/api/health`, tạo kèo → mở link | sau deploy (Bước 10, 19) |
| A11y | @axe-core/playwright | mọi màn trong E2E, không lỗi `serious`/`critical` | cùng E2E |
| Hiệu năng | Lighthouse CI (mobile, 4G chậm) | trang kèo có dữ liệu mẫu: LCP ≤ 3 s, JS client ≤ 150 KB gzip | Bước 17, trước release |
| Thủ công | điện thoại thật, trình duyệt Zalo | lưu ảnh QR, quét bằng app ngân hàng, copy/dán Zalo | Bước 11–16 (GATE từng slice), Bước 18 |

Lệnh `npm run check` = lint + typecheck + unit (+ integration nếu có DB). Phải xanh trước khi commit slice.

## 2. Unit — logic tiền (bắt buộc 100% nhánh cho `split`, `balances`, `transfers`)

### 2.1 `splitEqual` (R3)
| # | Ca | Mong đợi |
|---|---|---|
| U-S1 | 2.800.000 chia 7 | 7 × 400.000 |
| U-S2 | 600.000 chia 5 (Hùng, Linh, Tuấn, Nam, Khoa), Tuấn trả | 5 × 120.000 |
| U-S3 | 600.000 chia 7, Tuấn trả | 6 × 86.000, Tuấn 84.000; `roundingNote` = "Chia lẻ nên làm tròn đến 1.000 ₫: 86.000 ₫ mỗi người, riêng Tuấn (người trả) 84.000 ₫." |
| U-S4 | 100.000 chia 3, người trả không nằm trong danh sách | 33.333 làm tròn 33.000; người vào kèo sớm nhất trong danh sách chịu chênh: 34.000, hai người còn lại 33.000 |
| U-S5 | 15.000 chia 7, Hùng trả và có trong danh sách | 2.142 làm tròn 2.000 → 6 × 2.000, Hùng 3.000 |
| U-S6 | 10.000 chia 20 (mỗi phần dưới 1.000 ₫) | chia đến từng đồng: 20 × 500 |
| U-S6b | 30.000 chia 20 (1.500 làm tròn lên 2.000 → người chịu chênh âm) | dùng làm tròn xuống: 19 × 1.000, người chịu chênh 11.000 |
| U-S7 | 1 người | người đó = toàn bộ |
| U-S8 | 7.500 chia 3 (chia hết, không phải bội 1.000) | 3 × 2.500, không ghi chú làm tròn |
| P-S1 | property: mọi amount ∈ [1.000; 5·10^8], n ∈ [1; 20] | tổng = amount; mọi phần ≥ 0; mọi phần trừ người chịu chênh bằng nhau; chênh lệch người chịu chênh − phần chuẩn có \|x\| < 1.000 × n |

### 2.2 `computeBalances` (R4)
- U-B1 dữ liệu mẫu: Hùng +1.930.000, Linh +1.580.000, Tuấn −270.000, Mai −750.000, Thảo −750.000,
  Nam −870.000, Khoa −870.000.
- U-B2 khoản đã xóa không tính. P-B1 property: tổng số dư = 0.

### 2.3 `planTransfers` (R5, D4)
| # | Ca | Mong đợi |
|---|---|---|
| U-T1 | dữ liệu mẫu, chưa ai trả | Nam→Hùng 870.000, Khoa→Hùng 870.000, Mai→Linh 750.000, Thảo→Linh 750.000, Tuấn→Hùng 190.000, Tuấn→Linh 80.000 (6 dòng) |
| U-T2 | U-T1 + Nam trả Hùng 870.000, Mai trả Linh 750.000 | 2 dòng xong, 4 dòng còn lại y như U-T1 |
| U-T3 | U-T1 + Tuấn trả Hùng 190.000 | Tuấn→Linh vẫn 80.000; các dòng khác không đổi |
| U-T4 | Bia ban đầu chia 6 (có Mai) → Mai trả theo kế hoạch 850.000 → sửa Bia chia 5 | kế hoạch lúc chia 6 cho Mai → Hùng 850.000; sau khi sửa: Hùng hoàn lại cho Mai 100.000 (đúng người Mai đã chuyển); tổng dòng của mỗi người khớp số dư − đã chuyển |
| U-T5 | không ai nợ ai | 0 dòng; tiến độ 0/0 hiển thị "Chưa có gì phải trả" |
| U-T6 | trả xong rồi hoàn tác (payment voided) | như chưa trả |
| U-T7 | thứ tự hòa | số nợ bằng nhau → người vào kèo trước được xếp trước (Nam trước Khoa) |
| U-T8 | người đã chuyển rồi trở thành người được nợ sau khi sửa | dòng hoàn lại toàn bộ số đã chuyển; người đó có dòng nhận như bình thường |
| P-T1 | property (ngẫu nhiên 2–20 người, 1–30 khoản, lần chuyển ngẫu nhiên) | với mỗi người: Σ(nhận) − Σ(chuyển) theo các dòng = số dư − đã chuyển ròng |
| P-T2 | property: lần chuyển đều ≤ dòng kế hoạch gốc | L = P0 (không dòng chưa trả nào đổi) |
| P-T3 | property | không có dòng `remainingVnd` âm; không có cặp trùng; tất định (gọi 2 lần ra cùng kết quả, xáo thứ tự đầu vào không đổi kết quả) |

### 2.4 Khác
- `progress` (R7): dữ liệu mẫu sau Nam và Mai/Thảo trả → "2/6 lần chuyển · 1.620.000 / 3.510.000 ₫".
- `diffForMember`: ca P11 → trước 850.000, sau 750.000, đã chuyển 850.000, được hoàn 100.000;
  "Hùng, Linh, Tuấn, Nam, Khoa: mỗi người trả thêm 20.000 ₫"; Thảo không đổi.
- `formatVnd`: 0 → "0 ₫", 870000 → "870.000 ₫" có NBSP; số âm không bao giờ hiện (dùng chữ "nợ").
- `formatDateRange`: 2026-11-21..22 → "T7–CN 21–22/11"; khoảng qua tháng 30/11–1/12 → "CN–T2 30/11–1/12".
- `nameKey`: "Tuấn", "tuan", " TUẤN ", "Tuấn.", "T.u.a.n 😀", "tu an", "Tu\u200Bấn" (có ký tự ẩn zero-width) cùng
  khóa "tuan"; "Đạt" → "dat"; "Nam2" → "nam2"; "😀", "...", "   " → rỗng → `MemberName` báo "Tên cần có chữ hoặc số".
  Property: `nameKey` chỉ ra `[a-z0-9]*`, độ dài ≤ độ dài tên.
- `toBankName`: "Nguyễn Văn Hùng" → "NGUYEN VAN HUNG"; "Đỗ  Thị   Ánh" → "DO THI ANH".
- `initials`: Tuấn/Thảo → "T"/"Th"; 2 người cùng "Tuấn" không xảy ra (khóa tên duy nhất).
- `transferNote`: "Vũng Tàu 2N1Đ" + "Khoa" → "GOPKEO VT2 KHOA"; tên dài bị cắt còn ≤ 25 ký tự; chỉ A–Z 0–9 space.
- `buildVietQrPayload`: so khớp từng trường TLV; CRC16 đúng với bộ test vector CRC-CCITT (0x29B1 cho
  "123456789"); payload dựng ra được giải mã lại bằng bộ đọc QR (jsQR) từ ảnh PNG do `qrcode` vẽ;
  so với ít nhất 1 mẫu VietQR công khai của Napas/ngân hàng (ghi nguồn trong test).
- `reminderText`: 4 mẫu R11 với dữ liệu mẫu ra đúng chuỗi; không chứa "nè"/"nha" ở tin tiền.
- `explainMyShare` (US-22): Khoa với dữ liệu mẫu → items Homestay 400.000, Hải sản tối 350.000, Bia 120.000;
  tổng 870.000, đã trả 0, số dư −870.000. Mai → Bia `myShareVnd = 0`. Tuấn → `iPaidVnd` Bia 600.000, số dư −270.000.
  Property: `balanceVnd` = số dư của `computeBalances`.
- `canEditPayoutAccount` (R12): `created` → ok; `claimed` 23:59 trước → không, `allowedAt` = lúc gắn + 24h;
  `claimed` 24:00 trước → ok (biên đúng 24 giờ là được).
- `recentWarning` (R12.2): `changed_at` 47:59 trước → `changed`; 48:01 trước → null; lần nhập đầu từ máy `created` →
  null; lần nhập đầu từ máy `claimed` 47:59 trước → `new_device`; cả hai → `changed`.
- Nhãn "mới": thành viên vào 47:59 trước → `isNew`; 48:01 → không; người tạo kèo → không bao giờ.
- Lấy IP (D8): `x-real-ip` có → dùng; chỉ có `x-forwarded-for: "1.2.3.4, 10.0.0.1"` → "1.2.3.4"; không có → "local";
  IPv6 `2001:db8:1:2:aaaa::1` và `2001:db8:1:2:bbbb::9` cùng key (/64); HMAC khác nhau giữa 2 bucket.
- `can()` (R9): bảng quyền đầy đủ — mỗi dòng R9 × {người tạo, người ghi, người trả, thành viên khác,
  người chưa chọn tên} → đúng/sai.

## 3. Integration (Server Actions + DB)
Mỗi test tạo kèo riêng (slug ngẫu nhiên), không phụ thuộc thứ tự. Cookie thiết bị giả lập qua helper.
| # | Ca |
|---|---|
| I-1 | `createTrip` ghi đủ trip, member #1, member_devices, options, event; đặt cookie khi chưa có |
| I-2 | `createTrip` lần 21 trong 24h cùng thiết bị (mỗi lần một `x-real-ip` khác để không chạm giới hạn IP) → `LIMIT_REACHED` |
| I-3 | `claimMember` tên đã có máy khác → `NAME_IN_USE_ELSEWHERE`; xác nhận → 2 thiết bị, event `member_new_device` |
| I-4 | `joinAsNewMember` "tuan" khi đã có "Tuấn" → `NAME_TAKEN` + memberId; người thứ 21 → `LIMIT_REACHED` |
| I-5 | `setVote` idempotent; khi đã chốt → `TRIP_CLOSED`; chưa chọn tên → `NOT_MEMBER` |
| I-6 | `closeTrip` bởi không phải người tạo → `FORBIDDEN`; thiếu chỗ khi kèo có chỗ → `VALIDATION` |
| I-7 | `createExpense` lưu phần chia đúng R3; tổng phần chia = số tiền (DB chặn nếu sai) |
| I-8 | `updateExpense` version cũ → `STALE` kèm khoản hiện tại; người không có quyền → `FORBIDDEN` |
| I-9 | `markSent` số tiền cũ → `STALE`; dòng đã xong → `NOTHING_TO_PAY`; ghi đúng `remainingVnd` |
| I-10 | `voidPayment` bởi người khác người ghi → `FORBIDDEN`; gọi 2 lần → ok |
| I-11 | **IDOR:** mọi action dùng `memberId`/`expenseId`/`optionId`/`paymentId` của kèo B với slug kèo A → `TRIP_NOT_FOUND`, DB không đổi |
| I-12 | `getTripView`: người chưa chọn tên không có `accounts`, không có `me`; người đã chọn tên chỉ thấy TK của người trong `me.toPay` [Q4]; không trường nào chứa token/device id |
| I-13 | Schema: chèn trực tiếp sai tổng phần chia / tự chuyển cho mình / tên TK có dấu → DB báo lỗi |
| I-14 | Dùng **anon key** gọi REST Supabase vào mọi bảng → bị từ chối (RLS + revoke) |
| I-15 | Ca P11 đầy đủ qua action: tạo 3 khoản (Bia chia 6) → Mai `markSent` → Tuấn `updateExpense` (chia 5) → `getTripView` của Mai có `unseenChanges` đúng số và dòng hoàn lại 100.000 → `markChangesSeen` → banner mất |
| I-16 | **R12a:** máy B `claimMember` vào Hùng (đã xác nhận máy mới) → `savePayoutAccount` và `deletePayoutAccount` → `FORBIDDEN` `NEW_DEVICE_COOLDOWN` đúng câu PRD, `payout_accounts` không đổi. Giả lập 24 giờ sau (đặt `member_devices.created_at` lùi 24h) → được. Máy A (`created`) → được ngay |
| I-17 | **R12a, ca "đổi":** máy A của Hùng `releaseClaim` → máy B chọn Hùng (không bị hỏi xác nhận vì tên không còn máy) → vẫn `NEW_DEVICE_COOLDOWN` |
| I-18 | **R12.2a:** Hùng (máy `created`) lưu TK lần đầu → `getTripView` của Khoa có `recentWarning = null`; Hùng lưu lại số khác → `{reason:"changed"}`; xóa rồi nhập lại → vẫn `changed`; lùi `changed_at` 48h → null |
| I-23 | **R12.2b:** Nam chưa có TK; máy X `claimMember` vào Nam, lùi `member_devices.created_at` 24h để qua thời gian chờ, `savePayoutAccount` (lần nhập đầu) → DB có `saved_by_device_id = X`, `saved_from_claimed_device = true`; người nợ Nam thấy `recentWarning = {reason:"new_device"}`; máy X sau đó bấm "đổi" (xóa `member_devices`) → cảnh báo vẫn còn; lùi `updated_at` 48h → null |
| I-24 | **Banner khoản mới (R10):** Linh `createExpense` "Cà phê" 140.000 chia 7 → `getTripView` của Khoa có `unseenChanges.items[0]` `kind:"created"`, `myShareBeforeVnd 0`, `myShareAfterVnd 20000`; của Linh (người ghi) **không** có; của người không bị tính **không** có; Linh ghi khoản mà Hùng là người trả → banner của Hùng **có** (số được nhận đổi); `markChangesSeen` → hết |
| I-25 | **Chống tên gần giống:** đã có "Tuấn" → `joinAsNewMember` "Tuấn.", "TUAN 😀", "T u a n" đều `NAME_TAKEN` (memberId của Tuấn); "😀" → `VALIDATION`. Người vừa vào có `isNew = true` trong `members`; người tạo `isNew = false` |
| I-26 | **Giới hạn tạo thiết bị:** 30 request **không cookie** cùng IP gọi `claimMember`/`joinAsNewMember`/`createTrip` → request 31 `RATE_LIMITED`, bảng `devices` không thêm dòng; request **có cookie hợp lệ** cùng IP không bị đếm; IP khác vẫn được |
| I-19 | **R12c:** sau mỗi lần lưu/xóa TK, `activity` của **người chưa chọn tên** có dòng "Hùng vừa lưu tài khoản nhận tiền (MB Bank)"; JSON trả về (và `trip_events.payload` trong DB) không chứa số TK, tên chủ TK |
| I-20 | **Giới hạn IP:** 10 lần `createTrip` cùng `x-real-ip` từ 10 thiết bị khác nhau → lần 11 `RATE_LIMITED`, không tạo trip; IP khác vẫn tạo được; 30 lần `joinAsNewMember` cùng IP (nhiều kèo) → lần 31 `RATE_LIMITED`. `rate_limit_hits` không có cột/giá trị nào bằng IP gốc (so chuỗi IP với mọi cột) |
| I-21 | **Giới hạn IP song song:** 12 lời gọi `createTrip` đồng thời cùng IP → đúng 10 thành công |
| I-22 | **"Chưa nhận được":** Khoa `markSent` 870.000 → Hùng `disputePayment` → payment `void_reason='disputed'`, event `payment_disputed`; `getTripView` của Khoa: dòng Khoa→Hùng `remainingVnd = 870000` và có `lastDispute`; tiến độ giảm lại. Nam `disputePayment` lần đó → `FORBIDDEN`; Khoa (người trả) → `FORBIDDEN`; Hùng dispute lần do chính Hùng `markReceived` → `FORBIDDEN`; gọi lại lần đã dispute → ok, không ghi thêm event |

## 3b. Ma trận quyền — gọi THẬT từng action (integration)
`tests/integration/permissions.matrix.test.ts`. Mỗi ô: dựng kèo mẫu (fixture §7), chụp **dấu vân DB** của kèo
(đếm + hash nội dung mọi bảng có `trip_id`, cộng `rate_limit_hits` và `devices`), gọi action **qua đúng hàm Server
Action** với cookie của vai đó, rồi kiểm (1) mã kết quả, (2) nếu lỗi thì dấu vân DB **không đổi**, (3) nếu thành
công thì chỉ đúng các dòng mong đợi đổi. Bảng sinh tự động từ danh sách action trong 04-contracts §3; thêm action
mới mà thiếu dòng ở ma trận → test fail.

Vai: **N** = người ngoài (không cookie, **và** cookie của thành viên kèo khác); **K** = thành viên không đủ quyền;
**Đ** = người đủ quyền. Mọi action có slug còn chạy thêm: slug sai → `TRIP_NOT_FOUND`; id thuộc kèo khác → `TRIP_NOT_FOUND` (I-11).

| Action | N (ngoài / chưa chọn tên) | K (thành viên không đủ quyền) | Đ (đủ quyền) |
|---|---|---|---|
| `createTrip` | ok (không cần là thành viên); tạo cookie nếu chưa có | — | ok |
| `updateTrip` | `NOT_MEMBER` | `FORBIDDEN` (thành viên thường); `TRIP_CLOSED` (người tạo, kèo đã chốt) | ok (người tạo, đang vote) |
| `closeTrip` | `NOT_MEMBER` | `FORBIDDEN` | ok (người tạo) |
| `reopenVoting` | `NOT_MEMBER` | `FORBIDDEN` | ok (người tạo, kèo đã chốt) |
| `claimMember` | ok với tên chưa có máy; `NAME_IN_USE_ELSEWHERE` với tên đã có máy khi chưa xác nhận | — | ok (đã xác nhận) |
| `joinAsNewMember` | ok; `NAME_TAKEN` khi trùng | — | ok |
| `releaseClaim` | `NOT_MEMBER` | — | ok |
| `setVote` | `NOT_MEMBER` | `TRIP_CLOSED` (kèo đã chốt) | ok |
| `createExpense` | `NOT_MEMBER` | — (mọi thành viên được) | ok |
| `updateExpense` | `NOT_MEMBER` | `FORBIDDEN` (không phải người ghi/người trả/người tạo) | ok × 3 vai: người ghi, người trả, người tạo |
| `deleteExpense` | `NOT_MEMBER` | `FORBIDDEN` (như trên) | ok × 3 vai |
| `markChangesSeen` | `NOT_MEMBER` | — | ok |
| `savePayoutAccount` | `NOT_MEMBER` | `FORBIDDEN` `NEW_DEVICE_COOLDOWN` (máy `claimed` < 24h) | ok (máy `created`, hoặc `claimed` ≥ 24h) |
| `deletePayoutAccount` | `NOT_MEMBER` | `FORBIDDEN` `NEW_DEVICE_COOLDOWN` | ok |
| `markSent` | `NOT_MEMBER` | `NOTHING_TO_PAY` (gửi `toMemberId` mà tôi không nợ, vd Mai → Hùng) | ok (Khoa → Hùng) |
| `markReceived` | `NOT_MEMBER` | `NOTHING_TO_PAY` (Linh đánh dấu đã nhận từ Khoa, người không nợ Linh) | ok (Hùng nhận từ Khoa) |
| `voidPayment` | `NOT_MEMBER` | `FORBIDDEN` (không phải người đã ghi, kể cả người nhận) | ok (người đã ghi) |
| `disputePayment` | `NOT_MEMBER` | `FORBIDDEN` (người trả; người ngoài cặp; lần `received`) | ok (người nhận, lần `sent`) |
Ghi chú: "ok" nghĩa là `{ ok: true }` và DB đổi đúng phần mong đợi. Ô "—" là không có vai đó.

## 4. E2E (Playwright) — theo kịch bản Given/When/Then ở 06-acceptance.md
Hai trình duyệt độc lập (2 context = 2 thiết bị) để thử nhiều người. Ở 360px và 390px:
1. **Chốt kèo:** Hùng tạo kèo (S1) → S2 copy link → Tuấn mở link (context 2) → chạm 21–22/11 → S4 chọn
   "Chưa thấy tên mình?" gõ "Tuấn" → toast "Đã lưu vote của Tuấn!" + "bạn đã vote" → Hùng chốt (S5) → cả hai thấy thẻ ghim.
2. **Chi tiêu:** 3 khoản dữ liệu mẫu → S8 số dư khớp U-B1 → S7 chia 7 cho 600.000 thấy câu làm tròn.
3. **Trả tiền:** Hùng nhập TK (S9) → Khoa mở link mới (context 3) → "Xem mình nợ bao nhiêu" → chọn Khoa → S10
   thấy 870.000 ₫, QR hiện, nút "Lưu ảnh QR" tải được file PNG, nút copy số TK/số tiền (870000)/nội dung →
   "Mình đã chuyển 870.000 ₫ cho Hùng" → P14 → Hùng thấy Khoa ở "Đã trả bạn" → Khoa hoàn tác → quay lại.
4. **Tin nhắc:** Hùng ở S11 → "Nhắc 2 người chưa trả" → P20 đổi "Ngắn gọn", sửa chữ → copy (đọc clipboard) →
   P16; P21 copy tin cho Tuấn → nút đổi "Đã copy tin cho Tuấn".
5. **Sửa sau khi trả:** ca I-15 trên giao diện → Mai thấy banner P11, chấm đỏ tab Chi tiêu khi đang ở tab khác.
6. **Lỗi và trống:** slug sai → trang không tìm thấy; ngắt mạng khi vote → báo lỗi, phiếu quay lại; trang kèo
   chưa có chi tiêu → trạng thái trống.
7. **Chấm đỏ:** không bao giờ hiện trên tab đang mở (E3).
8. **Gộp nợ:** Khoa bấm "Xem chi tiết" ở S10 → thấy 3 khoản với phần của mình và phép tính 870.000 ₫.
9. **Chiếm TK:** context 4 chọn tên Hùng (xác nhận máy mới) → S9 báo câu chờ 24 giờ, không có nút lưu; Hùng
   (context 1) đổi số TK → Khoa thấy cảnh báo "Hùng vừa đổi tài khoản nhận tiền lúc …" trên thẻ S10.
10. **Chưa nhận được:** Khoa đánh dấu → Hùng bấm "Chưa nhận được" → Khoa thấy dòng quay lại "Chưa chuyển" và lý do.
So ảnh: chụp các màn chính ở 390×844 so với [design/screens/](design/screens/) bằng mắt (Bước 17), không dùng
so pixel tự động vì dữ liệu/thời gian khác nhau.

## 5. Bảo mật (Bước 17, subagent security-auditor)
- Quét bundle client (`.next/static`) không có `SUPABASE_SERVICE_ROLE_KEY`, chuỗi `service_role`, hay URL DB.
- Không file `.env*` nào trong git (`git ls-files | grep .env` rỗng).
- Cookie `gk_device`: HttpOnly, Secure, SameSite=Lax.
- I-11, I-12, I-14 xanh. Thử XSS: tên `<img src=x onerror=alert(1)>` hiện đúng chữ, không chạy.
- Link chỗ `javascript:`/`http:` bị từ chối.
- Log server không chứa số TK, IP, token (grep log của test integration với chuỗi IP/số TK dùng trong test).
- Ma trận §3b xanh; I-16..I-26 xanh.

## 6. Thủ công trên thiết bị thật (Bước 11–16 GATE, Bước 18)
| # | Việc | Thiết bị |
|---|---|---|
| M-1 | Mở link trong Zalo (Android tầm trung, iPhone) → thấy kèo ≤ 3 s qua 4G | 2 máy |
| M-2 | "Lưu ảnh QR" trong trình duyệt Zalo: có tải được không; nếu không, chạm giữ ảnh có lưu được không | Android + iOS |
| M-3 | Mở app ngân hàng → Quét mã → chọn ảnh vừa lưu → điền đúng số TK, tên, số tiền, nội dung | ≥ 3 app ngân hàng khác nhau |
| M-4 | Quét thẳng QR từ máy thứ hai | 1 app |
| M-5 | Copy số tiền dán vào app ngân hàng ra đúng "870000" | 2 app |
| M-6 | Copy tin nhắc, dán vào Zalo: xuống dòng, dấu tiếng Việt, link bấm được | Zalo |
| M-7 | Xóa dữ liệu trình duyệt rồi mở lại → chọn lại tên, được hỏi xác nhận máy mới | 1 máy |
| M-8 | Màn 360px không tràn ngang; chữ ₫ không xuống dòng | Android nhỏ |
Kết quả ghi vào docs/qa/report.md (Bước 17–18) và trạng thái 8 giả định ở STATUS.

## 7. Dữ liệu mẫu (fixture dùng chung)
`tests/fixtures/vung-tau.ts`: kèo "Vũng Tàu 2N1Đ"; thành viên theo thứ tự Hùng, Linh, Tuấn, Mai, Thảo, Nam,
Khoa; ngày 14–15, 21–22, 28–29/11/2026; chỗ Homestay Biển Xanh 2.800.000 ₫/đêm, Villa Bãi Sau 3.500.000 ₫/đêm;
chi tiêu Homestay 2.800.000 (Hùng, chia 7), Hải sản tối 2.450.000 (Linh, chia 7), Bia 600.000 (Tuấn, chia 5
trừ Mai, Thảo); TK Hùng MB Bank (BIN 970422) 000011112222 NGUYEN VAN HUNG.

## 8. Chưa kiểm chứng / rủi ro test
- Chạy E2E trong đúng webview Zalo là không tự động được → chỉ thủ công (M-1..M-6).
- Bộ test vector VietQR chính thức: chưa có nguồn; Bước 10 tìm mẫu công khai, nếu không có thì dựa vào M-3.
- Supabase local cần Docker/WSL2 (chốt ở Bước 9); nếu dùng project dev cloud, test integration chạy tuần tự.
