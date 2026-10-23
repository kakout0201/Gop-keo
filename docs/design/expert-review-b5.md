# Đánh giá prototype Bước 5 — thay cho test người thật

Ngày: 2026-10-23. Người đánh giá: Claude (chat độc lập, không phải session Claude Code đã vẽ prototype).

> **CẢNH BÁO: ĐÂY KHÔNG PHẢI TEST VỚI NGƯỜI THẬT.**
> Chủ dự án chưa có người để test. Thay vào đó là đánh giá chuyên gia (cognitive walkthrough):
> đi qua nhiệm vụ N1–N7 trong [test-prototype.md](test-prototype.md) trên ảnh prototype, dưới góc nhìn
> 3 persona Tuấn / Mai / người lớn tuổi. Kết quả **không kiểm chứng** được 8 giả định trong brief.
> Quyết định của chủ dự án: đi tiếp, kiểm chứng bằng phản hồi người dùng thật **sau khi deploy**
> (Bước 18 bug bash và Bước 20 ra mắt). Mọi giả định giữ trạng thái "chưa kiểm chứng".

Ảnh đã xem: P00–P04, P07, P09–P13, P15, P17, P18 trong [prototype/](prototype/).

## Phát hiện

### P0 — phải sửa trước khi handoff (Bước 6)

**E1 · S10: người dùng không quét được mã QR đang hiện trên chính điện thoại của mình.**
Người mở link trong Zalo thường dùng cùng một điện thoại có app ngân hàng. Hướng dẫn hiện tại
"1. Mở app ngân hàng, chọn Quét mã QR. 2. Quét mã trên" không làm được nếu chỉ có một máy;
người lớn tuổi sẽ kẹt ngay ở bước này. Đây có thể là lỗi lớn nhất của luồng trả tiền.
Đề xuất:
- Nút **"Lưu ảnh QR"** (tải ảnh về máy), hướng dẫn đổi thành: "Lưu ảnh QR → mở app ngân hàng →
  Quét mã → chọn ảnh từ thư viện". Hầu hết app ngân hàng có nút chọn ảnh trong màn quét QR.
- Giữ cách quét bằng máy khác cho người có 2 máy, nhưng không phải cách mặc định.
- Thêm nút copy cho **số tiền** và **nội dung chuyển khoản**, không chỉ copy số tài khoản,
  để người không dùng được QR vẫn chuyển tay mà không gõ sai.
- (Tìm hiểu ở Bước 7, chưa kiểm chứng) liên kết mở thẳng app ngân hàng (deeplink) nếu VietQR
  hoặc ngân hàng hỗ trợ.
- Kiểm chứng ngoài đời: lưu ảnh từ trình duyệt trong Zalo có thể bị chặn → cần phương án
  "chạm giữ ảnh để lưu" và kiểm tra ở Bước 18.

### P1 — nên sửa ở Bước 6

**E2 · S3/S4: người lười đọc không biết mình đã vote xong chưa.**
Sau khi chạm và chọn tên ở S4, không có phản hồi rõ ràng. Đề xuất: thông báo nhỏ "Đã lưu vote của
Tuấn" và dòng phụ trên đầu đổi thành "5/7 người đã vote · bạn đã vote".

**E3 · Chấm đỏ trên tab đang mở (S3: tab Kèo có chấm đỏ khi đang ở tab Kèo).**
Chấm đỏ nên báo việc cần làm ở tab **khác**. Khi đang ở tab đó thì ẩn, hoặc thay bằng nhắc trong nội dung.

**E4 · S11: không thấy trước nội dung tin nhắc trước khi copy.**
Người đòi tiền ngại nhất là câu chữ. Cho xem trước tin nhắn (có thể sửa) rồi mới copy, sau khi copy
nhắc "Đã copy — mở Zalo và dán vào nhóm".

**E5 · S11 tiêu đề phụ bị ngắt dòng** ("bạn được nhận / 1.930.000 ₫"). Không cho số tiền xuống dòng
riêng; rút gọn thành "Bạn được nhận 1.930.000 ₫".

