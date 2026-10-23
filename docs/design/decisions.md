# Quyết định giao diện — Bước 4

Ngày: 2026-10-23. Người quyết: chủ dự án. Người ghi: Claude Code.
Canvas: https://claude.ai/artifact/QR7zdZL7Ft1VnydubApjXu (trang "Bước 4 · 3 hướng" và "Bước 5 · Prototype").

## Chọn: Hướng A "Rủ rê" làm nền, kết hợp một số chi tiết từ B và C

**Lý do chọn A làm nền:** kèo đi chơi là chuyện vui giữa bạn bè, nên giao diện ấm và lời lẽ
gần gũi giúp mọi người chịu mở link và vote, nhất là kiểu người như Tuấn (lười đọc). A cũng
đáp ứng sẵn các ràng buộc: chữ thân 17px, một màu nhấn (cam đất), avatar màu riêng.

**Lấy từ B (sổ minh bạch), vì phần tiền cần rõ ràng và đáng tin (Mai):**
- Bố cục S10 dạng bảng: Ngân hàng / Số TK / Chủ TK, nút copy nằm ngay cạnh số TK.
- Nút chính ghi rõ số tiền: "Mình đã chuyển 190.000 ₫ cho Hùng".
- S3 có dòng "Bạn đang vote với tên … · đổi", để ai mượn máy cũng biết mình đang vote dưới tên ai.

**Lấy từ C (to, rõ), vì người lớn tuổi (mẹ 54 tuổi, Android cũ):**
- Nhãn "★ Đang dẫn" nằm riêng một dòng, không tô nền cho phương án đang dẫn.
  Nền màu chỉ dành cho ô **mình** đã chọn, để hai ý "mình chọn" và "đang dẫn" không lẫn vào nhau.
- 3 bước đánh số dưới QR ở S10.
- Nút chính cao 56px; QR khoảng 232px.

**Không lấy:** B có giao diện khô như app ngân hàng; C phải cuộn nhiều và chữ to quá với người trẻ.

## Quy tắc giọng văn
- Màn liên quan tiền (S7, S8, S9, S10, S11): viết rõ ràng, lịch sự, **không** dùng "nè/nha".
  Ví dụ: "Quét mã bằng app ngân hàng. Số tiền đã được điền sẵn."
- Các màn khác (S1–S6): giữ giọng bạn bè của A. Ví dụ: "Bạn đi được hôm nào nè?", "Ở đâu đây?"
- Câu nút luôn nói rõ hành động và kết quả ("Chốt kèo", "Mình đã chuyển 870.000 ₫ cho Hùng").

## Kiểm tra đã làm
| Kiểm tra | Kết quả |
|---|---|
| Nunito có chữ số đều độ rộng? | **Có.** Đo trong Chrome: chuỗi "1111111111" và "0000000000" ở Nunito 800, 40px đều rộng 240px, kể cả khi không bật `tabular-nums`. Vẫn giữ `font-variant-numeric: tabular-nums` trong CSS cho chắc. **Không cần** dùng Inter cho số tiền. |
| "★ Đang dẫn" #A8380A trên nền trắng | 6.49:1 ✅ AA |
| "★ Đang dẫn" #A8380A trên ô mình chọn #FDE7D8 | 5.44:1 ✅ AA |
| "Chưa chuyển" #5A4536 trên #FBEADB | 7.65:1 ✅ AA |
| Chữ cam đậm #A8380A trên #FBEADB (nếu dùng) | 5.53:1 ✅ AA |
| Chữ phụ #6B5546 trên ô mình chọn #FDE7D8 | 5.84:1 ✅ AA |
| Chữ trắng trên nút #C2410C | 5.18:1 ✅ AA |

(Tỷ lệ tính theo công thức WCAG 2.1 bằng node; chưa đo trên màn hình thật.)

## Design tokens chốt (bản nháp cho docs/design/tokens.md ở Bước 6)
| Token | Giá trị | Dùng cho |
|---|---|---|
| primary | #C2410C | nút chính, ô tích đã chọn, thanh tiến độ |
| on-primary | #FFFFFF | chữ trên nút chính |
| primary-soft | #FDE7D8 | nền ô **mình** đã chọn (duy nhất) |
| primary-line | #F2B99A | viền ô mình đã chọn |
| primary-text | #A8380A | chữ cam: "★ Đang dẫn", tab đang mở, link |
| background | #FFF7EE | nền màn hình |
| surface | #FFFFFF | thẻ, ô lựa chọn, thanh tab |
| surface-muted | #FBEADB | nhãn trạng thái ("Chưa chuyển"), skeleton |
| text | #2A1D14 | chữ chính |
| text-muted | #6B5546 | chữ phụ |
| text-muted-strong | #5A4536 | chữ trong nhãn trạng thái |
| border | #EBD9C8 | viền thẻ |
| border-strong | #C9AE97 | ô tích chưa chọn, nút phụ |
| danger | #B42318 / nền #FBE7E4 | banner lỗi |
| notify-dot | #D92D20 | chấm đỏ trên tab (ngữ nghĩa "cần làm", không phải màu nhấn) |

- Chữ: Nunito. display 28/34·800, title 22/28·800, heading 19/26·800, body 17/25·400,
  caption 15/20, money 34/40·800 (`tabular-nums`).
- Kích thước: nút chính cao 56 (bo tròn hết), nút phụ cao 48, thẻ bo 18, ô tích 24 bo 8,
  thanh tab cao 68, QR 232, lề màn hình 16, thang khoảng cách 4px.
- Avatar (nền nhạt / chữ đậm): Hùng #FFE2C2/#7A3A00 · Linh #FAD4E4/#7D1D4A · Tuấn #D3E5FF/#123E7C ·
  Mai #DDF2D3/#235A14 · Thảo #E8DAFF/#4A2382 · Nam #FFF0B3/#6A5200 · Khoa #CFF0EC/#0E5650.
  Khi nhóm có hơn 7 người, màu lặp lại theo thứ tự vào kèo (chưa thiết kế, ghi lại để Bước 7 quyết).
