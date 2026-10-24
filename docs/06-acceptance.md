# Tiêu chí nghiệm thu — Góp Kèo v1 (Given / When / Then)

Trạng thái: Bước 7, chờ GATE. Mỗi story Must phải đạt hết tiêu chí của nó trước GATE Bước 18.
Dữ liệu mẫu: [05-test-plan.md §7](05-test-plan.md). "Máy A/B/C" = các trình duyệt/điện thoại khác nhau.
Mã AC-xx.y ứng với US-xx trong [01-prd.md](01-prd.md). Màn hình theo [design/screens/](design/screens/).

## A. Chốt kèo

### US-01 Tạo kèo
- **AC-01.1** Given tôi mở trang chủ lần đầu, When tôi bấm "Tạo kèo", nhập "Vũng Tàu 2N1Đ", tên "Hùng",
  chạm 14, 15, 21, 22, 28, 29/11/2026 và bấm "Tạo kèo", Then tôi tới S2, kèo có 3 lựa chọn ngày
  "T7–CN 14–15/11", "T7–CN 21–22/11", "T7–CN 28–29/11", và tôi là thành viên "Hùng" (người tạo).
- **AC-01.2** Given lịch ở S1, When tôi chạm ngày đã qua, Then ngày đó không chọn được.
- **AC-01.3** Given tôi chọn 30/11 và 1/12, When tôi chuyển sang tháng 12, Then dòng "Đã chọn" gộp được
  ngày của cả hai tháng thành một lựa chọn "CN–T2 30/11–1/12" (G12).
- **AC-01.4** Given tôi thêm chỗ "Homestay Biển Xanh" giá 2.800.000, When tạo kèo, Then S3 hiện
  "Homestay Biển Xanh · 2.800.000 ₫/đêm". Link chỗ bắt đầu bằng `http://` hoặc `javascript:` bị từ chối.
- **AC-01.5** Given tên kèo để trống hoặc chưa chọn ngày nào, When bấm "Tạo kèo", Then nút báo lỗi ngay
  dưới ô, dữ liệu đã nhập giữ nguyên.
- **AC-01.6** Given mạng lỗi khi gửi, Then hiện banner lỗi + "Thử lại", không tạo kèo trùng khi bấm lại.

### US-02 Chia sẻ link
- **AC-02.1** Given vừa tạo kèo, When ở S2, Then thấy tin mời "Hùng rủ đi Vũng Tàu 2N1Đ nè! Chạm link chọn
  ngày với chỗ, không cần đăng ký: {link}" và nút "Copy link".
- **AC-02.2** When bấm "Gửi vào Zalo" trên điện thoại có chia sẻ hệ thống, Then bảng chia sẻ mở với tin mời;
  máy không có thì tin mời được copy và báo "Đã copy".
- **AC-02.3** Given đã có Linh, Tuấn, Mai vào kèo, Then S2 hiện avatar và "3 người đã vào kèo".

### US-03 Mở link không cần nhập gì
- **AC-03.1** Given máy B chưa từng mở Góp Kèo, When mở link trong trình duyệt Zalo, Then thấy tên kèo,
  "4/7 người đã vote · bạn chưa vote", các lựa chọn, số phiếu, avatar người vote, "★ Đang dẫn",
  mà không phải nhập gì; máy B **chưa** được đặt cookie.
- **AC-03.2** Given trang có dữ liệu mẫu, When mở qua 4G trên Android tầm trung, Then nội dung chính hiện
  ≤ 3 giây (đo LCP).
- **AC-03.3** Given link sai một ký tự, Then trang "Không tìm thấy kèo này. Kiểm tra lại link trong Zalo."

### US-04 Vote 1–2 chạm
- **AC-04.1** Given máy B chưa chọn tên, When chạm "T7–CN 21–22/11", Then sheet "Bạn là ai trong nhóm?"
  mở với chip tên đã có và "Chưa thấy tên mình?".
