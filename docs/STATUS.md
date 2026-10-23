# STATUS — Góp Kèo

Bước hiện tại: **Bước 7 — Đặc tả** (chưa bắt đầu; làm ở session mới)
Trạng thái: Bước 6 đã DUYỆT (2026-10-24). Session tiếp theo: đọc file này, docs/00-brief.md,
docs/design/screens/README.md, docs/design/tokens.md, docs/design/decisions.md rồi làm Bước 7 theo PLAYBOOK
(plan mode, chưa code).

## Đã xong
- Bước 1: môi trường (Git, Node 22, VS Code, tài khoản GitHub/Vercel/Supabase). Repo nhánh `main`.
- Bước 2: brief đã duyệt (docs/00-brief.md), commit 7895044. Phỏng vấn là kịch bản mẫu.
- Bước 3: flow + wireframe S1–S11 (2 vòng sửa), docs/design/review.md. GATE đã duyệt.
- Bước 4: chọn A + chi tiết B, C, xem docs/design/decisions.md.
- Bước 5: prototype 21 màn trên canvas https://claude.ai/artifact/QR7zdZL7Ft1VnydubApjXu
  (trang "Bước 5 · Prototype"). **Không có test người thật**. Thay bằng đánh giá chuyên gia
  docs/design/expert-review-b5.md (chủ dự án cung cấp). Đã sửa trên canvas (2026-10-23):
  - E1 (P0) S10: nút "Lưu ảnh QR", 3 bước "lưu ảnh → app ngân hàng → Quét mã → chọn ảnh", gợi ý
    "chạm giữ để lưu" và "máy thứ hai quét thẳng"; bảng Người nhận / Số TK / Số tiền / Nội dung,
    có nút copy cho số TK, số tiền, nội dung. QR thu còn 208px cho vừa khung.
  - E2: S3 sau khi vote hiện "bạn đã vote" trên đầu + toast "Đã lưu vote của Tuấn!"; trước khi vote
    hiện "bạn chưa vote".
  - E3: bỏ chấm đỏ trên tab đang mở (prototype P03, P13; wireframe S3 trống, S10).
  - E4: màn mới P20 "Xem trước tin nhắc" (chọn người, kiểu câu, sửa nội dung) trước khi copy; sau copy
    nhắc "Đã copy. Mở Zalo và dán vào nhóm."
  - E5: S11 tiêu đề phụ "Bạn được nhận 1.930.000 ₫" không còn xuống dòng.
  - E6: S8 (Mai) "Phải trả trước đây / Phải trả bây giờ" thành 2 ô cạnh nhau.
  - E8 ghi chú trên canvas: "Đổi vai" và màn Demo chỉ là công cụ demo.
- Bước 6 (AUTO): docs/design/screens/ (20 PNG + README tra cứu mã S), docs/design/tokens.md,
  mã nguồn docs/design/canvas-source/, PNG flow/wireframe/directions/prototype. Đã kiểm đủ file,
  không có .env. Commit "docs: add design".
- GATE Bước 6 duyệt (2026-10-24) kèm 3 chỉnh nhỏ, đã làm, không GATE lại:
  - S10 (P13): dòng phụ "Vũng Tàu 2N1Đ · lần 1/1"; "Có máy thứ hai thì quét thẳng mã này" thành ghi chú
    nhỏ dưới bước 3; tách "Người nhận" thành 2 dòng Ngân hàng, Chủ TK. QR còn 196px để vừa khung.
  - S11: P20 có lựa chọn "Gửi cả nhóm" / "Nhắn riêng từng người"; màn mới P21 nhắn riêng: mỗi người
    1 tin chỉ có phần của họ, nút copy riêng.
  - screens/README.md ghi rõ prototype là bản chuẩn, wireframe chỉ tham khảo trạng thái trống/tải/lỗi.
  - Đã export lại PNG, amend vào commit "docs: add design".
- .claude/commands/next.md: thêm bước 8 "Quản lý context". PLAYBOOK Bước 18, 20: thêm kiểm chứng
  8 giả định với người dùng thật.

## Đang chờ chủ dự án
- Chủ dự án mở **session mới** và gõ `/next` để bắt đầu Bước 7.
- Bước 7 cần làm (theo PLAYBOOK): plan mode, viết docs/01-prd.md, 02-architecture.md, 03-schema.sql
  (bảng, index, RLS), 04-contracts.md (server action + Zod), 05-test-plan.md, 06-acceptance.md
  (Given/When/Then); tiền là số nguyên VND. Sau đó ASK gom mọi điểm mơ hồ (bắt đầu từ mục
  "Điểm mở cho Bước 7" bên dưới, mỗi điểm kèm phương án đề xuất), rồi GATE duyệt từng file.
- Màn hình nguồn cho spec: docs/design/screens/ (P01–P21; P00 Demo và nút "Đổi vai" không thuộc sản phẩm).

