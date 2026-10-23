# Góp Kèo — Problem brief

> Dựa trên kịch bản mẫu tổng hợp ([ghi chép](00-brief-interview.md)), chưa phải phỏng vấn người thật.

## Vấn đề
Nhóm 7 bạn rủ nhau đi Vũng Tàu qua Zalo, mất **9 ngày và khoảng 200 tin nhắn** mới chốt được. Lý do:
bình chọn bị trôi (chỉ 4/7 người vote), có người đổi lịch, 6 link homestay gửi rải rác, và chốt xong
không ai ghim tin. Sau chuyến đi, 3 người cùng ứng tiền (tổng 5.850.000 ₫). Tiền bia bị chia cho cả 7
dù chỉ 5 người uống, nên phải tính lại khi 3 người đã chuyển rồi. Có người gõ sai số tài khoản,
và **3 tuần sau vẫn còn 2 người chưa trả**. Người ứng tiền ngại nhắc vì "bạn bè mà đòi hoài kỳ".
**Chỗ đau nhất là đòi tiền và tính lại khi sai, vì nó đụng đến tình cảm.**

## Persona
- **Hùng, người tạo kèo (22–30 tuổi):** hay rủ, hay ứng tiền. Cần chốt nhanh, tính đúng và để
  app "đòi hộ" mà không phải tự soạn lời nhắc. v1 không gửi tin nhắn hay thông báo. "Đòi hộ" nghĩa là
  có trang "ai chưa trả" và nút copy tin nhắc soạn sẵn (tên, số tiền, link) để dán vào Zalo.
- **Người tham gia, đi từ dễ đến khó:** Tuấn (không đọc tin dài, không vote), Mai (đòi minh bạch
  từng khoản), mẹ 54 tuổi (Android cũ, chỉ biết Zalo và app ngân hàng). Họ cần mở link trong Zalo là
  dùng được ngay: không đăng ký, chữ to, tiếng Việt, 1–2 chạm, quét QR là trả xong.

## Giải pháp (1 câu)
Một đường link gửi vào nhóm Zalo, không cần đăng ký, qua đó cả nhóm vote ngày và chỗ để chốt kèo,
ghi lại ai đã trả khoản gì, và mỗi người nhận một mã VietQR có sẵn đúng số tiền mình nợ.

## 3 việc bắt buộc
1. **Chốt kèo:** người tạo đưa ra vài ngày và vài địa điểm. Mỗi người vote bằng 1–2 chạm và thấy ngay ai
   chưa vote. Khi chốt, có một thẻ tóm tắt (ngày, nơi, ai đi) luôn nằm ở đầu link.
2. **Ghi chi tiêu minh bạch:** nhiều người cùng ứng tiền được. Mỗi khoản ghi ai trả và chia cho những ai.
   Ai cũng xem được bảng chi tiêu, sửa một khoản thì mọi số dư tự tính lại.
3. **Trả nợ bằng VietQR:** mỗi người thấy mình nợ ai bao nhiêu, kèm mã QR đã điền sẵn số tài khoản
   và số tiền. Mỗi người được nợ thấy ai đã trả mình, ai chưa; cả nhóm thấy tổng tiến độ trả nợ.

## Không làm (v1)
- Không có app cài đặt, không đăng ký/OTP, không đăng nhập bằng mạng xã hội.
- Không giữ tiền, không xử lý thanh toán, không tự đối soát với ngân hàng. Việc "đã trả" do người
  dùng tự đánh dấu.
- Không có chat trong app, vì Zalo vẫn là nơi nói chuyện.
- Không đặt phòng, không so giá homestay, không tích hợp bản đồ.
- Không hỗ trợ ngoại tệ, tiếng Anh, Zalo Mini App hay quỹ chung dài hạn.

## Chỉ số thành công (sau chuyến đi thật đầu tiên)
- Chốt kèo trong **≤ 2 ngày**, **≥ 6/7** người đã vote, người tạo nhắc **≤ 1 lần**.
- **≥ 5/6** người nợ trả đủ trong **48 giờ** bằng quét QR.
- **0** lần có người thắc mắc lại số tiền trong nhóm.
- Trong **1 tháng**, có ít nhất 1 người khác người tạo đầu tiên tự tạo kèo mới.
- Mở link từ Zalo trên máy Android tầm trung qua 4G thấy nội dung trong **≤ 3 giây**.

## Rủi ro
- Trình duyệt trong Zalo có thể lỗi hoặc chậm, mà trắng màn hình là người dùng bỏ ngay.
- Không có tài khoản nên ai có link cũng có thể vote hoặc sửa thay người khác, và có thể lộ số tài
  khoản ngân hàng. Xóa dữ liệu trình duyệt hoặc đổi máy là mất "danh tính".
- Chia tiền ra số lẻ (ví dụ 600.000 ₫ chia 7) cần quy tắc làm tròn rõ ràng, nếu không sẽ lại bị
  thắc mắc.
- Nhiều người cùng ứng tiền thì một người có thể phải chuyển cho 2–3 người, tức nhiều lần quét QR.
- Việc đánh dấu "đã trả" là tự khai, có thể không khớp với tiền thật nhận được.

## Giả định cần kiểm chứng ở Bước 5 (test prototype với bạn bè thật)
Mọi thông tin trong brief này đến từ kịch bản mẫu. Cần kiểm chứng với 2–3 người thật:
1. Nỗi đau thật sự là đòi tiền và tính lại khi sai, chứ không phải lên kèo.
2. Mọi người chịu bấm một link lạ trong Zalo thay vì dùng bình chọn có sẵn của Zalo.
3. Người kiểu Tuấn vote được trong 1–2 chạm mà không cần ai hướng dẫn.
4. Người lớn tuổi (như mẹ) tự mở link, tìm ra số mình nợ và quét QR trả được.
5. Người ứng tiền sẵn lòng nhập số tài khoản vào link mà cả nhóm cùng xem.
6. "App nhắc thay mình" thật sự đỡ ngại hơn việc tự nhắc.
7. Mọi người tin bảng chi tiêu đủ để không hỏi lại, và chấp nhận việc tự đánh dấu "đã trả".
8. Gộp nợ (mỗi người chỉ chuyển cho 1 người) có được ưa hơn chuyển riêng cho từng người ứng tiền không.
