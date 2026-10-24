---
description: Làm một slice theo docs/plans/slice-XX.md — branch, test trước, code, check xanh, subagent review, sửa
argument-hint: <mã slice, vd 00, 01, 02a, 02b, 03> [ghi chú]
---
Làm slice **$ARGUMENTS** của Góp Kèo. Đọc `CLAUDE.md`, `docs/STATUS.md`, `docs/plans/README.md`,
`docs/plans/slice-<mã>.md` và phần đặc tả slice đó nhắc tới.

1. Kiểm phụ thuộc trong file slice đã merge vào `main`. Chưa → dừng, báo.
2. `git switch main` → `git switch -c slice/<mã>-<tên-ngắn>` (worktree nếu chạy song song 03 ∥ 04).
3. Gọi subagent `test-writer` cho slice này; kiểm đầu ra (test đúng mã, fail vì chưa có code). Commit `test(<scope>): ...`.
4. Viết code **chỉ trong "File được sửa / tạo"**; không đụng "File cấm sửa". Cần đổi schema/contracts/đặc tả → dừng, hỏi.
   Migration mới: `npx supabase migration new <ten>`, áp lên DB local.
5. Chạy lệnh kiểm tra của slice đến khi xanh. Sửa một lỗi 2 lần vẫn fail → dừng, hỏi.
6. Gọi subagent `reviewer` (và `security-auditor` nếu slice có action/tiền/tài khoản). Sửa mọi BLOCKER, MAJOR; MINOR
   sửa hoặc ghi lý do bỏ qua. Chạy lại lệnh kiểm tra.
7. Commit theo từng phần (`feat(<scope>): ...`, ghi lý do khi cài thư viện).
8. Cập nhật `docs/STATUS.md`: slice, đã xong gì, tiêu chí xong nào đạt, cái **chưa kiểm chứng**.
9. Dừng ở **GATE**: hướng dẫn chủ dự án test tay trên điện thoại (`npm run dev -- -H 0.0.0.0`, địa chỉ LAN, từng bước
   theo AC của slice). Chờ `/next duyệt` hoặc `/next sửa: ...`.
