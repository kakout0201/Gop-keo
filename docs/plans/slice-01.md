# Slice 01 — Lõi tính tiền và chữ (hàm thuần, không UI)

## Mục tiêu
Viết và test **trước** toàn bộ logic thuần trong `lib/domain` mà các slice sau dùng: chia tiền, số dư, kế hoạch chuyển
gộp nợ, tiến độ, VietQR, chữ (khóa tên, tên in hoa, ngày, tiền), tin soạn sẵn, quyền, cảnh báo. Không I/O, không DB,
chạy được cả client lẫn server. Sai ở đây là sai tiền, nên slice này có ngưỡng test cao nhất.

## Story
Nền cho US-09..US-23. Quy tắc PRD R1 (nameKey, nhãn "mới"), R3, R4, R5, R6, R7, R8 (VietQR, nội dung CK), R9 (bảng
quyền), R10 (banner), R11 (tin), R12 (24 giờ, cảnh báo). Kiến trúc D3, D4, D6.

## File được sửa / tạo
- `lib/domain/money.ts` (`formatVnd`, kiểm số nguyên an toàn), `split.ts` (`splitEqual` + `roundingNote`),
  `balances.ts`, `transfers.ts` (`planTransfers` theo D4), `progress.ts`, `explain.ts` (`explainMyShare`),
  `changes.ts` (tính `ExpenseChangesBanner` từ sự kiện + trạng thái trước/sau), `text.ts` (`nameKey`, `toBankName`,
  `initials`, `formatDateRange`, `formatTime`, `transferNote`), `vietqr.ts` (`buildVietQrPayload`, CRC16),
  `banks.ts` (danh sách BIN, ghi nguồn + ngày chụp), `reminders.ts` (R11), `permissions.ts` (`can`,
  `canEditPayoutAccount`), `warnings.ts` (`recentWarning`, `isNew`), `activity.ts` (chữ cho từng loại `trip_events`),
  `types.ts` (kiểu dùng chung: `TransferLine`, `MyBreakdown`, ...).
- `tests/unit/domain/*.test.ts`, `tests/fixtures/vung-tau.ts` (dữ liệu mẫu, 05-test-plan §7).
- `package.json`: thêm dev `fast-check`, `jsqr`, `pngjs`; thêm `qrcode` (dùng ở test để vẽ rồi đọc lại; slice 05 dùng thật).

## File cấm sửa
Theo [README](README.md). Thêm: `app/**`, `lib/db/**`, `lib/actions/**` (slice này không I/O).

## Phụ thuộc
Slice 00 (repo, Vitest).

## Lệnh kiểm tra
```bash
npm run check
npx vitest run --project unit --coverage
```

## Tiêu chí xong
- [ ] Mọi ca unit ở 05-test-plan §2 xanh: U-S1..U-S8 (+U-S6b), P-S1, U-B1..2, P-B1, U-T1..U-T8, P-T1..P-T3, §2.4
      (progress "2/6 · 1.620.000 / 3.510.000", P11 diff, formatVnd NBSP, formatDateRange qua tháng, nameKey chỉ a–z0–9,
      toBankName, transferNote "GOPKEO VT2 KHOA", VietQR CRC + đọc lại bằng jsQR, 4 mẫu tin R11, bảng `can()`,
      `recentWarning`, `isNew`, `canEditPayoutAccount` biên 24 giờ, `explainMyShare` cho Khoa/Mai/Tuấn).
- [ ] Độ phủ nhánh 100% cho `split.ts`, `balances.ts`, `transfers.ts`; ≥ 90% cho phần còn lại của `lib/domain`.
- [ ] Property test chạy ≥ 1.000 ca mỗi tính chất, có seed in ra khi fail.
- [ ] Kế hoạch mẫu ra đúng 6 dòng như PRD R5; ca P11 ra "Hùng hoàn lại cho Mai 100.000".
- [ ] `lib/domain` không import `server-only`, `next/*`, Supabase.
