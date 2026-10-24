# PRD — Góp Kèo v1

Trạng thái: Bước 7, đã chốt Q1–Q14 (2026-10-24) + 5 bổ sung bảo mật/minh bạch, chờ GATE. Ký hiệu `(Qn)` = quyết định đã chốt, xem STATUS.
Nguồn: [00-brief.md](00-brief.md), màn hình chuẩn [design/screens/](design/screens/) (P01–P21),
[design/tokens.md](design/tokens.md), [design/decisions.md](design/decisions.md).
Mọi số tiền là **số nguyên VND**, hiển thị dấu chấm nghìn + " ₫", không xuống dòng giữa số và ₫.

## 1. Mục tiêu
Một đường link gửi vào nhóm Zalo, không cần đăng ký. Qua link đó cả nhóm vote ngày và chỗ để chốt kèo,
ghi lại ai đã trả khoản gì, và mỗi người nhận mã VietQR có sẵn đúng số tiền mình nợ.

Chỉ số thành công (sau chuyến đi thật đầu tiên, đo ở Bước 20):
| # | Chỉ số | Cách đo |
|---|---|---|
| M1 | Chốt kèo trong ≤ 2 ngày | `trips.closed_at − trips.created_at` |
| M2 | ≥ 85% thành viên đã vote trước khi chốt (≈ 6/7) | thành viên có ≥ 1 vote / tổng thành viên lúc chốt |
| M3 | Người tạo nhắc vote ≤ 1 lần | tự khai ở phiếu hỏi Bước 20 |
| M4 (Q8) | ≥ 80% số lần chuyển được đánh dấu "đã trả" trong 48 giờ (thay cho "≥ 5/6 người") | mốc bắt đầu = lúc người nhận đã có tài khoản và khoản chi cuối cùng được ghi; đếm dòng chuyển đã trả hết |
| M5 | 0 lần có người thắc mắc lại số tiền trong nhóm | phiếu hỏi Bước 20 |
| M6 | Trong 1 tháng có ≥ 1 người khác tạo kèo mới | phiếu hỏi + đếm kèo |
| M7 | Mở link từ Zalo trên Android tầm trung qua 4G thấy nội dung ≤ 3 giây | LCP đo ở Bước 17 (Lighthouse mobile, 4G chậm) và thử thật ở Bước 18 |

## 2. Người dùng
- **Người tạo kèo** (Hùng): tạo kèo, chốt kèo, thường ứng tiền, cần "đòi hộ".
- **Người tham gia**: Tuấn (lười đọc), Mai (đòi minh bạch), người lớn tuổi (Android cũ, chỉ biết Zalo
  và app ngân hàng).
- **Người xem chưa chọn tên**: mở link nhưng chưa chạm tên mình. Xem được kèo và chi tiêu, chưa thấy số TK.

Danh tính: không tài khoản. Mỗi trình duyệt có một "mã thiết bị" (cookie). Chọn tên trong kèo = gắn
thiết bị đó với một **thành viên** của kèo. Một thiết bị chỉ là một thành viên trong một kèo.

## 3. Phạm vi v1 — user story

Ưu tiên: **Must** = phải có để ra mắt; **Should** = nên có, cắt được nếu trễ.

### A. Chốt kèo
| ID | Story | Màn | Ưu tiên |
|---|---|---|---|
| US-01 | Là người tạo, tôi tạo kèo với tên kèo, tên mình, vài khoảng ngày (lịch, chọn nhiều ngày, sang được tháng sau) và 0–6 chỗ (tên, giá/đêm và link tùy chọn), không cần đăng ký. | S1 | Must |
| US-02 | Là người tạo, tôi copy link hoặc tin mời soạn sẵn để gửi vào nhóm Zalo. | S2 | Must |
| US-03 | Là người nhận link, tôi mở link trong Zalo là thấy kèo (ngày, chỗ, số phiếu, ai vote) mà không phải nhập gì. | S3, S6 | Must |
| US-04 | Là người tham gia, tôi chạm một lựa chọn là lưu vote; lần đầu app hỏi "Bạn là ai?" (chạm tên có sẵn hoặc gõ tên mới), sau đó thấy "Đã lưu vote của …" và "bạn đã vote". | S3, S4 | Must |
| US-05 | Là người trong kèo, tôi thấy ai chưa vote và copy được tin nhắc khéo người chưa vote. | S3 | Should |
| US-06 | Là người tạo, tôi chốt kèo (mặc định phương án nhiều phiếu nhất); thẻ tóm tắt (ngày, chỗ, ai đi) ghim ở đầu trang và vote đóng lại. | S5, S6 | Must |
| US-07 (Q7) | Là người tạo, tôi mở lại vote sau khi chốt (phiếu cũ giữ nguyên, thẻ ghim gỡ đi). | S6 | Should |
| US-08 | Là người tạo, tôi sửa tên kèo, thêm/bớt ngày và chỗ khi chưa chốt. Bớt một lựa chọn thì phiếu của nó mất. | S1 (chế độ sửa) | Should |

