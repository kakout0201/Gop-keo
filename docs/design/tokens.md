# Design tokens — Góp Kèo v1

Nguồn: hướng A + chi tiết B, C ([decisions.md](decisions.md)). Áp dụng trong prototype
(canvas, trang "Bước 5 · Prototype"). Đây là nguồn chuẩn khi code Tailwind ở Bước 9–10.

## Màu (một màu nhấn duy nhất: primary)
| Token | Hex | Dùng cho | Tương phản đã tính |
|---|---|---|---|
| `primary` | #C2410C | nút chính, ô tích đã chọn, thanh tiến độ, ngày đã chọn trên lịch | chữ trắng 5.18:1 |
| `on-primary` | #FFFFFF | chữ trên nút chính | — |
| `primary-soft` | #FDE7D8 | nền ô **mình** đã chọn (duy nhất), nền icon | — |
| `primary-line` | #F2B99A | viền ô mình đã chọn, viền thẻ ghim | — |
| `primary-text` | #A8380A | "★ Đang dẫn", tab đang mở, link | 6.49:1 trên trắng, 5.44:1 trên primary-soft |
| `background` | #FFF7EE | nền màn hình | — |
| `surface` | #FFFFFF | thẻ, ô lựa chọn, thanh tab | — |
| `surface-muted` | #FBEADB | nhãn trạng thái ("Chưa chuyển"), skeleton, nền thanh tiến độ | — |
| `text` | #2A1D14 | chữ chính | — |
| `text-muted` | #6B5546 | chữ phụ | 6.57:1 trên background, 5.84:1 trên primary-soft |
| `text-muted-strong` | #5A4536 | chữ trong nhãn trạng thái | 7.65:1 trên surface-muted |
| `border` | #EBD9C8 | viền thẻ | — |
| `border-strong` | #C9AE97 | ô tích chưa chọn, nút phụ, ô nhập | — |
| `danger` / `danger-soft` | #B42318 / #FBE7E4 | banner lỗi | — |
| `notify-dot` | #D92D20 | chấm đỏ trên tab **khác** tab đang mở ("cần làm"). Không hiện trên tab đang mở (E3). | — |
| `scrim` | rgba(42,29,20,0.45) | nền tối sau bottom sheet | — |

Avatar (nền / chữ), theo thứ tự vào kèo:
Hùng #FFE2C2/#7A3A00 · Linh #FAD4E4/#7D1D4A · Tuấn #D3E5FF/#123E7C · Mai #DDF2D3/#235A14 ·
Thảo #E8DAFF/#4A2382 · Nam #FFF0B3/#6A5200 · Khoa #CFF0EC/#0E5650.
Chữ trên avatar: 1 ký tự, hoặc 2 ký tự nếu trùng chữ đầu ("Th"). Quá 7 người: chưa quyết (Bước 7).

## Chữ: Nunito (Google Fonts, 400/600/700/800)
| Vai trò | Cỡ / dòng | Độ đậm |
|---|---|---|
| display | 28 / 34 | 800 |
| title (tiêu đề màn) | 22 / 28 | 800 |
| heading (mục) | 19 / 26 | 800 |
| body | 17 / 25 | 400 |
| caption, nhãn | 15 / 20 | 400–800 |
| money lớn | 34 / 40 | 800 |
| tab label | 15 / 20 | 700 (đang mở 800) |

- Chữ số Nunito vốn đã đều độ rộng (đo: 10 số "1" = 10 số "0" = 240px ở 40px). Vẫn đặt
  `font-variant-numeric: tabular-nums` cho mọi số tiền.
- Số tiền: số nguyên VND, dấu chấm nghìn, " ₫" ở sau; **không bao giờ xuống dòng** giữa số và ₫.

## Kích thước, khoảng cách, bo góc
- Thang khoảng cách 4px: 4 · 8 · 12 · 16 · 24 · 32. Lề màn hình 16.
- Nút chính: cao 56, bo tròn hết (999). Nút phụ: cao 48, viền 1.5px `border-strong`.
- Vùng chạm tối thiểu 44×44.
- Ô nhập: cao 48–52, bo 14. Ô số tiền: cao 64, chữ 30/800.
- Thẻ: bo 18–20, viền 1px `border`. Thẻ ghim (kèo đã chốt): viền 2px `primary-line`.
- Ô tích: 24×24, bo 8. Bottom sheet: bo trên 24.
- Thanh tab: cao 68, 3 tab Kèo / Chi tiêu / Trả tiền.
- QR ở S10: 196px trong prototype (mục tiêu ~232px; thu nhỏ để vừa nút "Lưu ảnh QR", 3 bước và bảng
  5 dòng trong 390×844). Khi code, nội dung S10 cuộn được nên có thể dùng lại ~232px.
- Segmented control (S11): nền `surface-muted`, ô đang chọn nền `surface` chữ `primary-text`, cao 44.
- Bóng: chỉ toast (0 6px 18px rgba(42,29,20,0.25)) và thẻ ghim (nhẹ).

## Component (tên dùng khi code)
Button (primary / secondary / ghost) · MoneyText · MemberAvatar · VoteOption (thường / của mình / đang dẫn)
· LeadingLabel ("★ Đang dẫn", dòng riêng) · StatusBadge (nền nhạt, không viền) · ExpenseRow · BalanceList
· DebtCard (QR + Lưu ảnh QR + 3 bước + bảng Người nhận/Số TK/Số tiền/Nội dung có nút copy)
· ProgressBar · PinnedSummary · EmptyState · Skeleton · ErrorBanner · Toast · BottomSheet (Bạn là ai?)
· TabBar (có notify-dot) · Calendar (chọn nhiều ngày) · MessagePreview (sửa được trước khi copy;
chế độ Gửi cả nhóm / Nhắn riêng từng người) · SegmentedControl.

## Giọng văn
- Màn tiền S7–S11: rõ ràng, lịch sự, không "nè/nha".
- Màn khác: thân thiện kiểu bạn bè.