**E6 · S8 (Mai sửa): bố cục "Phần bạn phải trả 850.000 ₫ → 750.000 ₫" bị gãy dòng ở 390px.**
Đặt số cũ gạch ngang và số mới trên hai dòng hoặc hai cột rõ ràng. Phép tính đã kiểm:
600.000 chia 6 = 100.000, chia 5 = 120.000; Mai bớt 100.000, 5 người khác thêm 20.000 mỗi người. Khớp.

### P2 — ghi nhận, xử lý khi code

- **E7 · S7:** dòng giữ chỗ "[quy tắc làm tròn — chốt ở Bước 7]" phải được thay bằng câu thật trước Bước 10.
- **E8 · Nút "Đổi vai"** chỉ có trong prototype, nhìn giống nút thật. Đánh dấu rõ là chỉ cho demo,
  không đưa vào spec.
- **E9 · S9:** dòng "Ai mở link kèo này đều thấy số tài khoản của bạn" trung thực nhưng sẽ làm người ứng
  tiền ngần ngại — liên quan G4, chốt ở Bước 7.
- **E10 · S8 (Mai sửa):** "Linh sẽ chuyển lại cho bạn" — cách hoàn tiền chưa chốt (điểm mở Bước 7).

## Điểm làm tốt (giữ nguyên)
- S6 người mới: một nút chính "Xem mình nợ bao nhiêu", lời giải thích ngắn "Không cần mật khẩu".
- S4: chọn tên bằng chip có avatar, có lối "Chưa thấy tên mình?".
- S7: dòng tóm tắt "Chia đều cho 5 người: 120.000 ₫ mỗi người · Mai và Thảo không bị tính" giải quyết đúng vụ tiền bia.
- S8 (Mai sửa): tách "Thay đổi với bạn" và "Thay đổi với người khác", có lịch sử sửa — đúng nhu cầu minh bạch.
- S10: số tiền to, bảng Ngân hàng/Số TK/Chủ TK, nút chính ghi rõ số tiền.
- S11: thanh tiến độ cả nhóm, tách "Chưa trả bạn" và "Đã trả bạn", câu nhắc "tự đánh dấu, nên kiểm tra
  lại trong app ngân hàng". Số liệu khớp: 870.000 + 1.060.000 = 1.930.000.

## 8 giả định trong brief — trạng thái sau đánh giá

| # | Giả định | Nhận định chuyên gia | Trạng thái |
|---|---|---|---|
| 1 | Nỗi đau thật là đòi tiền và tính lại khi sai | Thiết kế phục vụ tốt nếu đúng | Chưa kiểm chứng |
| 2 | Chịu bấm link lạ thay vì bình chọn Zalo | Phụ thuộc người tạo kèo có uy tín trong nhóm | Chưa kiểm chứng |
| 3 | Người lười vote được trong 1–2 chạm | Hợp lý; rủi ro không biết đã vote xong (E2) | Chưa kiểm chứng |
| 4 | Người lớn tuổi tự trả được bằng QR | **Rủi ro cao** vì E1 | Chưa kiểm chứng |
| 5 | Người ứng tiền chịu nhập số TK | Có thể ngần ngại (E9) | Chưa kiểm chứng |
| 6 | Tin nhắc soạn sẵn làm đỡ ngại | Hợp lý nếu xem trước được câu chữ (E4) | Chưa kiểm chứng |
| 7 | Tin bảng chi tiêu, chấp nhận tự đánh dấu | Màn sửa sai rất minh bạch | Chưa kiểm chứng |
| 8 | Gộp nợ được ưa hơn chuyển riêng | Không đánh giá được qua ảnh | Chưa kiểm chứng |

Kế hoạch kiểm chứng: đưa 8 giả định vào kịch bản bug bash Bước 18 và phiếu hỏi sau chuyến đi thật ở Bước 20.
