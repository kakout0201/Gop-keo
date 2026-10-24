---
description: Chạy toàn bộ kiểm tra của dự án và báo cáo rõ cái gì xanh, đỏ, chưa chạy được
argument-hint: [mã slice để chạy e2e riêng, vd 02b]
---
Chạy kiểm tra cho Góp Kèo, không sửa code. Không đọc file `.env*`.

1. `npm run check` (lint + typecheck + format + unit).
2. Nếu Supabase local đang chạy (`npx supabase status`): `npm run test:int`. Không chạy được → ghi rõ lý do.
3. `npm run build`.
4. E2E: có đối số `$ARGUMENTS` thì `npm run test:e2e -- --grep @slice$ARGUMENTS`, không thì toàn bộ `npm run test:e2e`.
5. Kiểm nhanh bảo mật: `git ls-files | grep -i "\.env"` chỉ có `.env.example`; grep `.next/static` không có `service_role`.

Báo cáo bảng: lệnh · kết quả (xanh/đỏ/không chạy) · số test · lỗi đầu tiên (nếu có). Kết luận một dòng: sẵn sàng GATE hay chưa.