- **AC-04.2** When tôi chạm "Tuấn" (hoặc gõ "Tuấn" rồi "Vào kèo"), Then sheet đóng, phiếu cho 21–22/11
  được lưu, toast "Đã lưu vote của Tuấn!", dòng đầu đổi thành "5/7 người đã vote · bạn đã vote", và có
  dòng "Bạn đang vote với tên Tuấn · đổi".
- **AC-04.3** Given đã chọn tên, When chạm thêm "Homestay Biển Xanh", Then lưu ngay (1 chạm), ô đó nền
  `primary-soft` + ô tích; chạm lại thì bỏ phiếu.
- **AC-04.4** Given lựa chọn có nhiều phiếu nhất, Then có nhãn "★ Đang dẫn" ở dòng riêng, không tô nền;
  hai lựa chọn hòa thì cả hai có nhãn.
- **AC-04.5** Given máy B mất mạng, When chạm vote, Then ô quay lại trạng thái cũ và báo lỗi.
- **AC-04.6 [Q5]** Given "Tuấn" đã được máy C chọn, When máy B chạm "Tuấn", Then hỏi "Tên Tuấn đang được
  dùng trên một máy khác. Đây là bạn trên máy mới?"; đồng ý → máy B là Tuấn và hoạt động kèo có dòng
  "Tuấn vừa mở kèo trên một máy khác".
- **AC-04.7** When gõ tên mới "tuan", "Tuấn.", "TUAN 😀" hay "T u a n" khi đã có "Tuấn", Then app hỏi "Bạn là Tuấn này à?"
  thay vì tạo tên mới. Tên chỉ có emoji hay dấu câu → "Tên cần có chữ hoặc số".
- **AC-04.9** Given Nam vào kèo lúc 20:00, Then trong 48 giờ avatar Nam có nhãn "mới" ở mọi chỗ (S3, S4, S7, S8, S10,
  S11); sau 48 giờ nhãn mất. Người tạo kèo không bao giờ có nhãn.
- **AC-04.8** Given kèo đã đủ 20 người [Q10], When gõ tên mới, Then báo "Kèo đã đủ 20 người."

### US-05 Ai chưa vote
- **AC-05.1** Given 6/7 đã vote, Then người tạo thấy "Bạn rủ · 6/7 đã vote · còn Khoa".
- **AC-05.2** When bấm "Nhắc khéo người chưa vote", Then copy tin "Còn Khoa chưa vote kèo Vũng Tàu 2N1Đ nè!
  Chạm link chọn ngày với chỗ, 1 phút thôi: {link}" và báo đã copy.

### US-06 Chốt kèo
- **AC-06.1** Given tôi là người tạo, When bấm "Chốt kèo", Then S5 chọn sẵn "T7–CN 21–22/11" và "Homestay
  Biển Xanh" (★ Nhiều phiếu nhất), có câu "Còn Khoa chưa vote. Chốt luôn cũng được, Khoa vẫn xem được kết quả."
- **AC-06.2** When bấm "Chốt kèo" ở S5, Then mọi máy thấy thẻ ghim "Đã chốt · T7–CN 21–22/11 · Homestay
  Biển Xanh · 7 người đi" ở đầu tab Kèo và không vote được nữa.
- **AC-06.3** Given tôi không phải người tạo, Then không thấy nút "Chốt kèo"; gọi thẳng action → `FORBIDDEN`.

### US-07 Mở lại vote [Q7]
- **AC-07.1** Given kèo đã chốt, When người tạo bấm "Mở lại vote" và xác nhận, Then thẻ ghim mất, phiếu cũ
  còn nguyên, mọi người vote tiếp được; chi tiêu không đổi.

### US-08 Sửa kèo
- **AC-08.1** Given kèo chưa chốt, When người tạo bỏ lựa chọn "28–29/11", Then lựa chọn và phiếu của nó mất;
  các lựa chọn khác giữ nguyên phiếu.

