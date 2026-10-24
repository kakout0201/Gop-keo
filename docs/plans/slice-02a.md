# Slice 02a — Hạ tầng dùng chung (không UI nghiệp vụ)

## Mục tiêu
Dựng mọi phần "đường ống" mà các slice sau đều dùng, để 02b, 03, 04 chỉ còn viết nghiệp vụ: danh tính bằng cookie
thiết bị, lấy IP + giới hạn tần suất, khung kiểm tra chung của Server Action, quy ước hàm SQL ghi (khóa theo kèo,
quyền EXECUTE), đọc `TripView` với các phần (sections) rỗng, thanh tab, và khung ma trận quyền. Không có màn nghiệp vụ.

## Story
Không có story người dùng. Phục vụ kiến trúc D1, D5, D8, D10; 04-contracts §1, §2; 05-test-plan §3b, I-14, I-29.

## File được sửa / tạo
- `lib/device.ts`: cookie `gk_device` (HttpOnly, Secure, SameSite=Lax, 400 ngày), `getDevice()` (không tạo),
  `ensureDevice()` (tạo khi chưa có, kiểm `create_device:ip` trước).
- `lib/ip.ts`: `x-real-ip` → phần đầu `x-forwarded-for` → `"local"`; IPv6 → /64; `HMAC-SHA256(IP_HASH_SECRET, bucket:ip)`.
- `lib/rate-limit.ts`: gọi hàm SQL `app_rate_limit_hit` (đếm + chèn + dọn trong 1 giao dịch, khóa theo bucket+key).
- `lib/schemas.ts` (Zod chung 04-contracts §1), `lib/actions/result.ts` (`ActionResult`, `ErrorCode`, câu tiếng Việt),
  `lib/actions/context.ts` (thứ tự kiểm: Zod → kèo → thiết bị → thành viên → quyền; ánh xạ mã lỗi từ hàm SQL).
- `lib/db/rpc.ts`: gọi `supabase.rpc` có kiểu, đổi `{ ok:false, code }` của hàm SQL thành `ActionResult`.
- `lib/db/load-trip.ts` (đọc mọi bảng của một kèo song song), `lib/view/build-trip-view.ts` (ghép), `lib/view/sections/core.ts`
  (trip, viewer, members kèm `isNew`, `moneyVersion`, activity); **khung rỗng có test** cho `sections/votes.ts`,
  `closing.ts`, `expenses.ts`, `payments.ts` (trả giá trị mặc định đúng kiểu `TripView`).
- `app/k/[slug]/layout.tsx` (tải TripView, `TabBar`, làm mới khi `visibilitychange` + 60 s), `app/k/[slug]/not-found.tsx`,
  trang tạm "Sắp có" cho `app/k/[slug]/page.tsx`, `chi-tieu/page.tsx`, `tra-tien/page.tsx` (để tab bấm được).
- Component khung: `TabBar` (chấm đỏ chỉ ở tab khác tab đang mở), `Skeleton`, `ErrorBanner`, `Toast`, `Button`.
- Migration `supabase/migrations/<YYYYMMDDHHMMSS>_infra_functions.sql`: `app_rate_limit_hit(bucket, key_hash, windows)`,
  `app_create_device(token_hash)`, theo quy ước D10 (revoke `public, anon, authenticated`; grant `service_role`;
  `pg_advisory_xact_lock` đầu hàm).
- Test: `tests/unit/ip.test.ts`, `device.test.ts`; `tests/integration/rpc-security.test.ts` (**I-29**: liệt kê mọi hàm trong
  schema `public` từ `pg_proc` rồi gọi bằng anon key → tất cả bị từ chối; tự áp dụng cho hàm của slice sau),
  `rate-limit.test.ts` (I-20, I-21 phần hạ tầng, I-26 phần `ensureDevice`), `permissions.matrix.test.ts` (khung: danh sách
  action, "dấu vân" DB của kèo, chạy theo vai N/K/Đ; chưa có dòng nào), `view-skeleton.test.ts` (kèo trống ra TripView hợp lệ;
  người chưa chọn tên không có `me`, `accounts`).

## File cấm sửa
Theo [README](README.md). Thêm: `lib/domain/**` (chỉ sửa lỗi kèm test); không tạo action nghiệp vụ, không vẽ S1–S11.

## Phụ thuộc
Slice 01.

## Lệnh kiểm tra
```bash
npm run check
npm run test:int
```

## Tiêu chí xong
- [ ] I-29 xanh: mọi hàm SQL gọi bằng anon key bị từ chối; `has_function_privilege('anon', ...)` = false cho mọi hàm.
- [ ] I-20, I-21 (10 lệnh song song cùng IP → đúng 10 qua, lệnh 11 bị chặn), I-26 phần `ensureDevice` xanh.
- [ ] Mở `/k/[slug]` không đặt cookie; slug sai → trang "Không tìm thấy kèo này…"; tab bấm qua lại được.
- [ ] `TripView` của kèo trống đúng kiểu, không có số TK, token, device id, IP.
- [ ] Không đổi `<ts>_init.sql`; migration mới chỉ thêm hàm.
