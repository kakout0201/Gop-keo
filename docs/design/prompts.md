# Prompt cho Claude Design — Góp Kèo

Cách dùng: chạy cả 4 prompt **trong cùng một project Claude Design**, theo thứ tự.
Prompt (1) có đủ bối cảnh, các prompt sau dựa vào kết quả của prompt trước.
Nguồn: [docs/00-brief.md](../00-brief.md).

- Bước 3: chạy (1) và (2).
- Bước 4: chạy (3).
- Bước 5: chạy (4).

---

## Prompt (1) — User flow + danh sách màn hình

```text
Mình đang thiết kế "Góp Kèo", một web app mobile (mở từ link trong nhóm Zalo, không cài app,
không đăng ký) giúp nhóm bạn/gia đình 4–12 người lên kèo đi chơi và chia tiền sau buổi đi.

BỐI CẢNH (từ brief):
- Nỗi đau thật: nhóm 7 bạn mất 9 ngày, ~200 tin nhắn Zalo mới chốt chuyến Vũng Tàu; bình chọn Zalo
  bị trôi; chốt xong không ai ghim. Sau chuyến, 3 người cùng ứng tiền; tiền bia 600.000 ₫ bị chia cho
  7 dù chỉ 5 người uống → phải tính lại khi đã có người chuyển; người nợ phải tự gõ số tài khoản, gõ
  sai; 3 tuần sau còn 2 người chưa trả, người ứng tiền ngại nhắc. CHỖ ĐAU NHẤT: đòi tiền và tính lại khi sai.
- Người dùng: Hùng (người tạo kèo, hay ứng tiền); Tuấn (lười đọc, chỉ chịu 1–2 chạm); Mai (đòi minh
  bạch từng khoản); mẹ 54 tuổi (Android cũ, chỉ biết Zalo và app ngân hàng, cần chữ to).
- 3 việc bắt buộc:
  1. Chốt kèo: người tạo đưa ra vài ngày + vài địa điểm; mỗi người vote 1–2 chạm, thấy ai chưa vote;
     khi chốt có thẻ tóm tắt (ngày, nơi, ai đi) luôn ghim ở đầu trang kèo.
  2. Ghi chi tiêu minh bạch: nhiều người cùng ứng tiền; mỗi khoản ghi ai trả và chia cho những ai;
     ai cũng xem bảng chi tiêu; sửa một khoản thì mọi số dư tự tính lại.
  3. Trả nợ bằng VietQR: mỗi người thấy mình nợ ai bao nhiêu, kèm mã QR điền sẵn số tài khoản và số
     tiền, rồi bấm "Tôi đã chuyển". Mỗi người được nợ thấy ai đã trả mình, ai chưa; cả nhóm thấy
     tổng tiến độ trả nợ.
- Không gửi tin nhắn/thông báo. "Đòi hộ" = trang "Ai chưa trả" + nút copy tin nhắc soạn sẵn (tên, số
  tiền, link) để người dùng tự dán vào Zalo.
- KHÔNG làm: app cài đặt, đăng ký/OTP, đăng nhập mạng xã hội, giữ tiền hay xử lý thanh toán, đối soát
  ngân hàng, chat trong app, đặt phòng/so giá, bản đồ, ngoại tệ, tiếng Anh.

RÀNG BUỘC:
- Mở link từ Zalo là thấy nội dung kèo ngay, không bắt nhập gì trước. Chỉ khi vote/ghi chi tiêu lần
  đầu mới hỏi "Bạn là ai?" (chọn tên có sẵn trong nhóm hoặc gõ tên mình, 1 ô). Không mật khẩu.
- Việc chính (vote, xem mình nợ bao nhiêu và mở QR) tối đa 3 chạm từ lúc mở link.
- Tiếng Việt hoàn toàn. Tiền là số nguyên VND, dạng "1.500.000 ₫".

HÃY LÀM:
1. User flow dạng sơ đồ cho 3 vai: người tạo kèo, người tham gia, người được nợ (người đã ứng tiền).
   Đánh dấu rõ chỗ "Bạn là ai?" xuất hiện và các nhánh lỗi (link hỏng, mất mạng).
2. Danh sách màn hình đánh số S1..Sn, mỗi màn: tên, mục đích 1 câu, vai dùng, 1 nút hành động chính.
   Gợi ý ban đầu (được gộp/tách nếu hợp lý hơn, nhưng giải thích lý do):
   S1 Tạo kèo · S2 Chia sẻ link vào Zalo · S3 Trang kèo – đang vote · S4 "Bạn là ai?" ·
   S5 Chốt kèo (người tạo) · S6 Trang kèo – đã chốt (thẻ tóm tắt ghim đầu) · S7 Thêm/sửa khoản chi ·
   S8 Bảng chi tiêu + số dư từng người · S9 Nhập tài khoản nhận tiền (người được nợ) ·
   S10 Mình nợ ai (danh sách + QR + "Tôi đã chuyển") · S11 Tiến độ trả nợ + "Ai chưa trả" + copy tin nhắc.
3. Với việc chính "vote" và "trả nợ", đếm số chạm từ lúc mở link Zalo và ghi ra.
Chưa cần vẽ giao diện chi tiết.
```