## B. Chi tiêu

### US-09 Thêm khoản chi
- **AC-09.1** Given Tuấn đã chọn tên, When ở S7 nhập 600.000, "Bia", Ai đã trả = Tuấn, bỏ chọn Mai và Thảo,
  Then thấy "Chia đều cho 5 người: 120.000 ₫ mỗi người" và "Mai và Thảo không bị tính khoản này.";
  không có câu làm tròn.
- **AC-09.2 [Q1]** When chọn cả 7 người cho 600.000, Then thấy "Chia lẻ nên làm tròn đến 1.000 ₫: 86.000 ₫
  mỗi người, riêng Tuấn (người trả) 84.000 ₫."
- **AC-09.3** When bấm "Lưu khoản chi", Then về S8, toast "Đã lưu khoản Bia. Số dư đã được tính lại."
- **AC-09.4** Given số tiền < 1.000 ₫, > 500.000.000 ₫, có số lẻ, hoặc không chọn ai để chia, Then không lưu được, báo lỗi tại ô.
- **AC-09.5** Mặc định: "Ai đã trả" = tôi, "Chia cho ai" = cả nhóm.

### US-10 Bảng chi tiêu
- **AC-10.1** Given 3 khoản dữ liệu mẫu, Then S8 hiện "Chi tiêu · 3 khoản · 5.850.000 ₫", từng khoản
  ("Bia 600.000 ₫ · Tuấn trả · chia 5, trừ Mai và Thảo · 120.000 ₫/người") và số dư: Hùng nhận 1.930.000 ₫,
  Linh nhận 1.580.000 ₫, Tuấn nợ 270.000 ₫, Mai nợ 750.000 ₫, Thảo nợ 750.000 ₫, Nam nợ 870.000 ₫,
  Khoa nợ 870.000 ₫.
- **AC-10.2** Given khoản chia lẻ, Then dòng khoản ghi rõ phần khác ("86.000 ₫/người, Tuấn 84.000 ₫").
- **AC-10.3** Given chưa có khoản nào, Then "Chưa có khoản chi nào" + nút "Thêm khoản chi".

### US-11 Sửa / xóa khoản chi
- **AC-11.1 [Q3]** Given Bia do Tuấn ghi và trả, Then Tuấn và Hùng (người tạo) thấy nút sửa; Mai không thấy.
- **AC-11.2** Given Bia đang chia 6 (có Mai), When Tuấn sửa thành chia 5 (bỏ Mai) lúc 21:12, Then số dư mọi
  người tính lại; Mai mở tab Chi tiêu thấy banner "Tuấn vừa sửa khoản Bia (21:12): chia 6 người → chia 5 người.
  Bạn không còn bị tính tiền bia.", "Phải trả trước đây 850.000 ₫ / Phải trả bây giờ 750.000 ₫", và
  "Thay đổi với người khác: Hùng, Linh, Tuấn, Nam, Khoa: mỗi người trả thêm 20.000 ₫. Thảo không thay đổi."
- **AC-11.3** When Mai bấm "Đã hiểu", Then banner mất trên mọi máy của Mai và chấm đỏ tab Chi tiêu tắt.
- **AC-11.4** Given khoản Bia đã sửa, Then dòng khoản có nhãn "Đã sửa" và "Lịch sử" hiện từng lần sửa
  (ai, giờ, trước → sau).
- **AC-11.5** Given máy A và B cùng mở form sửa Bia, When A lưu trước rồi B lưu, Then B nhận "Số liệu vừa thay
  đổi. Mình đã tải số mới." và form của B hiện số của A.
