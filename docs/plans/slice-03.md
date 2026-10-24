# Slice 03 — Chốt kèo, mở lại vote, sửa kèo  (song song được với 04)

## Mục tiêu
Người tạo chốt được kèo; thẻ tóm tắt ghim ở đầu tab Kèo cho mọi người; mở lại vote được; sửa tên kèo, thêm/bớt
ngày và chỗ khi chưa chốt.

## Story
US-06, US-07, US-08. Quy tắc PRD R2 (chốt, mặc định nhiều phiếu nhất, "ai đi"), R9 (người tạo). Màn S5 (P07),
S6 phần thẻ ghim + trạng thái trống (P08), S1 chế độ sửa.

## File được sửa / tạo
- `lib/actions/trip.ts`: thêm `updateTrip`, `closeTrip`, `reopenVoting` (không đổi `createTrip`).
- Migration `supabase/migrations/<YYYYMMDDHHMMSS>_closing_functions.sql`: `app_update_trip`, `app_close_trip`,
  `app_reopen_voting` theo D10 (khóa theo kèo; kiểm lại trong hàm: người gọi là người tạo, trạng thái `voting`/`closed`).
- `lib/view/sections/closing.ts` (điền khung từ slice 02a: thẻ ghim, lựa chọn mặc định ở S5).
- `app/k/[slug]/chot/page.tsx` (S5), `app/k/[slug]/sua/page.tsx` (S1 chế độ sửa, dùng lại form của `app/tao`),
  `app/k/[slug]/page.tsx` (S6: thẻ ghim, "Chưa có khoản chi nào" + nút "Thêm khoản chi" trỏ `/k/[slug]/chi-tieu/them`,
  nút "Mở lại vote" cho người tạo; **không** thêm thẻ nợ — đó là slice 05).
- Component: `PinnedSummary`, `CloseTripForm`, `ConfirmDialog`.
- Test: `tests/integration/closing.test.ts` (I-6, reopen giữ phiếu, sửa kèo bỏ lựa chọn xóa phiếu),
  dòng ma trận cho `updateTrip`, `closeTrip`, `reopenVoting` (nối cuối file), `tests/e2e/close.spec.ts` (`@slice03`).

## File cấm sửa
Theo [README](README.md). Thêm (để chạy song song với 04): `lib/view/sections/expenses.ts`,
`lib/actions/expenses.ts`, `app/k/[slug]/chi-tieu/**`, `lib/view/build-trip-view.ts`, `lib/view/sections/core.ts`.

## Phụ thuộc
Slice 02b. Không phụ thuộc 04.

## Lệnh kiểm tra
```bash
npm run check
npm run test:int
npm run test:e2e -- --grep @slice03
```

## Tiêu chí xong
- [ ] AC-06.1..06.3, AC-07.1, AC-08.1, AC-10.3 (trạng thái trống ở S6) đạt.
- [ ] Ma trận quyền xanh cho 3 action mới (người ngoài `NOT_MEMBER`, thành viên thường `FORBIDDEN`, người tạo ok).
- [ ] Sau khi chốt: `setVote` → `TRIP_CLOSED`; mở lại → vote được, phiếu cũ còn.
- [ ] GATE: test tay trên điện thoại.
