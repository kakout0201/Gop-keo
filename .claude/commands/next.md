---
description: Làm bước tiếp theo của dự án theo PLAYBOOK, tự chạy đến khi cần chủ dự án
argument-hint: [câu trả lời / phản hồi cho lần dừng trước, nếu có]
---
Đọc CLAUDE.md, docs/PLAYBOOK.md và docs/STATUS.md.

Phản hồi của chủ dự án cho lần dừng trước (có thể trống): $ARGUMENTS

Quy trình:
1. Xác định bước hiện tại và việc đang dở trong STATUS. Nếu có phản hồi ở trên,
   áp dụng nó trước (ví dụ: "duyệt" = qua GATE; câu trả lời = dữ liệu cho ASK).
2. Làm liên tiếp mọi việc AUTO, kể cả sang bước kế tiếp, cho đến khi gặp ASK, USER hoặc GATE.
   Dùng subagent khi việc độc lập với nhau (ví dụ soạn nhiều file đặc tả song song,
   reviewer đọc diff). Kiểm tra đầu ra của subagent trước khi coi là xong.
3. Gặp ASK: gom TẤT CẢ câu hỏi của bước vào một lần hỏi, mỗi câu kèm phương án đề xuất
   và lý do ngắn. Riêng phỏng vấn brief ở Bước 2: hỏi từng câu một.
4. Gặp USER: viết hướng dẫn đánh số, ngắn, có sẵn mọi prompt/giá trị cần dán.
   Nói rõ khi xong thì chủ dự án gõ gì (thường là `/next đã xong` kèm kết quả).
5. Gặp GATE: tóm tắt cái cần duyệt, kèm checklist, đường dẫn file. Dừng chờ `/next duyệt`
   hoặc `/next sửa: ...`.
6. TRƯỚC KHI DỪNG luôn cập nhật docs/STATUS.md: bước hiện tại, việc đã xong,
   đang chờ gì, cái chưa kiểm chứng, quyết định mới. Commit STATUS cùng file của bước
   nếu bước đó cho phép commit.
7. Câu cuối cùng của bạn luôn là: đang chờ chủ dự án làm/trả lời gì.

Không bao giờ vượt qua một GATE hay làm việc trong danh sách "Phải dừng lại hỏi" của CLAUDE.md
mà chưa được chủ dự án đồng ý trong phiên này.