---

## Prompt (2) — Wireframe mobile 390px, 4 trạng thái

```text
Dựa trên user flow và danh sách màn hình S1..Sn vừa làm, vẽ wireframe low-fidelity (xám, chưa màu
thương hiệu) cho TẤT CẢ màn hình, khung mobile rộng 390px (kiểm tra thêm ở 360px cho Android nhỏ).

Mỗi màn hình vẽ 4 trạng thái cạnh nhau: Bình thường · Trống · Đang tải · Lỗi.
- Trống: ví dụ chưa ai vote, chưa có khoản chi nào, chưa ai trả, người được nợ chưa nhập tài khoản.
  Trạng thái trống phải có 1 câu hướng dẫn + 1 nút làm việc tiếp theo.
- Đang tải: dùng skeleton (không spinner trắng toàn màn hình), vì link mở trong trình duyệt Zalo
  trên máy tầm trung và người dùng bỏ đi nếu thấy trắng màn hình.
- Lỗi: mất mạng, link không tồn tại/đã xóa, lưu thất bại. Câu chữ thân thiện, có nút "Thử lại".

Quy tắc:
- Mỗi màn hình đúng 1 nút chính (to, ở vùng ngón cái phía dưới); hành động phụ là nút/viền/link nhỏ hơn.
- Chữ nội dung ≥ 16px, vùng chạm ≥ 44px; nghĩ đến người 54 tuổi dùng Android cũ.
- Tiền luôn có ₫ và dấu chấm phân cách nghìn: 2.450.000 ₫. Ô nhập tiền hiện bàn phím số và tự thêm dấu chấm.
- Trên S6/S8/S10: luôn thấy "mình nợ bao nhiêu" hoặc "mình được nhận bao nhiêu" mà không phải cuộn.
- S7: chọn "chia cho ai" mặc định là cả nhóm, bỏ chọn từng người bằng 1 chạm (ca tiền bia không chia
  cho người không uống).
- S10: mỗi người nợ có thể phải chuyển cho 2 người → mỗi người nhận một thẻ riêng có QR, số tiền, tên
  ngân hàng, tên chủ tài khoản, nút copy số tài khoản, nút "Tôi đã chuyển".
- S11: nút copy tin nhắc soạn sẵn, ví dụ: "Khoa ơi, kèo Vũng Tàu còn 870.000 ₫ gửi Hùng nha.
  Mở link để quét QR: [link kèo]". App KHÔNG tự gửi tin.
Dùng dữ liệu giả tiếng Việt ngắn gọn. Ghi số màn hình (S1..) trên mỗi frame.
```

---

## Prompt (3) — 3 hướng giao diện + Design tokens

```text
Chọn 2 màn hình quan trọng nhất: S3 "Tab Kèo – đang vote" và S10 "Tab Trả tiền – mình nợ" (có QR),
đều có thanh tab Kèo / Chi tiêu / Trả tiền ở dưới.
(Nếu số màn hình đã đổi ở bước trước, dùng màn hình tương ứng.)

Vẽ 3 hướng giao diện khác hẳn nhau cho 2 màn hình đó, ở trạng thái Bình thường, khung 390px:
- Hướng A: ấm áp, vui vẻ, kiểu rủ bạn đi chơi.
- Hướng B: gọn, rõ ràng, tin cậy như app ngân hàng (minh bạch tiền bạc).
- Hướng C: tự chọn một hướng thứ ba mà bạn cho là hợp nhất với người dùng Việt dùng trong Zalo.
Mỗi hướng ghi 2–3 câu: vì sao hợp, rủi ro (ví dụ khó đọc với người lớn tuổi).

Yêu cầu chung cho cả 3 hướng: tương phản chữ đạt WCAG AA; chữ thân ≥ 17px (cho người lớn tuổi);
MỘT màu nhấn duy nhất; số tiền dùng chữ số đều độ rộng (tabular), dạng "1.930.000 ₫"; số tiền là
thứ nổi bật nhất trên S10; QR đủ lớn để quét từ điện thoại khác; avatar chữ cái có màu riêng cho mỗi
người (màu nhạt, không tranh với màu nhấn); giọng văn thân thiện kiểu bạn bè.
Màu không là cách duy nhất phân biệt "đã trả/chưa trả" (kèm chữ hoặc biểu tượng).

Với MỖI hướng, thêm một frame "Design tokens":
- Màu: primary, on-primary, surface, surface-muted, text, text-muted, border, success, warning, danger
  (ghi mã hex).
- Chữ: font (hỗ trợ tốt tiếng Việt có dấu), cỡ/độ đậm/line-height cho display, title, body, caption,
  money (số tiền).
- Khoảng cách (thang 4px), bo góc, bóng.
Và một frame "Components" liệt kê tên component kèm ví dụ: Button (primary/secondary/ghost),
MoneyText, MemberAvatar, VoteOption, StatusBadge, ExpenseRow, DebtCard (có QR), ProgressBar,
EmptyState, Skeleton, ErrorBanner, BottomSheet, Toast.
```

