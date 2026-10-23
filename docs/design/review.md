# Review flow + wireframe — Bước 3

Người rà: Claude Code (tự rà theo checklist cuối [prompts.md](prompts.md)).

- Canvas: https://claude.ai/artifact/QR7zdZL7Ft1VnydubApjXu (trang "Flow & màn hình" và "Wireframe"; riêng tư)
- Export PNG (render bằng Chrome headless từ mã nguồn artboard):
  - [flow/flow.png](flow/flow.png), [flow/screens.png](flow/screens.png)
  - [wireframe/S01-tao-keo.png](wireframe/S01-tao-keo.png) … [wireframe/S11-tien-do.png](wireframe/S11-tien-do.png):
    mỗi ảnh là một màn hình, 4 trạng thái cạnh nhau (riêng S3 và S6 có 5 trạng thái).
- Mã nguồn artboard + canvas.json: [canvas-source/](canvas-source/)

## Vòng 2 (2026-10-23): sửa cấu trúc theo phản hồi chủ dự án

| # | Yêu cầu | Đã làm |
|---|---|---|
| 1 | Trang kèo làm trung tâm, thanh tab Kèo / Chi tiêu / Trả tiền, chấm đỏ | Tab cố định dưới cùng ở S3, S6 (Kèo), S8 (Chi tiêu), S10, S11 (Trả tiền). S10 dành cho người nợ, S11 cho người được nợ. Quy ước chấm đỏ: Kèo khi mình chưa vote; Trả tiền khi mình còn nợ chưa đánh dấu (hoặc được nợ mà chưa nhập tài khoản: quy ước này mới ghi, chưa vẽ). S1, S2, S5, S7, S9 là màn đẩy lên, không có tab. Flow và danh sách màn hình đã cập nhật. |
| 2 | G1, G2 | S6 thêm trạng thái "Chưa chọn tên", nút chính "Xem mình nợ bao nhiêu". S3 thêm góc nhìn người tạo: Hùng cũng vote, nút chính "Chốt kèo", có link copy tin nhắc người chưa vote. Flow: S2 → S3 → S5. |
| 3 | S3 theo thời gian, nhãn "Đang dẫn", avatar | Lựa chọn xếp theo ngày; phương án dẫn đầu có nhãn "Đang dẫn" (viền giữ 1px như các ô khác); lựa chọn của mình tô nền nhạt + ô tích; mỗi lựa chọn có avatar người đã vote. Bỏ thanh phần trăm vì avatar và số phiếu đã đủ thông tin. |
| 4 | S7 placeholder + ghi chú làm tròn | Ô số tiền trống ghi "Ví dụ 600.000"; dòng "Chia lẻ: [quy tắc làm tròn — chốt ở Bước 7]". |
| 5 | S10 nhãn trạng thái | "Chưa chuyển", "Chưa lưu" dùng nền xám nhạt, không viền. Nhãn "Đã chuyển" ở S11 cũng đổi theo cho đồng bộ. |
| 6 | S1: G5 + lịch | Chọn ngày bằng lịch tháng (T2→CN), chạm nhiều ngày; dòng "Đã chọn …"; phần chỗ còn 1 dòng ("+ Thêm chỗ (không bắt buộc)" hoặc "Chỗ đề xuất: 2 chỗ · Sửa"). |
| 7 | Duyệt G9, G10 | G9 giữ (copy tin nhắc vote ở S3/S5). G10: S9 ghi "Gõ có dấu cũng được, app tự đổi sang chữ in hoa không dấu". G3, G4 chuyển sang Bước 7. |

**Sửa thêm ngoài danh sách:** dữ liệu mẫu ghi "T7–CN 15–16/11", nhưng năm 2026 ngày 15/11 là Chủ nhật. Mình đã đổi thành **14–15, 21–22, 28–29/11** (đều đúng T7–CN, đã kiểm bằng node) ở mọi màn và ở prompt (4).

## Kết quả checklist (sau vòng 2)

| # | Tiêu chí | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Việc chính ≤ 3 chạm | ĐẠT | Vote: người mới 3 chạm, người đã vào 2 chạm. Xem nợ + QR: người mới 2 chạm (qua S6 "Xem mình nợ bao nhiêu" hoặc tab Trả tiền), người đã vào 1 chạm. |
| 2 | 1 nút chính/màn | ĐẠT, có ngoại lệ có chủ đích | S3 (người tham gia) không có nút chính, chỉ nút viền "Copy tin nhắc". S11 có nút phụ ở từng dòng. |
| 3 | Trạng thái trống/tải/lỗi | ĐẠT 11/11 | Form (S1, S5, S7, S9) dùng nút quay khi đang gửi. |
| 4 | Tiền có ₫ và dấu chấm | ĐẠT | Số tiền không xuống dòng giữa số và ₫. |
| 5 | Không đăng ký; thấy kèo trước khi hỏi tên | ĐẠT | |
| 6 | Chữ ≥ 16px, chạm ≥ 44px, 360px | ĐẠT một phần | Còn dưới 16px: tên ngày trên lịch (14px), chữ cái avatar (12–13px, trang trí, có aria-label), "QR minh họa" (14px). Ô ngày trên lịch cao 42px, hơi dưới 44px. **Bản 360px chưa vẽ.** |
| 7 | Không vượt phạm vi v1 | ĐẠT | |

## Góp ý còn mở
- **G3** (trùng tên → mạo danh), **G4** (số tài khoản hiện cho ai có link): để Bước 7.
- **G6** S8: bảng số dư 7 người vừa khít khung; nhóm 10–12 người sẽ phải cuộn.
- **G7** S10: chuyển xong thẻ 1 thì thẻ 2 có tự mở ra không.
- **G8** Ca sửa khoản chi sau khi đã có người trả: làm ở prompt (4) và Bước 7.
- **G11 (mới)** Chấm đỏ ở tab Trả tiền cho người được nợ chưa nhập tài khoản: đã ghi quy ước, chưa vẽ ca này.
- **G12 (mới)** Lịch ở S1 chỉ có 1 tháng. Kèo trải qua 2 tháng thì phải bấm sang tháng sau; dòng "Đã chọn" phải gộp ngày của cả 2 tháng.

## Vòng 1 (đã xử lý)
G1, G2, G5, G9, G10 đã làm ở vòng 2. Hai lỗi hiển thị ở vòng 1 (ô chọn tràn mép ở S7/S9, ₫ xuống dòng ở S8) cũng đã sửa.

## Chưa kiểm chứng
- Bố cục ở 360px; trình duyệt Zalo; điện thoại thật.
- PNG render ngoài runtime của canvas, có thể lệch nhẹ.
- Độ tương phản màu chưa đo bằng công cụ.
