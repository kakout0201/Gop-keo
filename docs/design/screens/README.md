# Màn hình đã chốt (handoff Bước 6)

> **Prototype là bản chuẩn.** Các ảnh ở đây (xuất từ prototype) là nguồn đúng cho bố cục, câu chữ,
> màu, chữ và khoảng cách. **Wireframe ([../wireframe/](../wireframe/)) chỉ để tham khảo** các trạng thái
> trống, đang tải, lỗi mà prototype chưa vẽ. Nếu wireframe và prototype khác nhau, theo prototype.

Ảnh 390×844, xuất từ prototype trên canvas (https://claude.ai/artifact/QR7zdZL7Ft1VnydubApjXu,
trang "Bước 5 · Prototype"). Mã nguồn từng màn: [../canvas-source/proto/](../canvas-source/proto/).
Màn "Demo" và nút "Đổi vai" chỉ dùng để chuyển vai khi xem prototype, **không** thuộc sản phẩm (E8).

| Mã | Ảnh | Màn | Ghi chú |
|---|---|---|---|
| S1 | P01-s1-tao-keo.png | Tạo kèo | Lịch chọn nhiều ngày; chỗ thu gọn 1 dòng |
| S2 | P02-s2-chia-se.png | Chia sẻ link | Tin mời soạn sẵn |
| S3 | P03-s3-tuan-moi.png | Tab Kèo, chưa vote | "★ Đang dẫn" riêng dòng, avatar người vote |
| S4 | P04-s4-ban-la-ai.png | Bạn là ai? (khi vote) | Chip tên + ô nhập tên mới |
| S3 | P05-s3-tuan-da-vote.png | Tab Kèo, đã vote | Toast "Đã lưu vote của Tuấn", "bạn đã vote" (E2) |
| S3 | P06-s3-hung.png | Tab Kèo, người tạo | Nút "Chốt kèo" |
| S5 | P07-s5-chot.png | Chốt kèo | Mặc định phương án nhiều phiếu nhất |
| S6 | P08-s6-hung.png | Tab Kèo, đã chốt, chưa có chi tiêu | Thẻ ghim + trạng thái trống |
| S7 | P09-s7-them-chi.png | Thêm khoản chi | Chia cho ai, dòng làm tròn giữ chỗ (E7) |
| S8 | P10-s8-hung.png | Tab Chi tiêu | Số dư từng người |
| S8 | P11-s8-mai-sua.png | Chi tiêu sau khi sửa khoản | Trước/sau, hoàn tiền (E6, E10). Sửa 2026-10-24: Mai được **Hùng** hoàn lại (đúng thuật toán R5) |
| S6 | P12-s6-khoa.png | Tab Kèo, người nợ | Nút "Trả 870.000 ₫ cho Hùng" |
| S10 | P13-s10-khoa.png | Tab Trả tiền, mình nợ | Lưu ảnh QR, 3 bước + ghi chú "máy thứ hai"; bảng Ngân hàng / Chủ TK / Số TK / Số tiền / Nội dung, copy 3 dòng cuối (E1) |
| S10 | P14-s10-da-chuyen.png | Đã đánh dấu chuyển | Có hoàn tác |
| S11 | P15-s11-hung.png | Tab Trả tiền, được nợ | Ai chưa trả / đã trả (E5) |
| S11 | P20-s11-xem-tin.png | Xem trước tin nhắc · Gửi cả nhóm | 1 tin chung, sửa được trước khi copy (E4) |
| S11 | P21-s11-nhan-rieng.png | Xem trước tin nhắc · Nhắn riêng từng người | Mỗi người 1 tin chỉ có phần của họ, nút copy riêng |
| S11 | P16-s11-da-copy.png | Đã copy tin nhắc | "Mở Zalo và dán vào nhóm" |
| S9 | P17-s9-tai-khoan.png | Tài khoản nhận tiền | Tự đổi tên sang in hoa không dấu (G10) |
| S6 | P18-s6-nguoi-moi.png | Tab Kèo, người mới | "Xem mình nợ bao nhiêu" (G1) |
| S4 | P19-s4-chon-ten.png | Bạn là ai? (khi xem nợ) | |

Trạng thái trống / đang tải / lỗi: tham khảo wireframe ở [../wireframe/](../wireframe/) cho **nội dung và
hành vi** của trạng thái đó, nhưng vẽ lại theo prototype và [../tokens.md](../tokens.md). Wireframe S10, S11
chưa có các thay đổi E1, E4 và lựa chọn nhắn riêng, nên với 2 màn này chỉ dùng prototype.