---

## Prompt (4) — Prototype bấm được, dữ liệu giả tiếng Việt

```text
Dùng hướng giao diện đã chọn: [ĐIỀN HƯỚNG A/B/C + điều chỉnh nếu có].
Làm prototype bấm được cho toàn bộ flow S1..Sn ở 390px, nối đủ các luồng:
(a) Hùng tạo kèo → chia sẻ link; (b) Tuấn mở link → vote 1–2 chạm → chọn tên;
(c) Hùng chốt kèo → thẻ tóm tắt ghim đầu; (d) ghi 3 khoản chi; (e) Mai xem bảng chi tiêu;
(f) Khoa xem mình nợ ai → mở QR → "Tôi đã chuyển"; (g) Hùng xem "Ai chưa trả" → copy tin nhắc.
Có thể chuyển giữa các vai bằng một nút nhỏ "Đổi vai (demo)" ở góc.

DỮ LIỆU GIẢ (giữ đúng số, đã kiểm tra cộng trừ):
- Kèo: "Vũng Tàu 2N1Đ", nhóm 7 người: Hùng (người tạo), Linh, Tuấn, Mai, Thảo, Nam, Khoa.
- Ngày đề xuất: T7–CN 14–15/11, 21–22/11, 28–29/11. Vote: 21–22/11 được 6 phiếu → chốt.
- Địa điểm đề xuất: "Homestay Biển Xanh – 2.800.000 ₫/đêm", "Villa Bãi Sau – 3.500.000 ₫/đêm".
  Chốt Homestay Biển Xanh.
- Khoản chi:
  1. Homestay 2.800.000 ₫ — Hùng trả — chia 7 → 400.000 ₫/người.
  2. Hải sản tối 2.450.000 ₫ — Linh trả — chia 7 → 350.000 ₫/người.
  3. Bia 600.000 ₫ — Tuấn trả — chia 5 (Mai, Thảo không uống) → 120.000 ₫/người.
- Số dư: Hùng +1.930.000 ₫ · Linh +1.580.000 ₫ · Tuấn −270.000 ₫ · Mai −750.000 ₫ ·
  Thảo −750.000 ₫ · Nam −870.000 ₫ · Khoa −870.000 ₫ (tổng = 0).
- Chuyển khoản đề xuất (6 lần, minh họa ca một người chuyển cho 2 người):
  Nam → Hùng 870.000 ₫ · Khoa → Hùng 870.000 ₫ · Tuấn → Hùng 190.000 ₫ · Tuấn → Linh 80.000 ₫ ·
  Mai → Linh 750.000 ₫ · Thảo → Linh 750.000 ₫.
- Tài khoản nhận (GIẢ): Hùng – MB Bank – 0000 1111 2222 – NGUYEN VAN HUNG;
  Linh – Vietcombank – 9999 8888 7777 – TRAN THI LINH. QR là hình giả lập, ghi rõ "QR minh họa".
- Tiến độ: Nam và Mai đã đánh dấu "đã chuyển" → cả nhóm thấy "2/6 lần chuyển · 1.620.000 /
  3.510.000 ₫".

Thêm 1 màn hình demo ca sửa sai (tách khỏi dữ liệu trên):
- Trước khi sửa: Tuấn lỡ chia khoản bia cho 6 người (quên bỏ Mai) → 100.000 ₫/người; Mai nợ
  850.000 ₫ và đã chuyển đủ 850.000 ₫ cho Linh, đã đánh dấu "đã chuyển".
- Tuấn sửa thành chia 5 → 120.000 ₫/người. Mai chỉ còn nợ 750.000 ₫, tức đã chuyển dư 100.000 ₫;
  Hùng, Linh, Tuấn, Nam, Khoa mỗi người gánh thêm 20.000 ₫ (Thảo không đổi).
Hãy hiện rõ: khoản nào vừa sửa, ai sửa, số dư ai thay đổi bao nhiêu, Mai được hoàn 100.000 ₫.
(Cách hoàn tiền chính thức chưa chốt; hãy đề xuất cách hiển thị dễ hiểu nhất.)
```

---

## Checklist rà wireframe (Claude Code dùng ở cuối Bước 3)
- [ ] Việc chính (vote; xem nợ + mở QR) ≤ 3 chạm từ lúc mở link.
- [ ] Mỗi màn hình đúng 1 nút chính.
- [ ] Mỗi màn hình có trạng thái trống, đang tải (skeleton), lỗi.
- [ ] Tiền luôn có ₫ và dấu chấm nghìn.
- [ ] Không có bước đăng ký/OTP; mở link là thấy kèo trước khi bị hỏi tên.
- [ ] Chữ ≥ 16px, vùng chạm ≥ 44px, ổn ở 360px.
- [ ] Không có tính năng ngoài phạm vi v1 (chat, thông báo, đặt phòng, đăng nhập...).