- **AC-11.7** Given Khoa đã bấm "Đã hiểu", When Linh thêm khoản "Cà phê" 140.000 ₫ chia 7 lúc 20:05, Then Khoa mở tab Chi
  tiêu thấy banner "Linh vừa thêm khoản Cà phê 140.000 ₫ (20:05): phần của bạn 20.000 ₫." và tab Chi tiêu có chấm đỏ
  khi Khoa ở tab khác; Linh (người ghi) không thấy banner này; người không bị tính không thấy.
- **AC-11.6** When xóa một khoản (xác nhận), Then khoản biến mất khỏi danh sách và số dư, vẫn còn trong
  hoạt động "Hùng đã xóa khoản …".

## C. Trả tiền

### US-12 Tài khoản nhận tiền
- **AC-12.1** Given Hùng được nhận 1.930.000 ₫, When mở S9, chọn MB Bank, nhập "0000 1111 2222",
  tên "Nguyễn Văn Hùng", Then ô tên hiện "NGUYEN VAN HUNG" và có QR xem trước; lưu xong S11 hiện
  "Nhận tiền vào: MB Bank ···2222 · Sửa".
- **AC-12.2 [Q4]** Then S9 có câu "Chỉ người trong nhóm đã chọn tên mới thấy số tài khoản này. Bạn xóa được
  bất cứ lúc nào."
- **AC-12.3** Given máy chưa chọn tên, Then không có số TK nào trong HTML/JSON trả về (kiểm bằng xem nguồn).
- **AC-12.4** When Hùng bấm "Xóa tài khoản", Then người nợ Hùng thấy "Hùng chưa nhập tài khoản. Bạn có thể
  nhắc Hùng." thay cho QR.
- **AC-12.7** Given máy gắn vào tên có sẵn chưa đủ 24 giờ, Then S9 không cho lưu/xóa (xem AC-23.1).
- **AC-12.5** Given Hùng mở kèo khác trên cùng máy, When vào S9, Then ngân hàng/số TK/tên được điền sẵn
  (nhớ trên máy), vẫn phải bấm "Lưu tài khoản".
- **AC-12.6 [Q9]** Given Hùng được nợ mà chưa nhập TK, When ở tab Kèo hoặc Chi tiêu, Then tab Trả tiền có chấm đỏ.

### US-13 Thấy mình nợ ai và QR
- **AC-13.1** Given Khoa đã chọn tên, Hùng đã nhập TK, When mở tab Trả tiền, Then thấy "Trả tiền cho Hùng ·
  Vũng Tàu 2N1Đ · lần 1/1", "870.000 ₫", nhãn "Chưa chuyển", mã QR, nút "Lưu ảnh QR", 3 bước, ghi chú
  "Có máy thứ hai thì quét thẳng mã này", bảng Ngân hàng MB Bank / Chủ TK NGUYEN VAN HUNG / Số TK
  0000 1111 2222 / Số tiền 870.000 ₫ / Nội dung GOPKEO VT2 KHOA.
- **AC-13.2** When bấm copy cạnh Số tiền, Then clipboard là "870000" (số trơn); copy Số TK là "000011112222";
  copy Nội dung là "GOPKEO VT2 KHOA".
- **AC-13.3** When bấm "Lưu ảnh QR", Then tải về một ảnh PNG có mã QR, số tiền và tên người nhận; mã QR là
  một `<img>` chạm giữ để lưu được.
- **AC-13.4** Given quét QR bằng app ngân hàng (thủ công M-3), Then app điền đúng số TK, tên chủ TK,
  870.000 ₫ và nội dung.
- **AC-13.5** Given Tuấn phải chuyển 2 người (Hùng 190.000 ₫, Linh 80.000 ₫), Then thấy 2 thẻ "lần 1/2",
  "lần 2/2"; thẻ 1 mở, thẻ 2 thu gọn; đánh dấu xong thẻ 1 thì thẻ 2 tự mở.
