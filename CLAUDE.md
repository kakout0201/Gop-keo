# Góp Kèo — luật dự án

Web app giúp nhóm bạn/gia đình lên kèo đi chơi (vote ngày, địa điểm, chốt kèo)
và chia tiền sau buổi đi bằng mã VietQR. Người dùng thật: bạn bè và người thân của chủ dự án.
Stack: Next.js 16 (App Router, TypeScript strict) + Tailwind 4, Supabase, Vercel. Node 22, npm.
Máy phát triển: Windows. Repo: D:\vibecode\Gop-keo (GitHub công khai: kakout0201/Gop-keo). Nhánh chính: main.

## Vai trò của bạn (Claude Code)
Bạn vừa là người hướng dẫn quy trình, vừa là người thực thi.
Quy trình nằm ở docs/PLAYBOOK.md, trạng thái hiện tại ở docs/STATUS.md.
Khi được gọi /next: đọc STATUS, làm bước tiếp theo theo PLAYBOOK, cập nhật STATUS.

## Quyền tự quyết — làm luôn, không cần hỏi
- Tạo/sửa file trong phạm vi bước hoặc slice đang làm.
- Chạy lint, typecheck, test, dev server; sửa lỗi do chính mình gây ra.
- Cài thư viện npm cho dự án (ghi lý do vào commit message).
- Commit trên branch của slice. Gọi subagent review.
- Soạn tài liệu, prompt cho Claude Design, release notes, tin nhắn ra mắt.

## Phải dừng lại hỏi chủ dự án
Gom tất cả câu hỏi của một bước vào MỘT lần hỏi, mỗi câu kèm phương án bạn đề xuất.
- Quyết định sản phẩm: phạm vi, tính năng, chọn phương án giao diện, nội dung brief.
- Thay đổi schema DB, RLS, contracts sau khi đã được duyệt.
- Hành động không đảo ngược hoặc ra bên ngoài: git push, tạo PR, merge, deploy,
  `supabase db push`, xóa file ngoài phạm vi, tạo tài khoản, việc tốn tiền.
- Mọi thứ liên quan secret/key. KHÔNG BAO GIỜ đọc, in ra hay commit file .env*.
- Đã thử sửa cùng một lỗi 2 lần vẫn thất bại.
- Mọi bước được đánh dấu GATE hoặc USER trong PLAYBOOK.

## Định nghĩa XONG
- Đầu ra của bước có đủ như PLAYBOOK ghi; lệnh kiểm tra (nếu có) xanh.
- Báo cáo rõ cái gì CHƯA kiểm chứng được. Không nói "xong" chung chung.

## Git
- Không commit thẳng main sau khi repo đã có code (từ Bước 9). Mỗi slice một branch `slice/XX-ten-ngan`.
- Message dạng: docs: ... / feat(scope): ... / fix(scope): ... / test(scope): ... / chore: ...
- Không thêm Co-Authored-By, 'Generated with Claude Code' hay link session vào commit/PR. Repo chỉ đứng tên chủ dự án
  (`.claude/settings.json` có `attribution` để rỗng).
- Repo **công khai**: không commit tên thật, số TK, số điện thoại, ảnh chụp có dữ liệu thật. Dữ liệu mẫu dùng
  fixture trong `tests/fixtures/` (số TK giả 000011112222).

## Luật kỹ thuật
Nguồn đúng: docs/01-prd.md … docs/06-acceptance.md và docs/plans/slice-XX.md. Lệch với đặc tả → hỏi, không tự đổi.
- **Tiền:** số nguyên VND (`number`, kiểm `Number.isSafeInteger`); không float, không làm tròn ngoài `lib/domain/split.ts`.
  Hiển thị bằng `formatVnd` ("870.000 ₫", NBSP trước ₫).
- **Logic thuần** ở `lib/domain/**`: không I/O, không import `next/*`, Supabase, `server-only`. Test trước (Vitest +
  fast-check); `split`, `balances`, `transfers` phủ 100% nhánh.
- **Dữ liệu chỉ qua server** (kiến trúc D1): Supabase client service role trong `lib/db/**` có `import "server-only"`.
  Không có anon key ở client, không biến `NEXT_PUBLIC_*` chứa khóa.
- **Mọi ghi = Server Action → hàm SQL `app_<việc>`** (kiến trúc D10): Zod ở biên, thứ tự kiểm 04-contracts §1;
  hàm SQL revoke `public, anon, authenticated` + grant `service_role`, khóa `pg_advisory_xact_lock(hashtext(trip_id))`
  đầu hàm, kiểm lại điều kiện trạng thái trong hàm. Action không ném lỗi ra client, trả `ActionResult`.
- **Mỗi action mới** có dòng trong ma trận quyền (05-test-plan §3b) và test IDOR. Mọi truy vấn lọc theo `trip_id`.
- **Migration:** `npx supabase migration new <ten>` → `supabase/migrations/YYYYMMDDHHMMSS_ten.sql`. Không sửa migration
  đã có; đổi bảng/cột phải hỏi. Chạy local thoải mái; `supabase db push` luôn hỏi.
- **Không log** token, IP, số TK, nội dung tin nhắn. Không `dangerouslySetInnerHTML`.
- **Giao diện:** theo prototype (docs/design/screens/) và tokens (docs/design/tokens.md); Nunito; chữ thân 17px; vùng chạm
  ≥ 44px; màn tiền S7–S11 không dùng "nè/nha"; chấm đỏ chỉ ở tab khác tab đang mở.
- **Kiểm tra trước khi commit:** `npm run check` (lint + typecheck + format + unit). Slice có DB: thêm `npm run test:int`.
  Có UI: `npm run test:e2e -- --grep @sliceXX`.
- **Next.js 16** khác kiến thức cũ: đọc `node_modules/next/dist/docs/` khi dùng API lạ (xem AGENTS.md).

## Bài học (cập nhật sau mỗi bước/slice)
- (trống)
