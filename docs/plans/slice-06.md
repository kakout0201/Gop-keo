# Slice 06 — Người được nợ, tin nhắc, tiến độ, "Đã nhận" / "Chưa nhận được"

## Mục tiêu
Người ứng tiền thấy ai đã trả, ai chưa, tiến độ cả nhóm; xem trước, sửa và copy tin nhắc (cả nhóm / nhắn riêng, nhẹ
nhàng / ngắn gọn) để dán vào Zalo; đánh dấu "Đã nhận" khi được trả tiền mặt; bấm "Chưa nhận được" khi bị đánh dấu khống.
Hoàn thiện ma trận quyền cho đủ 18 action.

## Story
US-15, US-16, US-17, US-19, US-21. Quy tắc PRD R6 (đã nhận, chưa nhận được), R7, R10 (chấm đỏ Trả tiền khi chưa có TK),
R11 (4 mẫu đòi tiền, mẫu hoàn lại). Màn S11 (P15, P16, P20, P21), tiến độ ở S6.

## File được sửa / tạo
- `lib/actions/payments.ts`: thêm `markReceived`, `disputePayment` (không đổi `markSent`, `voidPayment`).
- Migration `supabase/migrations/<YYYYMMDDHHMMSS>_receivable_functions.sql`: `app_mark_received` (kiểm lại
  `money_version` như `app_mark_sent`), `app_dispute_payment` (kiểm lại: người gọi là người nhận, `method='sent'`, chưa hủy)
  theo D10.
- `lib/view/sections/payments.ts`: thêm `me.toReceive`, `receivingTotalVnd`, `receivedVnd`, `lastDispute`.
- `app/k/[slug]/tra-tien/page.tsx` (phần S11 "Bạn được nhận": chưa trả / đã trả, "Đã nhận", "Chưa nhận được", lời nhắc
  kiểm tra app ngân hàng, "Nhận tiền vào: MB Bank ···2222 · Sửa", thẻ mời nhập TK), `tra-tien/nhac/page.tsx` (P20, P21, P16),
  `app/k/[slug]/page.tsx` (thanh tiến độ cả nhóm ở S6).
- Component: `ReceivableList`, `ProgressBar`, `SegmentedControl`, `MessagePreview` (sửa được, copy, Web Share nếu có),
  `DisputeDialog`.
- Test: `tests/integration/receivables.test.ts` (I-22, `markReceived` + hoàn tác, tiến độ), dòng ma trận cho `markReceived`,
  `disputePayment`; **bật kiểm "đủ 18 action"** trong `permissions.matrix.test.ts` (danh sách lấy từ 04-contracts §3);
  `tests/e2e/collect.spec.ts` (`@slice06`: E2E 4, 7, 10), axe trên S9–S11.

## File cấm sửa
Theo [README](README.md). Thêm: `lib/actions/accounts.ts`, `lib/actions/expenses.ts`, `lib/actions/trip.ts`,
`lib/domain/transfers.ts` (chỉ sửa lỗi kèm test tái hiện).

## Phụ thuộc
Slice 05.

## Lệnh kiểm tra
```bash
npm run check
npm run test:int
npm run test:e2e
```
(chạy **toàn bộ** e2e vì đây là slice cuối trước QA Bước 17.)

## Tiêu chí xong
- [ ] AC-15.1..15.2, AC-16.1..16.7, AC-17.1, AC-19.1, AC-21.1..21.4, AC-12.6 đạt.
- [ ] Ma trận quyền đủ 18 action × 3 vai xanh; I-11 (IDOR) xanh cho mọi action.
- [ ] Tin nhắc: không có "nè"/"nha" (AC-G.4); copy ra đúng chữ đã sửa; dán vào Zalo giữ dấu tiếng Việt và link bấm được (M-6).
- [ ] Toàn bộ `npm run test:e2e` xanh ở 360px và 390px.
- [ ] GATE: test tay trên điện thoại, một vòng đầy đủ: tạo kèo → vote → chốt → 3 khoản chi → nhập TK → trả bằng QR →
      nhắc → "Chưa nhận được" → đánh dấu lại.