- **AC-13.6** Given Khoa không nợ ai, Then "Bạn không còn nợ ai trong kèo này."
- **AC-13.7** Given người mới mở link sau khi có chi tiêu (US-20), Then tab Kèo có nút "Xem mình nợ bao nhiêu";
  chạm tên ở S4 → tới thẳng S10 của mình (≤ 2 chạm).

### US-14 Đánh dấu đã chuyển, hoàn tác
- **AC-14.1** When Khoa bấm "Mình đã chuyển 870.000 ₫ cho Hùng", Then P14: "Đã chuyển · 21:40", "Đã ghi nhận
  bạn chuyển cho Hùng. Hùng sẽ thấy tên bạn trong mục "Đã trả".", "Bạn không còn nợ ai trong kèo này.",
  nút "Hoàn tác" và "Xong".
- **AC-14.2** When Khoa bấm "Hoàn tác", Then quay về trạng thái "Chưa chuyển", Hùng thấy Khoa lại ở "Chưa trả bạn".
- **AC-14.3** Given Tuấn vừa sửa khoản làm số Khoa nợ đổi, When Khoa bấm nút với số cũ, Then báo "Số liệu vừa
  thay đổi" và hiện số mới, chưa ghi gì.
- **AC-14.4** Given Nam (không phải người ghi), Then không hoàn tác được lần chuyển của Khoa.

### US-15 Người được nợ xem ai đã trả
- **AC-15.1** Given Nam đã trả 870.000 ₫, Khoa và Tuấn chưa, Then Hùng thấy "Bạn được nhận 1.930.000 ₫" (một
  dòng, không ngắt), "Bạn đã nhận 870.000 ₫ · Còn 1.060.000 ₫ từ 2 người", "Chưa trả bạn (2)": Khoa 870.000 ₫,
  Tuấn 190.000 ₫, "Đã trả bạn (1)": Nam 870.000 ₫ Đã chuyển, và câu "'Đã chuyển' do người trả tự đánh dấu.
  Bạn nên kiểm tra lại trong app ngân hàng."
- **AC-15.2** Given mọi người đã trả đủ, Then "Mọi người đã trả đủ cho bạn."

### US-16 Tin nhắc
- **AC-16.1** When Hùng bấm "Nhắc 2 người chưa trả", Then P20 (Gửi cả nhóm, Nhẹ nhàng) có tin "Nhắc nhẹ kèo
  Vũng Tàu 2N1Đ: Khoa còn 870.000 ₫, Tuấn còn 190.000 ₫, chuyển cho Hùng giúp mình nhé. Mở link để quét mã
  QR, số tiền đã điền sẵn: {link}".
- **AC-16.2** When bỏ chọn Tuấn ở "Nhắc ai", Then tin chỉ còn Khoa.
- **AC-16.3** When chọn "Ngắn gọn", Then tin đổi theo mẫu ngắn gọn R11; không có "nè"/"nha".
- **AC-16.4** When sửa chữ rồi bấm "Copy tin nhắc", Then clipboard đúng chữ đã sửa, tới P16 "Đã copy. Mở Zalo
  và dán vào nhóm."
- **AC-16.5** When chọn "Nhắn riêng từng người", Then P21: mỗi người 1 tin chỉ có phần của họ, nút "Copy tin
  cho Khoa"; copy xong nút đổi "Đã copy tin cho Khoa · dán vào Zalo".
- **AC-16.6** Given Hùng chưa nhập TK, When bấm nhắc, Then được mời nhập tài khoản trước.
- **AC-16.7** Link trong tin mở thẳng tab Trả tiền của kèo.

### US-17 Tiến độ cả nhóm
- **AC-17.1** Given Nam trả Hùng 870.000 ₫ và Mai trả Linh 750.000 ₫, Then S6/S11 hiện "Cả nhóm đã trả 2/6 lần
  chuyển" và "1.620.000 / 3.510.000 ₫", thanh tiến độ ~46%.

