# Slice 04 — Ghi chi tiêu, bảng chi tiêu, sửa/xóa minh bạch  (song song được với 03)

## Mục tiêu
Ai trong kèo cũng ghi được khoản chi, thấy ngay mỗi người phải trả bao nhiêu (kèm câu làm tròn), xem bảng chi tiêu và
số dư từng người. Sửa/xóa theo quyền R9, có lịch sử, và mọi người bị ảnh hưởng thấy banner thay đổi (cả khoản mới do
người khác ghi). Hoạt động của kèo hiện ở cuối tab Chi tiêu.

## Story
US-09, US-10, US-11. Quy tắc PRD R3, R4, R9 (sửa/xóa), R10 (banner, chấm đỏ tab Chi tiêu). Màn S7 (P09), S8 (P10, P11).

## File được sửa / tạo
- `lib/actions/expenses.ts` (`createExpense`, `updateExpense`, `deleteExpense`, `markChangesSeen`; phần chia tính bằng
  `splitEqual` ở server; event `expense_*` với before/after).
- Migration `supabase/migrations/<YYYYMMDDHHMMSS>_expense_functions.sql`: `app_create_expense`, `app_update_expense`,
  `app_delete_expense`, `app_mark_changes_seen` theo D10 (khóa theo kèo; **kiểm lại `version` bên trong hàm** → `STALE`;
  kiểm giới hạn 200 khoản, quyền sửa/xóa R9; tăng `trips.money_version`).
- `lib/view/sections/expenses.ts` (điền khung: danh sách khoản, `canEdit`, `totals`, `balances`, `unseenChanges`,
  chấm đỏ Chi tiêu).
- `app/k/[slug]/chi-tieu/page.tsx` (S8, thay trang tạm), `chi-tieu/them/page.tsx`, `chi-tieu/[id]/page.tsx` (S7 thêm/sửa,
  xóa có xác nhận, lịch sử).
- Component: `ExpenseForm` (xem trước phần chia bằng **cùng** `splitEqual`), `ExpenseRow`, `BalanceList`,
  `ChangesBanner` (P11, nhiều dòng), `ExpenseHistory`, `ActivityList`.
- Test: `tests/integration/expenses.test.ts` (I-7, I-8, I-24, banner sửa/xóa không có phần thanh toán),
  `concurrency.test.ts` (**I-28**: 2 `updateExpense` song song cùng `expectedVersion` → đúng 1 thành công, 1 `STALE`), dòng ma trận
  cho 4 action, `tests/e2e/expenses.spec.ts` (`@slice04`: E2E 2; banner + chấm đỏ phần chi tiêu của E2E 5).

## File cấm sửa
Theo [README](README.md). Thêm (để chạy song song với 03): `app/k/[slug]/page.tsx`, `app/k/[slug]/chot/**`,
`app/k/[slug]/sua/**`, `lib/actions/trip.ts`, `lib/view/sections/closing.ts`, `lib/view/build-trip-view.ts`,
`lib/view/sections/core.ts`.

## Phụ thuộc
Slice 02b. Không phụ thuộc 03 (nút "Thêm khoản chi" ở S6 do 03 thêm, trỏ vào route của slice này).

## Lệnh kiểm tra
```bash
npm run check
npm run test:int
npm run test:e2e -- --grep @slice04
```

## Tiêu chí xong
- [ ] AC-09.1..09.5, AC-10.1..10.3, AC-11.1, AC-11.3..11.7 đạt; AC-11.2 đạt phần số dư + banner (phần "đã chuyển / được
      hoàn" kiểm ở slice 05).
- [ ] Dữ liệu mẫu cho đúng số dư U-B1 trên S8; câu làm tròn S7 đúng R3 (E7 đã thay dòng giữ chỗ).
- [ ] Ma trận quyền xanh cho 4 action (người ghi / người trả / người tạo được sửa; người khác `FORBIDDEN`).
- [ ] Hai máy cùng sửa: máy sau nhận `STALE` và số mới (AC-11.5).
- [ ] GATE: test tay trên điện thoại.