### B. Chi tiêu
| ID | Story | Màn | Ưu tiên |
|---|---|---|---|
| US-09 | Là người trong kèo, tôi ghi một khoản chi: số tiền, cho việc gì, ai đã trả, chia cho ai (mặc định cả nhóm). Trước khi lưu tôi thấy mỗi người phải trả bao nhiêu, ai không bị tính, và câu làm tròn khi chia lẻ. | S7 | Must |
| US-10 | Là người trong kèo, tôi xem bảng chi tiêu: từng khoản (ai trả, chia mấy người, mỗi người bao nhiêu) và số dư từng người (nhận / nợ). | S8 | Must |
| US-11 | Là người có quyền **[Q3]**, tôi sửa hoặc xóa một khoản chi; mọi số dư tự tính lại; ai bị ảnh hưởng thấy thông báo "X vừa sửa khoản Y", phần của mình trước/sau, và lịch sử sửa của khoản đó. | S8 (P11) | Must |

### C. Trả tiền
| ID | Story | Màn | Ưu tiên |
|---|---|---|---|
| US-12 | Là người được nợ, tôi nhập tài khoản nhận tiền (ngân hàng, số TK, tên chủ TK gõ có dấu cũng được). Tôi xóa được tài khoản này. | S9 | Must |
| US-13 | Là người nợ, tôi thấy mình nợ ai bao nhiêu (mỗi người nhận một thẻ), mã VietQR đã điền sẵn số TK, số tiền, nội dung; tôi lưu được ảnh QR và copy số TK, số tiền, nội dung. | S10 | Must |
| US-14 | Là người nợ, tôi bấm "Mình đã chuyển … cho …" để đánh dấu đã trả, và hoàn tác được nếu bấm nhầm. | S10 (P14) | Must |
| US-15 | Là người được nợ, tôi thấy ai đã trả mình, ai chưa, và số tiền còn lại. | S11 | Must |
| US-16 | Là người được nợ, tôi xem trước tin nhắc (gửi cả nhóm hoặc nhắn riêng từng người, kiểu nhẹ nhàng hoặc ngắn gọn), sửa câu chữ, rồi copy để dán vào Zalo. | S11 (P20, P21, P16) | Must |
| US-17 | Là người trong kèo, tôi thấy tiến độ trả nợ của cả nhóm (số lần chuyển đã xong / tổng, số tiền). | S6, S11 | Must |
| US-18 (Q6) | Khi một khoản chi bị sửa sau khi đã có người trả, người trả thừa thấy mình "được hoàn lại" bao nhiêu và ai hoàn; người phải hoàn thấy dòng "Hoàn lại cho …" ở tab Trả tiền như một khoản nợ bình thường. | S8 (P11), S10 | Must |
| US-19 (Q13) | Là người được nợ, tôi đánh dấu "Đã nhận" cho một người (ví dụ họ trả tiền mặt) và hoàn tác được. | S11 | Should |
| US-21 | Là người được nợ, khi ai đó đánh dấu "đã chuyển" cho tôi mà tôi chưa thấy tiền, tôi bấm "Chưa nhận được" để hủy lần đánh dấu đó; người trả thấy dòng quay lại "chưa trả" kèm lý do. | S11, S10 | Must |
| US-22 | Là người nợ, tôi thấy app đã gộp các khoản thế nào: dòng "App đã gộp các khoản để cả nhóm chuyển ít lần nhất · Xem chi tiết" mở ra phần của tôi theo từng khoản chi và vì sao tôi chuyển cho người này. | S10 | Must |
| US-23 | Là người được nợ, tài khoản nhận tiền của tôi không bị người khác đổi lén: máy mới chọn tên tôi phải đợi 24 giờ mới đổi được tài khoản, người nợ được cảnh báo khi tài khoản vừa đổi, và cả nhóm thấy mỗi lần lưu tài khoản. | S9, S10, hoạt động | Must |
| US-20 | Là người mới mở link sau khi đã có chi tiêu, tôi bấm "Xem mình nợ bao nhiêu", chạm tên mình và thấy ngay số tiền + QR. | S6 (P18), S4 (P19) | Must |

