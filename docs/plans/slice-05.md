# Slice 05 — Trả tiền phía người nợ, tài khoản nhận tiền, hoàn lại

## Mục tiêu
Người nợ mở link là thấy mình nợ ai bao nhiêu, có mã VietQR đúng số tiền, lưu được ảnh QR, copy được số TK/số tiền/
nội dung, đánh dấu "đã chuyển" và hoàn tác. Người được nợ nhập tài khoản an toàn (chờ 24 giờ với máy mới, cảnh báo
khi vừa đổi). Sửa chi tiêu sau khi đã trả tạo dòng hoàn lại đúng người. Đây là slice rủi ro cao nhất (giả định 4, 5).

## Story
US-12, US-13, US-14, US-18, US-20, US-22, US-23. Quy tắc PRD R5, R6 (đã chuyển, hoàn tác), R8, R10 (chấm đỏ Trả tiền),
R12. Kiến trúc D4, D6, D9. Màn S9 (P17), S10 (P13, P14), S6 người nợ (P12), S6 người mới (P18), S4 khi xem nợ (P19).

## File được sửa / tạo
- `lib/actions/accounts.ts` (`savePayoutAccount`, `deletePayoutAccount` với 24 giờ, `changed_at`,
  `saved_by_device_id`, `saved_from_claimed_device`), `lib/actions/payments.ts` (`markSent`, `voidPayment`).
- Migration `supabase/migrations/<YYYYMMDDHHMMSS>_payment_functions.sql`: `app_save_payout_account`,
  `app_delete_payout_account`, `app_mark_sent`, `app_void_payment` theo D10. `app_mark_sent` nhận `p_expected_money_version`
  và số tiền server đã tính; **kiểm lại trong hàm** `trips.money_version` = giá trị mong đợi (không thì `STALE`) rồi mới ghi
  và tăng `money_version`. Hàm TK kiểm lại thời gian chờ 24 giờ bằng `now()` của DB.
- `lib/view/sections/payments.ts` (điền khung: `transfers`, `me.toPay`, `accounts` chỉ cho người trong `me.toPay`,
  `recentWarning`, `me.breakdown`, `canEditPayoutAccount`, chấm đỏ Trả tiền, `progress`).
- `app/k/[slug]/tra-tien/page.tsx` (phần S10 "Bạn cần chuyển"; phần S11 để slice 06), `tra-tien/tai-khoan/page.tsx` (S9),
  `app/k/[slug]/page.tsx` (S6: thẻ "Bạn đang nợ … · Trả … cho …" P12, "Xem mình nợ bao nhiêu" P18, tóm tắt chi tiêu).
- Component: `DebtCard` (QR, "Lưu ảnh QR", 3 bước, bảng 5 dòng có copy, cảnh báo R12, thu gọn/mở thẻ sau — G7),
  `QrImage` (`qrcode` → PNG `<img>`, tạo ảnh lưu có chữ), `CopyField` (số tiền copy dạng số trơn), `BreakdownSheet`
  (US-22), `AccountForm` (S9, tự đổi IN HOA không dấu, QR xem trước, nhớ TK trên máy bằng localStorage có try/catch),
  `PaidState` (P14).
- Test: `tests/integration/payments.test.ts` (I-9, I-10, I-15), `concurrency.test.ts` (**I-27**: 2 `markSent` song song cho
  cùng dòng → đúng 1 payment được ghi, lệnh kia `STALE` hoặc `NOTHING_TO_PAY`), `accounts.test.ts` (I-12, I-16..I-19, I-23), dòng ma trận
  cho `savePayoutAccount`, `deletePayoutAccount`, `markSent`, `voidPayment`, `tests/e2e/pay.spec.ts` (`@slice05`: E2E 3, 5,
  8, 9; tải PNG; đọc clipboard "870000").

## File cấm sửa
Theo [README](README.md). Thêm: `lib/actions/expenses.ts`, `lib/actions/trip.ts`, `lib/view/sections/closing.ts`,
`lib/view/sections/expenses.ts` (chỉ đọc kết quả của chúng).

## Phụ thuộc
Slice 04 (cần chi tiêu). Slice 03 đã merge (cùng sửa `app/k/[slug]/page.tsx`).

## Lệnh kiểm tra
```bash
npm run check
npm run test:int
npm run test:e2e -- --grep @slice05
```

## Tiêu chí xong
- [ ] AC-12.1..12.7, AC-13.1..13.7, AC-14.1..14.4, AC-18.1..18.3, AC-22.1..22.3, AC-23.1..23.6, AC-11.2 (phần đã chuyển /
      được hoàn) đạt.
- [ ] Người chưa chọn tên: không có số TK trong HTML/JSON (AC-12.3, I-12).
- [ ] Ma trận quyền xanh cho 4 action, gồm `NEW_DEVICE_COOLDOWN`.
- [ ] **GATE thủ công bắt buộc** (05-test-plan §6): M-2 lưu ảnh QR trong trình duyệt Zalo (Android + iOS nếu có), M-3 quét
      ảnh đã lưu bằng **các app ngân hàng có sẵn (tối thiểu 1)** ra đúng số TK, tên, số tiền, nội dung; M-4, M-5. Ghi vào STATUS
      kết quả từng app đã thử **và danh sách app chưa thử** (giả định 4; thử thêm ở Bước 18).
