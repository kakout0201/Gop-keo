# Góp Kèo — luật dự án

Web app giúp nhóm bạn/gia đình lên kèo đi chơi (vote ngày, địa điểm, chốt kèo)
và chia tiền sau buổi đi bằng mã VietQR. Người dùng thật: bạn bè và người thân của chủ dự án.
Stack dự kiến: Next.js (App Router, TypeScript) + Tailwind, Supabase, Vercel.
Máy phát triển: Windows. Repo: D:\vibecode\Gop-keo. Nhánh chính: main.

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
- Không commit thẳng main sau khi repo đã có code (từ Bước 9). Mỗi slice một branch.
- Message dạng: docs: ... / feat(scope): ... / fix(scope): ...

## Bài học (cập nhật sau mỗi bước/slice)
- (trống)
