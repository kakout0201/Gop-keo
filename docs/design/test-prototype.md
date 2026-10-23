# Test prototype với người thật — Bước 5

Mục tiêu: kiểm 8 giả định ở cuối [docs/00-brief.md](../00-brief.md). Brief được viết từ kịch bản mẫu,
nên đây là lần đầu có người thật dùng thử.

- Prototype: https://claude.ai/artifact/QR7zdZL7Ft1VnydubApjXu, trang **"Bước 5 · Prototype"**, khung **"Demo · chọn việc để thử"**.
- Ảnh tĩnh của 20 màn: [prototype/_tong-quan.png](prototype/_tong-quan.png).

## Chuẩn bị (10 phút)
1. Mời 2–3 người, cố gắng có đủ 3 kiểu:
   - một người **lười đọc**, giống Tuấn;
   - một người **kỹ tiền bạc**, giống Mai;
   - một người **lớn tuổi**, ít dùng app (ví dụ mẹ bạn).
2. Mở link prototype trên **điện thoại của bạn**, vào trang "Bước 5 · Prototype", bấm Play ở khung Demo
   (chọn xem toàn màn hình nếu có).
   Link đang riêng tư, nên cách đơn giản nhất là **đưa máy của bạn cho họ cầm**. Nếu muốn họ mở trên máy
   của họ, bạn phải chia sẻ từ menu Share trên trang canvas trước. Mình chưa kiểm chứng người không có
   tài khoản Claude có mở được hay không.
3. Chuẩn bị giấy hoặc mở [mẫu ghi chép](#mẫu-ghi-chép) ở dưới. Nếu người test đồng ý, bật ghi âm.

## Lời dặn khi test
- Nói trước: "Đây là bản nháp, các nút chưa chạy hết. Mình đang thử cái app chứ không thử bạn."
- Nhờ họ **vừa làm vừa nói to** họ đang nghĩ gì.
- **Đừng chỉ đường.** Nếu họ hỏi, hỏi ngược lại: "Bạn nghĩ nên bấm vào đâu?"
- Ghi lại: chỗ **khựng quá 3 giây**, chỗ **bấm sai**, chỗ **hỏi lại**, và câu họ nói nguyên văn.
- Mỗi người khoảng 10–15 phút. Không cần làm hết các nhiệm vụ, chọn những việc hợp với người đó.

## Nhiệm vụ (đọc cho họ nghe, không cho xem màn hình Demo trước)
Với mỗi nhiệm vụ, bạn tự chọn đúng ô trong màn Demo rồi mới đưa máy cho họ.

| # | Ô trong Demo | Câu đọc cho người test | Kiểm giả định | Thành công khi |
|---|---|---|---|---|
| N1 | 2 · Mở link, vote | "Bạn vừa thấy link này trong nhóm Zalo. Bạn đi được cuối tuần 21–22/11, muốn ở homestay. Vote đi." | 2, 3 | Vote xong trong 3 chạm, không hỏi |
| N2 | 6 · Trả tiền bằng QR | "Bạn là Khoa. Trả tiền cho xong chuyến này đi." | 4 | Tìm ra 870.000 ₫, hiểu cách quét, bấm "Mình đã chuyển…" |
| N3 | 5 · Xem chi tiêu sau khi sửa | "Bạn là Mai. Có người vừa sửa tiền bia. Giờ bạn còn nợ hay được trả lại bao nhiêu?" | 7, 1 | Nói được "được hoàn 100.000 ₫" |
| N4 | 4 · Ghi khoản Bia | "Tiền bia 600.000 ₫ do Tuấn trả, Mai với Thảo không uống. Ghi vào đi." | 1 | Hiểu chỗ bỏ chọn Mai và Thảo |
| N5 | 7 · Xem ai chưa trả | "Bạn là Hùng. Còn ai chưa trả? Nhắc họ giúp mình." | 6 | Bấm copy tin nhắc và hiểu là phải tự dán vào Zalo |
| N6 | 8 · Nhập tài khoản | "Bạn là Hùng. Cho mọi người biết số tài khoản để chuyển tiền." | 5 | Nhập xong, nói thoải mái hay ngại để lộ số tài khoản |
| N7 | 9 · Mở link sau khi đã chốt | "Bạn mở lại link sau chuyến đi. Xem mình nợ bao nhiêu." | 4 | Tự chọn được tên mình rồi thấy số nợ |

## Hỏi sau khi test (2–3 phút)
1. Chỗ nào làm bạn khó hiểu nhất?
2. Nếu nhóm bạn dùng thật, bạn có bấm link này thay vì bình chọn của Zalo không? Vì sao?
3. Bạn có yên tâm nhập số tài khoản vào đây không?
4. Việc app soạn sẵn tin nhắc có làm bạn đỡ ngại khi đòi tiền không?
5. Bạn tin bảng chi tiêu này đến mức không hỏi lại trong nhóm không?

## Mẫu ghi chép
Chép bảng này cho mỗi người test:

```text
Người test: ____ (kiểu: Tuấn / Mai / lớn tuổi)   Máy: ____   Ngày: ____
N1: ok / khựng / thất bại — ghi chú:
N2: ok / khựng / thất bại — ghi chú:
N3: ...
Câu nói đáng nhớ (nguyên văn):
Trả lời 5 câu hỏi sau test:
1.
2.
3.
4.
5.
```

## Gửi kết quả cho Claude Code
Gõ `/next đã xong` rồi dán ghi chép của từng người. Viết ngắn gọn cũng được, miễn là có:
chỗ khựng, chỗ bấm sai, câu họ nói và câu trả lời cho 5 câu hỏi.
Mình sẽ tổng hợp thành danh sách sửa (AUTO), sửa trên canvas, rồi sang Bước 6.