### US-18 Hoàn lại sau khi sửa [Q6]
- **AC-18.1** Given Bia chia 6 (có Mai), kế hoạch cho Mai → Hùng 850.000 ₫ và Mai đã đánh dấu chuyển, When Bia
  đổi thành chia 5, Then Mai thấy "Bạn đã chuyển cho Hùng 850.000 ₫ · Bạn được hoàn lại 100.000 ₫ · Hùng sẽ
  chuyển lại cho bạn khoản này."; Hùng thấy ở tab Trả tiền thẻ "Hoàn lại cho Mai 100.000 ₫" (có QR nếu Mai đã
  nhập TK, nếu chưa thì "Mai chưa nhập tài khoản"). Khớp prototype P11 đã sửa.
- **AC-18.2** Given Mai chưa nhập TK và được hoàn, Then tab Trả tiền của Mai có thẻ mời nhập tài khoản và chấm đỏ.
- **AC-18.3** When Hùng bấm "Mình đã hoàn 100.000 ₫ cho Mai", Then dòng hoàn lại xong, tiến độ tính cả dòng này.

### US-19 Đánh dấu đã nhận [Q13]
- **AC-19.1** Given Khoa chưa trả, When Hùng bấm "Đã nhận" ở dòng Khoa và xác nhận, Then Khoa chuyển sang
  "Đã trả bạn" với ghi chú "Hùng đánh dấu đã nhận"; Khoa thấy dòng của mình đã xong; Hùng hoàn tác được.

### US-20 Người mới xem nợ
- Xem AC-13.7.

### US-21 "Chưa nhận được"
- **AC-21.1** Given Khoa đã bấm "Mình đã chuyển 870.000 ₫ cho Hùng", When Hùng ở S11 bấm "Chưa nhận được" ở dòng
  Khoa và xác nhận "Bạn chưa thấy 870.000 ₫ từ Khoa trong tài khoản?", Then Khoa quay lại "Chưa trả bạn (…)" ở S11
  của Hùng, tiến độ cả nhóm giảm 1 lần chuyển, và hoạt động có dòng "Hùng báo chưa nhận được 870.000 ₫ từ Khoa".
- **AC-21.2** Then thẻ S10 của Khoa quay lại "Chưa chuyển" và hiện "Hùng báo chưa nhận được khoản bạn đánh dấu lúc
  21:40. Kiểm tra lại trong app ngân hàng rồi hỏi Hùng trong Zalo."; Khoa đánh dấu lại được.
- **AC-21.3** Given lần "Đã nhận" do chính Hùng đánh dấu, Then không có nút "Chưa nhận được" (chỉ "Hoàn tác").
- **AC-21.4** Given Nam (không phải người nhận), Then không thấy nút; gọi thẳng action → `FORBIDDEN`, DB không đổi.

### US-22 Giải thích gộp nợ
- **AC-22.1** Given Khoa nợ Hùng 870.000 ₫, Then ngay dưới thẻ đầu ở S10 có dòng "App đã gộp các khoản để cả nhóm
  chuyển ít lần nhất · Xem chi tiết".
- **AC-22.2** When bấm "Xem chi tiết", Then sheet hiện: "Homestay 2.800.000 ₫ · Hùng trả · phần bạn 400.000 ₫",
  "Hải sản tối 2.450.000 ₫ · Linh trả · phần bạn 350.000 ₫", "Bia 600.000 ₫ · Tuấn trả · phần bạn 120.000 ₫",
  "Tổng phần của bạn 870.000 ₫ − bạn đã trả 0 ₫ = bạn cần chuyển 870.000 ₫", "Chuyển cho Hùng 870.000 ₫", và câu
  "Thay vì chuyển riêng cho từng người đã trả, app gom lại để mỗi người chuyển ít lần nhất. Tổng tiền không đổi."
