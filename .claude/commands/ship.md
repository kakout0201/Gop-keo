---
description: Đẩy branch slice lên GitHub và tạo PR — chỉ chạy khi chủ dự án đã cho phép trong phiên này
argument-hint: <mã slice>
---
Ship slice **$ARGUMENTS**. Push và tạo PR là hành động ra bên ngoài: chỉ làm nếu chủ dự án **đã cho phép rõ trong phiên này**
cho slice này. Chưa có → dừng và hỏi. Không bao giờ force push, không merge, không bật auto-merge.

1. Đang ở branch `slice/<mã>-...`, working tree sạch; `/verify $ARGUMENTS` xanh (chạy lại nếu có commit mới).
2. Quét bí mật: `gitleaks git --redact --log-opts="main..HEAD"` (nếu có gitleaks) và `git diff main...HEAD --name-only | grep -i env`
   rỗng. Có phát hiện → dừng, báo, không push.
3. `git push -u origin <branch>`.
4. Có `gh` (đã đăng nhập): `gh pr create --base main --title "<type>(<scope>): slice <mã> — <mục tiêu>" --body ...`.
   Body: mục tiêu, story, tiêu chí xong (đánh dấu cái đạt), cái chưa kiểm chứng, cách test tay. **Không** thêm dòng
   "Generated with Claude Code", Co-Authored-By hay link session (CLAUDE.md). Không có `gh` → đưa link tạo PR trên GitHub.
5. Báo link PR và nhắc chủ dự án: xem bản preview Vercel trên PR, CI xanh, rồi tự merge (USER). Sau merge: cập nhật
   mục "Bài học" trong `CLAUDE.md` và `docs/STATUS.md`.