## 8 giả định của brief: tất cả CHƯA KIỂM CHỨNG
Đánh giá chuyên gia không thay được người thật. Kế hoạch: kiểm ở **Bước 18** (kịch bản bug bash,
người thật, điện thoại thật, trong Zalo) và **Bước 20** (phiếu hỏi sau chuyến đi thật).
| # | Giả định | Ghi chú từ đánh giá chuyên gia |
|---|---|---|
| 1 | Nỗi đau thật là đòi tiền và tính lại khi sai | — |
| 2 | Chịu bấm link lạ thay vì bình chọn Zalo | phụ thuộc uy tín người tạo kèo |
| 3 | Người lười vote được trong 1–2 chạm | đã thêm phản hồi "đã vote" (E2) |
| 4 | Người lớn tuổi tự trả được bằng QR | **rủi ro cao**: kiểm lưu ảnh QR trong trình duyệt Zalo (E1) |
| 5 | Người ứng tiền chịu nhập số TK | có thể ngần ngại (E9) |
| 6 | Tin nhắc soạn sẵn làm đỡ ngại | đã thêm xem trước + sửa (E4) |
| 7 | Tin bảng chi tiêu, chấp nhận tự đánh dấu | màn sửa sai minh bạch |
| 8 | Gộp nợ được ưa hơn chuyển riêng | chưa đánh giá được |

## Chưa kiểm chứng / ghi chú
- Prototype chưa thử trên điện thoại thật, trình duyệt Zalo, 360px.
- Lưu ảnh QR từ trình duyệt trong Zalo có thể bị chặn → cần phương án "chạm giữ ảnh để lưu" và
  kiểm ở Bước 18.
- PNG render bằng Chrome headless ngoài runtime canvas.
- QR ở S10 là 196px trong prototype (mục tiêu ~232px) để vừa nút, 3 bước và bảng 5 dòng; khi code cho
  cuộn được thì dùng lại ~232px. Chưa kiểm khả năng quét thật.
- Nhắn riêng từng người (P21): nội dung tin mỗi người, kiểu câu "Ngắn gọn" chưa viết mẫu.
- Wireframe S10/S11 chưa cập nhật E1/E4. Prototype (docs/design/screens/) là bản chuẩn cho hình thức;
  wireframe dùng cho các trạng thái trống/tải/lỗi.
- Hướng B/C trên trang "3 hướng" vẫn có chấm đỏ trên tab đang mở (chỉ là bản khám phá, không sửa).

## Quyết định đã chốt
- Tab Code trong app Claude + VS Code. Stack: Next.js + TS + Tailwind, Supabase, Vercel.
- Brief v1: không gửi tin nhắn/thông báo; "đòi hộ" = trang "ai chưa trả" + xem trước và copy tin nhắc.
- /design = loại Artifact "Design" (canvas) trong Claude Code; chạy prompt là AUTO.
- Cấu trúc: trang kèo có tab Kèo / Chi tiêu / Trả tiền; chấm đỏ chỉ ở tab khác tab đang mở.
- Giao diện A + B + C (decisions.md); tokens chuẩn ở docs/design/tokens.md; font Nunito cho mọi chữ.
- Giọng: màn tiền S7–S11 rõ ràng, lịch sự, không "nè/nha"; màn khác giọng bạn bè.
- S10: lưu ảnh QR là cách mặc định; quét bằng máy khác là phụ; copy số TK, số tiền, nội dung.
- Bước 5 thay test người thật bằng đánh giá chuyên gia; kiểm chứng thật dời sang Bước 18, 20.
- Dữ liệu mẫu: cuối tuần 14–15, 21–22, 28–29/11/2026.

## Điểm mở cho Bước 7 (đặc tả)
- Quy tắc làm tròn khi chia số lẻ. **E7:** phải thay dòng giữ chỗ ở S7 bằng câu thật trước Bước 10.
- Gộp nợ hay chuyển riêng cho từng người ứng tiền.
- G4 · Bảo vệ link: ai có link được sửa gì; số TK hiện cho ai. **E9:** dòng "Ai mở link… đều thấy số
  tài khoản" ở S9 sẽ làm người ứng tiền ngần ngại; chốt cùng G4.
- G3 · Trùng tên ở "Bạn là ai?": rủi ro mạo danh.
- Sửa khoản chi sau khi đã có người trả: tính lại thế nào. **E10:** ai hoàn cho ai ("Linh sẽ chuyển
  lại cho bạn" chỉ là đề xuất).
- Người tạo có được mở lại vote sau khi chốt không.
- Chỉ số "≥ 5/6 người nợ trả trong 48 giờ" → đổi sang tỷ lệ.
- Chấm đỏ tab Trả tiền cho người được nợ chưa nhập tài khoản.
- Màu avatar khi nhóm hơn 7 người.
- Nội dung chuyển khoản VietQR (prototype dùng "GOPKEO VT KHOA") và giới hạn ký tự.
- Mẫu tin nhắc: 2 chế độ (cả nhóm / nhắn riêng) × 2 kiểu câu (nhẹ nhàng / ngắn gọn); giọng màn tiền
  lịch sự, không "nè/nha".
- Tìm hiểu deeplink mở thẳng app ngân hàng (VietQR/ngân hàng có hỗ trợ không), chưa kiểm chứng.

## Ghi chú cho Bước 10 (code)
- **E7:** thay "[quy tắc làm tròn — chốt ở Bước 7]" ở S7 bằng câu thật.
- **E8:** nút "Đổi vai" và màn Demo chỉ có trong prototype; không code, không đưa vào spec.
- E1: "Lưu ảnh QR" phải chạy được trong trình duyệt Zalo; nếu không lưu được thì có phương án
  chạm giữ ảnh. Nút copy số tiền nên copy dạng số trơn (870000) cho app ngân hàng.