### D. Không làm ở v1
Giữ toàn bộ "Không làm" của brief (không app cài đặt, không đăng ký/OTP, không giữ tiền hay đối soát
ngân hàng, không chat, không đặt phòng/bản đồ, không ngoại tệ/tiếng Anh/Zalo Mini App/quỹ chung). Thêm:
- (Q14) Không chia không đều (theo tỷ lệ hay số tiền riêng từng người). Chỉ chia đều cho những người được chọn.
- (Q14) Không mở thẳng app ngân hàng bằng deeplink (chưa tìm được tài liệu chính thức; xem ghi chú §8).
- Không trả một phần: đánh dấu "đã chuyển" là trả hết dòng đó.
- Không gửi tin nhắn, thông báo đẩy, email.
- (Q14) Không xóa kèo ở v1; chỉ xóa được tài khoản nhận tiền của chính mình.
- Không thời gian thực: trang tự tải lại khi quay lại tab trình duyệt và sau mỗi thao tác.

## 4. Quy tắc nghiệp vụ

### R1. Thành viên và danh tính
- Kèo có 1–20 thành viên (Q10). Tên 1–30 ký tự, phải có ít nhất 1 chữ hoặc số. Hai tên trùng nhau nếu giống nhau
  sau khi bỏ dấu (đ → d), viết thường và **bỏ mọi ký tự không phải chữ a–z hay số** (khoảng trắng, dấu câu, ký hiệu,
  emoji): "Tuấn" = "tuan" = "Tuấn." = "T.u.a.n 😀" = "tu an". Chống tạo tên gần giống để ghi khoản chi giả.
- **Nhãn "mới":** thành viên vào kèo chưa tới 48 giờ có nhãn nhỏ "mới" cạnh avatar ở mọi chỗ hiện avatar (trừ
  người tạo kèo), để cả nhóm dễ nhận ra tên lạ vừa xuất hiện.
- Người tạo là thành viên đầu tiên (thứ tự vào kèo = 1).
- **(Q5) Trùng tên / đổi máy:** ở "Bạn là ai?", tên đã có máy khác chọn vẫn chạm được, nhưng
  app hỏi lại "Tên Tuấn đang được dùng trên một máy khác. Đây là bạn trên máy mới?". Đồng ý thì cả hai
  máy cùng là Tuấn, và kèo ghi một dòng hoạt động "Tuấn vừa mở kèo trên một máy khác" mà ai cũng thấy.
  Gõ tên mới trùng tên đã có → gợi ý "Bạn là Tuấn này à?" thay vì tạo tên thứ hai.
- "đổi" (dòng "Bạn đang vote với tên … · đổi") = bỏ gắn tên trên máy này rồi chọn lại.
- Màu avatar theo thứ tự vào kèo, 7 màu trong tokens; (Q10) từ người thứ 8 lặp lại từ đầu.
  Chữ trên avatar: chữ cái đầu; trùng chữ đầu với người khác thì 2 chữ ("Th").

### R2. Vote và chốt
- Mỗi khoảng ngày liên tiếp được chọn ở lịch là **một lựa chọn ngày** (14 và 15 → "T7–CN 14–15/11"),
  tối đa 10 lựa chọn ngày, mỗi lựa chọn dài tối đa 14 ngày, không chọn ngày trong quá khứ.
- Vote nhiều lựa chọn được, chạm lại để bỏ. Lưu ngay mỗi lần chạm.
- "Đã vote" = có ít nhất 1 phiếu (ngày hoặc chỗ). Dòng đầu: "4/7 người đã vote · bạn chưa vote".
- "★ Đang dẫn" gắn cho mọi lựa chọn có số phiếu cao nhất (> 0) trong nhóm ngày hoặc nhóm chỗ; hòa thì
  gắn cả hai.
- Chỉ người tạo chốt kèo. Chọn đúng 1 ngày; chọn 1 chỗ nếu kèo có chỗ. Mặc định: nhiều phiếu nhất, hòa thì
  ngày sớm hơn / chỗ được thêm trước.
- "Ai đi" trên thẻ chốt = tất cả thành viên của kèo (kể cả người vào sau khi chốt).
- Sau khi chốt: không vote được nữa; vẫn vào kèo (chọn tên) và ghi chi tiêu được.
- Chi tiêu ghi được cả khi chưa chốt.

### R3. Chia một khoản chi (Q1)
Chia đều cho n người được chọn (1 ≤ n ≤ 20). Khoản chi 1.000 ₫ – 500.000.000 ₫.
1. Nếu số tiền chia hết cho n: mỗi người = số tiền / n.
2. Nếu không: mỗi người = số tiền / n **làm tròn đến 1.000 ₫** (từ 500 trở lên làm tròn lên); **người trả**
   chịu phần chênh (phần của người trả = số tiền − tổng phần của những người còn lại). Nếu người trả không
   nằm trong danh sách chia, người chịu chênh là người vào kèo sớm nhất trong danh sách chia.
