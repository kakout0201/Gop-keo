# PLAYBOOK — Góp Kèo từ ý tưởng đến người dùng thật

Nhãn của mỗi việc:
- AUTO: Claude Code tự làm.
- ASK: Claude Code hỏi chủ dự án (gom câu hỏi, kèm đề xuất), rồi làm tiếp.
- USER: chủ dự án tự làm ở công cụ khác (Claude Design, Vercel, Supabase, điện thoại).
  Claude Code chuẩn bị sẵn hướng dẫn/prompt và dừng chờ.
- GATE: dừng hẳn. Tóm tắt cái cần duyệt + checklist. Chỉ đi tiếp khi chủ dự án nói "duyệt".

---

## Bước 1 — Môi trường (ĐÃ XONG)
Git, Node 22, VS Code, app Claude (tab Code), tài khoản GitHub/Vercel/Supabase.

## Bước 2 — Problem brief → docs/00-brief.md
- ASK: phỏng vấn TỪNG câu một, tối đa 7 câu, về cách nhóm hiện lên kèo và chia tiền,
  chỗ phiền nhất, ai khó tính nhất, điều gì khiến họ bỏ app. Chưa bàn công nghệ.
- AUTO: viết brief ≤ 1 trang: vấn đề (ví dụ thật), 2 persona, giải pháp 1 câu,
  đúng 3 việc bắt buộc, ≥ 4 non-goals, chỉ số thành công đo được, rủi ro + giả định.
- GATE: chủ dự án duyệt brief. Sau khi duyệt → AUTO commit "docs: add problem brief".

## Bước 3 — Chuẩn bị Claude Design
- AUTO: từ brief, viết docs/design/prompts.md gồm 4 prompt dán vào Claude Design:
  (1) user flow + danh sách màn hình S1..Sn, (2) wireframe mobile 390px với 4 trạng thái
  (bình thường/trống/loading/lỗi), (3) 3 hướng giao diện cho 2 màn hình quan trọng nhất
  + frame Design tokens + tên component, (4) prototype bấm được với dữ liệu giả tiếng Việt.
- USER: chủ dự án chạy prompt (1) và (2) trong Claude Design, chụp/export kết quả
  vào docs/design/flow/ và docs/design/wireframe/.
- AUTO: rà wireframe theo checklist (3 chạm cho việc chính, 1 nút chính/màn hình,
  có trạng thái trống, tiền có ₫ và dấu chấm nghìn). Ghi góp ý vào docs/design/review.md.

## Bước 4 — Giao diện
- USER: chạy prompt (3), xem 3 hướng.
- ASK: chủ dự án chọn hướng. AUTO: ghi lý do vào docs/design/decisions.md.

## Bước 5 — Prototype + test người thật
- USER: chạy prompt (4); gửi prototype cho 2–3 người, quan sát, ghi chỗ họ khựng lại.
- AUTO: tổng hợp phản hồi thành danh sách sửa; USER sửa trong Claude Design.

## Bước 6 — Handoff
- USER: export handoff bundle sang Claude Code; export PNG các frame (SELECTED)
  vào docs/design/screens/ và tokens vào docs/design/tokens.md.
- AUTO: kiểm tra đủ file, commit "docs: add design".
- GATE: thiết kế được chốt.

## Bước 7 — Đặc tả
- AUTO (plan mode, chưa code): docs/01-prd.md, 02-architecture.md, 03-schema.sql
  (bảng, index, RLS), 04-contracts.md (server action + Zod), 05-test-plan.md,
  06-acceptance.md (Given/When/Then). Tiền là số nguyên VND.
- ASK: gom mọi điểm mơ hồ thành một lần hỏi.
- GATE: chủ dự án đọc và duyệt từng file.

## Bước 8 — Kế hoạch slice
- AUTO: docs/plans/slice-00.md .. slice-06.md, mỗi file có: mục tiêu, story,
  file được sửa, file cấm sửa, phụ thuộc, lệnh kiểm tra, tiêu chí xong.
  Slice 00 = walking skeleton + deploy. Đánh dấu slice nào chạy song song được.
- GATE: duyệt kế hoạch.

## Bước 9 — Thiết lập repo
- ASK: chạy Supabase local bằng Docker (cần WSL2) hay dùng project Supabase dev trên cloud?
- AUTO: khởi tạo Next.js vào thư mục hiện tại, cài thư viện, scripts lint/typecheck/test/check,
  mở rộng CLAUDE.md (luật kỹ thuật), .claude/agents/ (reviewer, test-writer, security-auditor),
  .claude/commands/ (slice, verify, ship), cập nhật .claude/settings.json.
- USER: tạo repo trống trên GitHub, đưa URL. ASK: xin phép push lần đầu.

## Bước 10 — Slice 00 (walking skeleton)
- USER: tạo Supabase project dev; import repo vào Vercel; nhập biến môi trường
  trên Vercel và vào .env.local (Claude không đọc file này).
- AUTO: làm slice 00 theo /slice 00.
- GATE: trang chủ và /api/health chạy trên link Vercel.

## Bước 11–16 — Slice 01 đến 06
Mỗi slice: AUTO /slice XX (branch, test trước, code, check xanh, subagent review, sửa)
→ GATE: chủ dự án test tay trên điện thoại (npm run dev -- -H 0.0.0.0)
→ ASK: xin phép /ship (push + PR) → USER: xem bản preview Vercel, merge
→ AUTO: cập nhật mục Bài học trong CLAUDE.md.
Slice 03 và 04 chạy song song được (git worktree hoặc 2 session).

## Bước 17 — QA tự động
- AUTO: e2e ở 360px/390px, so ảnh với thiết kế, thử ca biên, chạy security-auditor.
  Ghi docs/qa/report.md.

## Bước 18 — Bug bash + nghiệm thu
- USER: 3 điện thoại thật, mở link trong Zalo; mời 3–5 bạn dùng preview 2 ngày.
- AUTO: lỗi P0–P1 → viết test tái hiện trước rồi sửa.
- GATE: mọi story Must đạt, không còn P0–P1, checklist bảo mật + mobile đã tick.

## Bước 19 — Deploy production
- AUTO: soạn checklist deploy cụ thể + release notes v1.0.0.
- USER: tạo Supabase prod (Singapore), `supabase db push`, bật auth ẩn danh,
  env Production trên Vercel, domain.
- AUTO: smoke test @smoke vào URL production, đọc kết quả.
- GATE: smoke xanh, log sạch 10 phút.

## Bước 20 — Ra mắt
- AUTO: soạn tin nhắn giới thiệu cho nhóm Zalo + mẫu báo lỗi.
- USER: gửi, dùng cho một buổi đi chơi thật.
- AUTO (sau 1–2 tuần): gom phản hồi thành backlog v1.1.