- **AC-22.3** Given Mai, Then dòng Bia ghi "không tính bạn"; Given Tuấn, Then thấy "Bạn đã trả: Bia 600.000 ₫",
  "Tổng phần của bạn 870.000 ₫ − bạn đã trả 600.000 ₫ = bạn cần chuyển 270.000 ₫", "Chuyển cho Hùng 190.000 ₫",
  "Chuyển cho Linh 80.000 ₫".

### US-23 Chống chiếm tài khoản nhận tiền
- **AC-23.1** Given máy B chọn tên "Hùng" (đã có máy A) và xác nhận "Đây là bạn trên máy mới?", When máy B mở S9,
  Then thấy "Máy mới cần đợi 24 giờ mới được đổi tài khoản nhận tiền. Bạn dùng máy cũ, hoặc quay lại sau 21:05 24/11."
  (giờ = lúc gắn + 24 giờ), không lưu hay xóa được; gọi thẳng action → `FORBIDDEN`, tài khoản không đổi.
- **AC-23.2** Given máy A của Hùng bấm "đổi" (bỏ gắn tên) rồi máy B chọn "Hùng", Then máy B vẫn phải đợi 24 giờ.
- **AC-23.3** Given máy A là máy tạo kèo (tên Hùng do máy A tạo), Then máy A lưu/xóa tài khoản ngay được.
- **AC-23.4** Given Hùng đã có tài khoản và lưu một số TK khác lúc 21:05 23/11, When Khoa mở S10 trong 48 giờ sau
  đó, Then thẻ "Trả tiền cho Hùng" có cảnh báo màu đỏ phía trên QR "Hùng vừa đổi tài khoản nhận tiền lúc 21:05
  23/11, hãy hỏi lại Hùng trong Zalo trước khi chuyển."; sau 48 giờ cảnh báo mất. Lần nhập đầu không có cảnh báo.
- **AC-23.6** Given Nam chưa nhập tài khoản, máy X chọn tên "Nam" và sau 24 giờ nhập tài khoản lần đầu lúc 09:30 25/11,
  When người nợ Nam mở S10 trong 48 giờ sau đó, Then thẻ có cảnh báo "Tài khoản nhận tiền của Nam vừa được nhập từ
  một máy mới lúc 09:30 25/11, hãy hỏi lại Nam trong Zalo trước khi chuyển."; sau 48 giờ cảnh báo mất.
- **AC-23.5** Then hoạt động của kèo (cả người chưa chọn tên) có "Hùng vừa lưu tài khoản nhận tiền (MB Bank)"
  hoặc "Hùng vừa xóa tài khoản nhận tiền", không có số TK.

## D. Chung (mọi màn)
- **AC-G.1** Chấm đỏ không bao giờ hiện trên tab đang mở (E3).
- **AC-G.2** Ở 360px không có cuộn ngang; số tiền và ₫ không bị tách dòng.
- **AC-G.3** Mọi nút có vùng chạm ≥ 44px; axe không có lỗi serious/critical.
- **AC-G.4** Màn tiền (S7–S11) không có chữ "nè", "nha".
- **AC-G.5** Không trang nào hỏi đăng ký, mật khẩu, số điện thoại.
- **AC-G.6** Quay lại tab trình duyệt sau khi người khác thay đổi → trang tự cập nhật (≤ 1 lần tải lại).
- **AC-G.7** Nút "Đổi vai" và màn Demo của prototype không có trong sản phẩm (E8).
- **AC-G.8** Given 10 kèo đã được tạo từ cùng một IP trong 1 giờ (kể cả khác thiết bị), When tạo kèo thứ 11,
  Then báo "Bạn thao tác hơi nhanh, đợi chút nhé." và không tạo; IP khác vẫn tạo được. Tương tự 30 tên mới/IP/giờ,
  và 30 thiết bị mới/IP/giờ (máy chưa có cookie chọn tên hay tạo kèo); máy đã có cookie không bị tính.
- **AC-G.9** DB không có cột nào chứa IP gốc; log server không có IP, số TK, token.