3. Nếu làm tròn khiến phần người chịu chênh bị âm (số tiền nhỏ, nhiều người), dùng làm tròn xuống đến
   1.000 ₫ thay vì làm tròn gần nhất.
4. Nếu mỗi phần dưới 1.000 ₫ (số tiền < 1.000 × n), không làm tròn: chia đến từng đồng, phần dư vài đồng
   tính cho người chịu chênh.

Câu thay dòng giữ chỗ ở S7 (E7), hiện **khi chia lẻ**:
> "Chia lẻ nên làm tròn đến 1.000 ₫: 86.000 ₫ mỗi người, riêng Tuấn (người trả) 84.000 ₫."

Ví dụ 600.000 ₫ chia 7, Tuấn trả: 6 người × 86.000 + Tuấn 84.000 = 600.000.

### R4. Số dư
Số dư của một người = tổng tiền người đó đã trả cho các khoản chi − tổng phần của người đó.
Dương = "nhận", âm = "nợ". Tổng số dư cả nhóm luôn bằng 0. Khoản chi đã xóa không tính.

### R5. Kế hoạch chuyển tiền (gộp nợ) (Q2)
Mục tiêu: mỗi người nợ chuyển cho **ít người nhất**, thường là 1. Kế hoạch tính lại từ dữ liệu mỗi lần
xem, theo thứ tự cố định, nên ai xem cũng ra cùng một kết quả.

Thứ tự: người nợ xếp theo số nợ giảm dần, bằng nhau thì ai vào kèo trước đứng trước. Người được nợ
cũng vậy theo số được nhận.

1. **Kế hoạch gốc** (chỉ từ số dư, chưa tính ai đã trả): lần lượt từng người nợ, giao cho **người được
   nợ đầu tiên còn đủ chỗ** nhận hết số nợ của họ. Không ai đủ chỗ thì chia ra cho những người được nợ
   còn chỗ, theo thứ tự.
2. **Giữ cặp đã trả**: với mỗi cặp đã có tiền chuyển (A đã chuyển cho B), giữ cặp đó trước, tối đa bằng
   số đã chuyển, số A còn nợ và số B còn được nhận.
3. Phần còn lại đi theo kế hoạch gốc (trừ phần đã giữ ở bước 2), rồi phần dư cuối cùng chia theo cách ở bước 1.
4. Mỗi cặp: **còn phải chuyển = kế hoạch − đã chuyển**. Nếu âm thì người nhận phải **hoàn lại** phần
   chênh cho người đã chuyển (US-18, **[Q6]**).

Hệ quả: khi không ai sửa chi tiêu, đánh dấu đã trả không làm thay đổi các dòng khác.
Với dữ liệu mẫu (Homestay 2.800.000 Hùng trả chia 7; Hải sản 2.450.000 Linh trả chia 7; Bia 600.000
Tuấn trả chia 5 trừ Mai, Thảo), kế hoạch là 6 lần chuyển: Nam → Hùng 870.000, Khoa → Hùng 870.000,
Tuấn → Hùng 190.000, Mai → Linh 750.000, Thảo → Linh 750.000, Tuấn → Linh 80.000. Khớp prototype.
Ca sửa Bia (P11): lúc Bia còn chia 6 (có Mai), kế hoạch gốc cho Mai → **Hùng** 850.000. Mai chuyển xong, Bia sửa
thành chia 5 → giữ cặp Mai → Hùng ở mức 750.000 → **Hùng hoàn lại cho Mai 100.000 ₫**. Prototype P11 đã sửa theo.

**Giải thích gộp nợ ở S10** (US-22): dưới thẻ đầu có dòng "App đã gộp các khoản để cả nhóm chuyển ít lần nhất ·
Xem chi tiết". Mở ra (bottom sheet) thấy:
- Phần của tôi theo từng khoản: "Homestay 2.800.000 ₫ · Hùng trả · phần bạn 400.000 ₫", "Hải sản tối … 350.000 ₫",
  "Bia … phần bạn 120.000 ₫" (khoản tôi không bị tính: "không tính bạn").
- Tôi đã trả cho các khoản: "Bạn đã trả: 0 ₫" (hoặc liệt kê khoản tôi trả).
- Tổng: "Tổng phần của bạn 870.000 ₫ − bạn đã trả 0 ₫ = bạn cần chuyển 870.000 ₫".
- Đã chuyển / được hoàn (nếu có), rồi các dòng chuyển của tôi: "Chuyển cho Hùng 870.000 ₫".
- Câu giải thích: "Thay vì chuyển riêng cho từng người đã trả, app gom lại để mỗi người chuyển ít lần nhất. Tổng
  tiền không đổi."

### R6. Đánh dấu đã trả
- Người nợ bấm "Mình đã chuyển X ₫ cho Y" ở thẻ của dòng đó → ghi 1 lần chuyển bằng đúng số còn phải
  chuyển. Nếu số trên màn đã cũ (ai đó vừa sửa chi tiêu), app báo "Số tiền vừa thay đổi" và hiện số mới.
- Hoàn tác: chỉ người đã đánh dấu. Lần chuyển bị hoàn tác vẫn nằm trong hoạt động (gạch ngang).
- **"Chưa nhận được"** (US-21): người nhận bấm ở một lần chuyển do **người trả** đánh dấu (`sent`) trên dòng của
  mình → xác nhận "Bạn chưa thấy 870.000 ₫ từ Khoa trong tài khoản?" → lần chuyển bị hủy (lý do "người nhận báo
  chưa nhận được"), ghi hoạt động "Hùng báo chưa nhận được 870.000 ₫ từ Khoa". Dòng của Khoa quay lại "Chưa
  chuyển", thẻ S10 của Khoa hiện "Hùng báo chưa nhận được khoản bạn đánh dấu lúc 21:40. Kiểm tra lại trong app
  ngân hàng rồi hỏi Hùng trong Zalo." Không áp dụng cho lần do chính người nhận đánh dấu "Đã nhận" (cái đó dùng hoàn tác).
- (Q13) Người được nợ bấm "Đã nhận" ở dòng "Chưa trả bạn" → ghi 1 lần chuyển như trên,
  ghi rõ "Hùng đánh dấu đã nhận".
- Dòng chuyển đã trả hết hiện "Đã chuyển · giờ" ở cả hai phía. Nhãn nhắc ở S11: "'Đã chuyển' do người
  trả tự đánh dấu. Bạn nên kiểm tra lại trong app ngân hàng."

### R7. Tiến độ cả nhóm
"Cả nhóm đã trả a/b lần chuyển · x / y ₫": b = số dòng trong kế hoạch (kể cả dòng hoàn lại),
a = số dòng còn phải chuyển = 0, y = tổng kế hoạch, x = tổng đã chuyển (mỗi dòng tính tối đa bằng kế hoạch).

### R8. Tài khoản nhận tiền và VietQR
- Ngân hàng chọn từ danh sách ngân hàng hỗ trợ VietQR (mã BIN 6 số, lưu sẵn trong mã nguồn).
- Số TK: 4–19 chữ số (bỏ khoảng trắng khi lưu). Tên chủ TK: tự đổi sang IN HOA không dấu, chỉ A–Z và khoảng trắng.
- **(Q4) Ai thấy số TK:** chỉ người **đã chọn tên** trong kèo; người mở link chưa chọn tên không thấy.
  Ở S11 của chính mình hiện dạng rút gọn "MB Bank ···2222". Câu ở S9 đổi thành:
  "Chỉ người trong nhóm đã chọn tên mới thấy số tài khoản này. Bạn xóa được bất cứ lúc nào."
- Máy nhớ tài khoản gần nhất (trên chính máy đó, không lưu lên server) để điền sẵn ở kèo sau.
- Mã QR: chuẩn VietQR (EMVCo, Napas 247), có số tiền và nội dung, tạo ngay trên máy, không gọi dịch vụ ngoài.
- **(Q11) Nội dung chuyển khoản:** `GOPKEO <mã kèo> <TÊN NGƯỜI TRẢ>`, IN HOA không dấu, tối đa
  25 ký tự, chỉ A–Z, 0–9, khoảng trắng. Mã kèo = chữ cái đầu của tối đa 3 từ đầu tên kèo ("Vũng Tàu 2N1Đ"
  → "VT2"). Tên người trả cắt bớt nếu quá dài. Ví dụ "GOPKEO VT2 KHOA".
- Người được nợ chưa nhập tài khoản: thẻ ở S10 của người nợ hiện "Hùng chưa nhập tài khoản. Bạn có thể
  nhắc Hùng." và **không** có QR; nút "Mình đã chuyển" vẫn dùng được (chuyển tay/tiền mặt).

### R12. Chống chiếm tài khoản nhận tiền (US-23, P0 bảo mật)
Vì ai cũng chọn được tên người khác (Q5), kẻ xấu có thể chọn tên Hùng rồi thay số TK của Hùng bằng số của mình.
1. **Máy mới phải đợi 24 giờ:** thiết bị được gắn vào một tên **có sẵn** (chạm tên ở "Bạn là ai?", kể cả sau khi
   xác nhận "Đây là bạn trên máy mới?") trong 24 giờ gần nhất thì **không** lưu hay xóa được tài khoản nhận tiền.
   Câu báo: "Máy mới cần đợi 24 giờ mới được đổi tài khoản nhận tiền. Bạn dùng máy cũ, hoặc quay lại sau {giờ}."
   (`{giờ}` = lúc hết hạn chờ, dạng "21:05 24/11".)
   Chỉ máy **tạo ra** tên đó (tạo kèo, hoặc gõ tên mới ở "Chưa thấy tên mình?") được đổi ngay. Lý do rộng hơn
   "chỉ khi xác nhận máy mới": nếu chủ tên bấm "đổi" (bỏ gắn) thì tên không còn máy nào, máy lạ chọn vào sẽ không
   bị hỏi xác nhận; quy tắc này chặn cả ca đó. Đánh đổi: tự bấm "đổi" rồi chọn lại tên mình cũng phải đợi 24 giờ.
2. **Cảnh báo trên thẻ S10 của người nợ** (màu danger, phía trên QR), trong 48 giờ kể từ lần lưu, khi **một trong hai**:
   - (a) tài khoản được **đổi** (lưu lại khi trước đó đã từng có tài khoản, kể cả xóa rồi nhập lại):
     "Hùng vừa đổi tài khoản nhận tiền lúc 21:05 23/11, hãy hỏi lại Hùng trong Zalo trước khi chuyển."
   - (b) tài khoản được lưu từ một máy **gắn vào tên có sẵn** (`claimed`), **kể cả lần nhập đầu** (ví dụ kẻ xấu chọn
     tên người chưa nhập tài khoản, đợi hết 24 giờ rồi nhập số của mình):
     "Tài khoản nhận tiền của Hùng vừa được nhập từ một máy mới lúc 21:05 23/11, hãy hỏi lại Hùng trong Zalo trước khi chuyển."
   Cả hai cùng đúng thì hiện câu (a). Lần nhập đầu từ máy đã tạo ra tên đó: không cảnh báo.
3. **Công khai:** mỗi lần lưu/xóa tài khoản ghi hoạt động mà ai cũng thấy: "Hùng vừa lưu tài khoản nhận tiền
   (MB Bank)", "Hùng vừa xóa tài khoản nhận tiền". Không bao giờ có số TK trong hoạt động.
4. Người tạo kèo **không** sửa hay xóa được tài khoản của người khác (R9), nên câu báo không nhắc tới người tạo.

### R9. Quyền (Q3)
| Việc | Ai làm được |
|---|---|
| Xem kèo, vote, chi tiêu, số dư, tiến độ | Ai có link |
| Vote | Người đã chọn tên, khi kèo chưa chốt |
| Sửa kèo, chốt, mở lại vote | Người tạo kèo (thành viên số 1, trên mọi máy đã chọn tên này) |
| Thêm khoản chi | Người đã chọn tên |
| Sửa / xóa khoản chi | Người ghi khoản đó, người trả khoản đó, hoặc người tạo kèo |
| Nhập / xóa tài khoản nhận tiền | Chính người đó, trừ máy mới chưa đủ 24 giờ (R12) |
| Xem số TK | Người đã chọn tên **[Q4]** |
| Đánh dấu "đã chuyển", hoàn tác | Người nợ trên dòng đó (hoàn tác: người đã đánh dấu) |
| Đánh dấu "đã nhận" **[Q13]** | Người được nợ trên dòng đó (hoàn tác: người đã đánh dấu) |
| "Chưa nhận được" (hủy lần đánh dấu `sent`) | Người được nợ trên dòng đó |
| Xem trước / copy tin nhắc | Người được nợ (tin đòi tiền), ai trong kèo (tin nhắc vote) |
Mọi thay đổi chi tiêu và tiền ghi vào **hoạt động** của kèo (ai, lúc nào, trước/sau), ai cũng xem được.

### R10. Thông báo trong trang (không gửi ra ngoài)
- Toast sau khi lưu: "Đã lưu vote của Tuấn!", "Đã lưu khoản Bia. Số dư đã được tính lại."
- Banner thay đổi (P11): khi có khoản chi được **thêm, sửa hoặc xóa bởi người khác** làm thay đổi phần của tôi
  (phần tôi phải trả, hoặc số tôi được nhận vì tôi là người trả) kể từ lần tôi bấm "Đã hiểu" gần nhất. Gồm: ai làm,
  lúc nào, khoản nào, phần của tôi trước/sau, đã chuyển bao nhiêu, được hoàn/còn phải trả, thay đổi với người khác.
  Nhiều thay đổi thì liệt kê từng dòng, mới nhất trên cùng. Khoản mới: "Linh vừa thêm khoản Cà phê 140.000 ₫ (20:05):
  phần của bạn 20.000 ₫." Khoản do chính tôi thêm/sửa không vào banner của tôi.
- **Chấm đỏ** (chỉ trên tab **khác** tab đang mở, E3):
  - Kèo: kèo chưa chốt, tôi đã chọn tên và chưa vote.
  - Chi tiêu: có banner thay đổi chưa đọc.
  - Trả tiền: tôi còn dòng phải chuyển; **hoặc (Q9)** tôi được nợ mà chưa nhập tài khoản.

### R11. Tin soạn sẵn
`{kèo}` = tên kèo, `{link}` = link kèo (tin đòi tiền mở thẳng tab Trả tiền), `{tôi}` = tên người gửi.
Màn tiền không dùng "nè/nha".
| Tin | Mẫu |
|---|---|
| Mời (S2) | {tôi} rủ đi {kèo} nè! Chạm link chọn ngày với chỗ, không cần đăng ký: {link} |
| Nhắc vote (S3) | Còn {A, B} chưa vote kèo {kèo} nè! Chạm link chọn ngày với chỗ, 1 phút thôi: {link} |
| Đòi tiền · cả nhóm · nhẹ nhàng (P20) | Nhắc nhẹ kèo {kèo}: {A} còn {x}, {B} còn {y}, chuyển cho {tôi} giúp mình nhé. Mở link để quét mã QR, số tiền đã điền sẵn: {link} |
| Đòi tiền · cả nhóm · ngắn gọn | Kèo {kèo}, còn chờ chuyển cho {tôi}: {A} {x}, {B} {y}. Mã QR có sẵn số tiền: {link} |
| Đòi tiền · riêng · nhẹ nhàng (P21) | {A} ơi, kèo {kèo} bạn còn {x} chuyển cho {tôi} giúp mình nhé. Mở link để quét mã QR: {link} |
| Đòi tiền · riêng · ngắn gọn | {A}: kèo {kèo}, bạn còn {x} chuyển cho {tôi}. Mã QR có sẵn số tiền: {link} |
| Hoàn lại (người nhận thừa nhắc người phải hoàn) | Dùng mẫu đòi tiền, thay "chuyển cho" bằng "hoàn lại cho" |
Tin sửa được trước khi copy; sửa không lưu lại. Copy xong: "Đã copy. Mở Zalo và dán vào nhóm."
Nút "Gửi vào Zalo" ở S2 dùng chia sẻ của hệ điều hành (Web Share) nếu có; không có thì copy.

## 5. Màn hình và trạng thái
Bố cục, câu chữ, màu theo prototype ([design/screens/README.md](design/screens/README.md)). Trạng thái
trống/đang tải/lỗi theo nội dung wireframe, vẽ lại theo tokens.
| Mã | Màn | Đường dẫn | Trống / tải / lỗi |
|---|---|---|---|
| — | Trang chủ | `/` | Giới thiệu 1 câu + nút "Tạo kèo" |
| S1 | Tạo kèo / sửa kèo | `/tao`, `/k/[slug]/sua` | Nút quay khi gửi; lỗi giữ nguyên dữ liệu đã nhập |
| S2 | Chia sẻ link | `/k/[slug]/chia-se` | Chưa ai vào: "Chưa ai vào kèo" |
| S3 | Tab Kèo, đang vote | `/k/[slug]` | Khung xương khi tải; lỗi mạng: banner + "Thử lại" |
| S4 | Bạn là ai? (bottom sheet) | trên S3, S6, S10 | Lỗi lưu: giữ sheet, báo lỗi |
| S5 | Chốt kèo | `/k/[slug]/chot` | Chưa ai vote: vẫn chốt được, mặc định lựa chọn đầu |
| S6 | Tab Kèo, đã chốt | `/k/[slug]` | Chưa có chi tiêu: "Chưa có khoản chi nào" + "Thêm khoản chi" |
| S7 | Thêm / sửa khoản chi | `/k/[slug]/chi-tieu/them`, `/k/[slug]/chi-tieu/[id]` | Lỗi: giữ dữ liệu; khoản đã bị người khác sửa: báo và tải số mới |
| S8 | Tab Chi tiêu | `/k/[slug]/chi-tieu` | Trống: như S6 |
| S9 | Tài khoản nhận tiền | `/k/[slug]/tra-tien/tai-khoan` | — |
| S10 | Tab Trả tiền, mình nợ | `/k/[slug]/tra-tien` | Không nợ ai: "Bạn không còn nợ ai trong kèo này." |
| S11 | Tab Trả tiền, mình được nợ; tin nhắc | `/k/[slug]/tra-tien`, `/k/[slug]/tra-tien/nhac` | Chưa nhập TK: thẻ mời nhập TK; mọi người đã trả: "Mọi người đã trả đủ cho bạn." |
Người vừa nợ vừa được nợ (ví dụ Tuấn sau khi sửa) thấy cả hai phần trên tab Trả tiền: "Bạn cần chuyển" ở trên, "Bạn được nhận" ở dưới.
Nhiều dòng phải chuyển: thẻ đầu mở, các thẻ sau thu gọn; chuyển xong thẻ này thì thẻ sau tự mở (G7).
Link không tồn tại: trang "Không tìm thấy kèo này. Kiểm tra lại link trong Zalo."

## 6. Yêu cầu phi chức năng
- **Tốc độ:** trang kèo trả về HTML đã có dữ liệu (render phía server); LCP ≤ 3 giây trên Android tầm
  trung 4G; JS phía client của trang kèo ≤ 150 KB (gzip); không tải font chặn hiển thị (font-display: swap).
- **Trình duyệt:** trình duyệt trong Zalo (Android, iOS), Chrome Android 2 năm gần nhất, Safari iOS 16+.
  Không phụ thuộc localStorage để chạy được (chỉ dùng cho tiện ích như nhớ tài khoản).
- **Màn hình:** 360–430px là chính; desktop hiển thị cột giữa 430px.
- **Tiếp cận:** chữ thân 17px, vùng chạm ≥ 44px, tương phản AA, mọi nút có nhãn đọc được.
- **Ngôn ngữ, giờ:** tiếng Việt; giờ Việt Nam (Asia/Ho_Chi_Minh).
- **Bảo mật & riêng tư:** link kèo khó đoán; số TK không lộ cho người chưa chọn tên; không log số TK;
  không gửi dữ liệu cho dịch vụ bên thứ ba (QR tạo tại máy); khóa bí mật chỉ ở server. Xem
  [02-architecture.md](02-architecture.md) §5.
- **Giới hạn chống lạm dụng:** 20 thành viên/kèo, 200 khoản chi/kèo. Tạo kèo: 20 kèo/thiết bị/24 giờ **và**
  10 kèo/IP/giờ, 50 kèo/IP/24 giờ. Thêm tên mới (`joinAsNewMember`): 30 lần/IP/giờ. Tạo thiết bị mới (cookie
  `gk_device`, ở mọi action tạo cookie: tạo kèo, chọn tên, thêm tên): 30 thiết bị/IP/giờ, 100/IP/24 giờ. IP chỉ lưu dạng hash có khóa
  (HMAC), xóa sau 7 ngày. Mức theo IP để rộng vì mạng 4G dùng chung IP cho nhiều người (CGNAT). Chi tiết ở
  [02-architecture.md](02-architecture.md) D8.

## 7. Quyết định đã chốt
Q1–Q14 chốt theo đề xuất ngày 2026-10-24 (bảng trong [STATUS.md](STATUS.md)). Bổ sung cùng ngày: R12 (chống chiếm
tài khoản), giới hạn theo IP, "Chưa nhận được" (US-21), giải thích gộp nợ (US-22). Sửa khi duyệt GATE: câu chờ 24 giờ
không nhắc người tạo; cảnh báo khi TK được lưu từ máy `claimed`; chống khoản chi giả (khóa tên chặt, banner cả khoản
mới, nhãn "mới"); giới hạn IP khi tạo thiết bị.

## 8. Chưa kiểm chứng
- Lưu ảnh QR trong trình duyệt Zalo (Android/iOS); quét ảnh QR đã lưu bằng app ngân hàng thật → Bước 18.
- Giới hạn ký tự nội dung chuyển khoản của từng ngân hàng (đề xuất 25 ký tự là mức an toàn, chưa thử).
- Deeplink mở thẳng app ngân hàng: chưa tìm được tài liệu chính thức về định dạng; để sau v1.
- Prototype chưa vẽ dòng "App đã gộp các khoản…" và sheet chi tiết (US-22), cảnh báo đổi TK (R12) và nút
  "Chưa nhận được" (US-21): vẽ theo tokens khi code.
- 8 giả định của brief (xem STATUS).
