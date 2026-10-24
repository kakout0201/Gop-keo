# STATUS — Góp Kèo

Bước hiện tại: **Bước 10 — Slice 00**, code xong ở máy trên branch `slice/00-skeleton` (chưa push).
Đang chờ chủ dự án: (1) tự chạy `supabase link` + `db push` lên DB dev; (2) cho phép push branch + tạo PR; (3) quyết 2 điểm lệch kế hoạch.

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
- Bước 7 (2026-10-24): viết 6 file đặc tả; ASK Q1–Q14 → chủ dự án **đồng ý tất cả đề xuất** và thêm 5 điểm:
  1. Chống chiếm TK nhận tiền (PRD R12, US-23; kiến trúc D9): máy gắn vào tên có sẵn đợi 24 giờ mới lưu/xóa TK
     (mình mở rộng từ "chỉ khi xác nhận máy mới" sang "mọi lần gắn vào tên có sẵn" để chặn ca bấm "đổi" rồi
     máy lạ chọn tên — ghi lý do trong PRD R12); TK đổi trong 48 giờ → cảnh báo ở S10; lưu/xóa TK hiện trong hoạt động.
  2. Giới hạn theo IP (kiến trúc D8): `x-real-ip` → đầu `x-forwarded-for` → "local"; IPv6 /64; HMAC-SHA256 với
     biến mới `IP_HASH_SECRET`; createTrip 10/giờ + 50/24h, joinAsNewMember 30/giờ; bảng `rate_limit_hits`, xóa sau 7 ngày.
  3. "Chưa nhận được" (US-21): action `disputePayment`, `payments.void_reason='disputed'`, event `payment_disputed`.
  4. Giải thích gộp nợ ở S10 (US-22): dòng "App đã gộp các khoản… · Xem chi tiết", `me.breakdown` trong TripView.
     Prototype P11 trên canvas đã sửa: Mai được **Hùng** hoàn lại (canvas version 60); PNG ở screens/ và
     prototype/ xuất lại, mã nguồn canvas-source/proto/P11 cập nhật.
  5. Test plan §3b: ma trận gọi thật mọi action × {ngoài kèo, thành viên không đủ quyền, đủ quyền}; I-16..I-22.
- GATE Bước 7 duyệt (2026-10-24) kèm 4 sửa từ rà độc lập bên ngoài (thay cho subagent bị dừng), đã làm, không GATE lại:
  1. Câu NEW_DEVICE_COOLDOWN: "Máy mới cần đợi 24 giờ mới được đổi tài khoản nhận tiền. Bạn dùng máy cũ, hoặc quay
     lại sau {giờ}." (bỏ "nhờ người tạo kèo" vì người tạo không có quyền).
  2. `payout_accounts.saved_by_device_id` + `saved_from_claimed_device`; cảnh báo S10 (`recentWarning`) khi TK đổi
     < 48h **hoặc** được lưu < 48h từ máy `claimed` (kể cả lần nhập đầu). Test I-23, AC-23.6.
  3. Chống khoản chi giả: `nameKey` chỉ giữ a–z 0–9 (bỏ dấu câu, ký hiệu, emoji, khoảng trắng); banner R10 báo cả
     khoản **mới** do người khác ghi (`unseenChanges`); nhãn "mới" cho thành viên < 48h (trừ người tạo). Bảng mối
     đe dọa có thêm 2 dòng. Test I-24, I-25, AC-04.7, AC-04.9, AC-11.7.
  4. Giới hạn IP khi tạo thiết bị trong `ensureDevice()` (bucket `create_device:ip`, 30/giờ, 100/24h). Test I-26.
  Schema chạy lại trên PGlite: 27 kiểm đúng như mong đợi, 15 bảng, tất cả bật RLS.
- GATE Bước 8 duyệt (2026-10-24), đồng ý dùng hàm SQL (`supabase.rpc`), kèm 4 điều chỉnh đã làm:
  1. Quy ước hàm SQL (kiến trúc D10): revoke `public, anon, authenticated` + grant `service_role`; khóa
     `pg_advisory_xact_lock(hashtext(trip_id))` đầu hàm; kiểm lại trong hàm version khoản chi và `trips.money_version`
     (cột mới, tăng mỗi khi khoản chi/lần chuyển đổi — cách để kiểm lại `remainingVnd` trong hàm). Test I-27 (2 markSent
     song song ghi 1 lần), I-28 (2 updateExpense song song → 1 STALE), I-29 (gọi hàm bằng anon key bị từ chối).
  2. Tách slice 02 thành 02a (hạ tầng) và 02b (5 action + S1–S4); README, sơ đồ phụ thuộc cập nhật.
  3. Migration tên `YYYYMMDDHHMMSS_ten.sql` (chuẩn Supabase CLI), kể cả init; mỗi slice một migration hàm SQL.
  4. GATE slice 05: quét bằng app ngân hàng có sẵn (tối thiểu 1), ghi app chưa thử vào STATUS.
  Schema chạy lại trên PGlite: 29 kiểm đúng như mong đợi.
- Bước 9 (2026-10-24), trên branch `chore/repo-setup`:
  - Remote `origin` = https://github.com/kakout0201/Gop-keo.git; `git ls-remote` rỗng (repo trống) → không cần hỏi thêm.
  - Quét bí mật: gitleaks 8.30.1 (tải từ GitHub release, đã khớp checksum) quét toàn bộ lịch sử (`--all`) và thư mục làm việc:
    **không có rò rỉ**. Grep tay: không email, số điện thoại, khóa, số TK thật trong file theo dõi; số TK mẫu 000011112222 là giả.
    Có link canvas riêng tư `claude.ai/artifact/...` trong docs (người ngoài không mở được). Tên chủ dự án có trong tác giả
    commit và LICENSE (trùng tên công khai trên GitHub profile).
  - `main`: thêm commit `chore: add gitignore` (.env* trừ .env.example) — main vẫn chỉ có docs.
  - Next.js **16.4.3** (create-next-app, App Router, TS strict, Tailwind 4, ESLint), React 19.3; zod 4, supabase-js 2,
    server-only; dev: vitest 5, coverage, prettier, supabase CLI 2.122; @types/node 22. Scripts `lint`, `typecheck`
    (`next typegen && tsc --noEmit`), `format:check`, `test`, `check`. `npm run check` và `npm run build` xanh.
  - CI `.github/workflows/ci.yml` (job `check`). `.gitattributes` giữ LF. README (ảnh prototype, quy trình), LICENSE MIT.
  - CLAUDE.md thêm luật kỹ thuật; `.claude/agents/` reviewer, test-writer, security-auditor; `.claude/commands/` slice, verify,
    ship; settings: thêm quyền npx cho vitest/tsc/prettier/supabase local, chặn đọc `.env*` mọi thư mục, force push,
    `db push`, `db reset --linked`.
  - Email commit: đổi sang `270144864+kakout0201@users.noreply.github.com` (đặt `git config user.email` riêng repo), viết lại
    tác giả + committer của cả 10 commit bằng `git filter-branch` **trước** lần push đầu; xóa `refs/original`; gỡ email cũ
    khỏi STATUS. `git log --format='%ae' --all | sort -u` chỉ còn email noreply. gitleaks quét lại: không rò rỉ.
  - Docker Desktop đã bật, `.wslconfig` (3 GB) đã tạo, `gh` 2.103.2 đã đăng nhập (chủ dự án làm).
  - Push `main` (docs + .gitignore) và `chore/repo-setup`; tạo PR #1 bằng `gh`.
  - Bật qua API: secret scanning, push protection, Dependabot alerts (đều xác nhận lại bằng API). Dependabot security
    updates (tự mở PR vá) **chưa bật** vì không được yêu cầu.
  - Branch protection `main`: bắt buộc PR (0 người duyệt, vì làm một mình), bắt buộc check `check` xanh và nhánh phải mới
    nhất (strict), áp dụng cả admin, cấm force push và xóa nhánh.
  - Bỏ ghi công AI (yêu cầu chủ dự án): `.claude/settings.json` có `"attribution": {"commit": "", "pr": "", "sessionUrl": false}`
    (khóa kiểm theo tài liệu settings của Claude Code); CLAUDE.md mục Git + lệnh `/ship` cấm dòng Co-Authored-By / Generated with.
    Viết lại message 11 commit cũ bằng `git filter-branch --msg-filter` (giữ tác giả noreply và thời gian); grep trên `main` +
    `chore/repo-setup` rỗng. Mô tả PR #1 đã bỏ dòng "Generated with Claude Code". gitleaks quét lại: không rò rỉ.
    Force push bị luật `deny` chặn (giữ nguyên luật) → chủ dự án chọn **cách C** (2026-10-25): xóa repo GitHub, tạo lại repo
    trống cùng tên (id mới 1432405613). `git fetch --prune` xóa `origin/*` cũ; push thường `main` + `chore/repo-setup`;
    `git log --all --format=%B | grep -iE "co-authored|claude-session|generated with"` rỗng; email chỉ còn noreply.
    Bật lại secret scanning, push protection, Dependabot alerts, branch protection `main` (PR, 0 người duyệt, check `check`,
    strict, enforce admins, cấm force push/xóa) — đọc lại bằng API khớp. PR mới #1, mô tả không có dòng ghi công.
    Script `force-push-rewrite.ps1` trong scratchpad đã xóa. CLAUDE.md mục Bài học: đặt attribution từ đầu dự án.
  - Chưa: `supabase init` + cấu hình rút gọn (slice 00, cần Docker); Playwright + trình duyệt (slice 02b); không gọi subagent
    reviewer cho Bước 9 (chỉ cấu hình, đã tự kiểm `check` + build + gitleaks).
- Bước 9 kết thúc (2026-10-25): CI `check` xanh trên commit 116739c; chủ dự án cho phép; merge PR #1 bằng merge commit
  (tác giả email noreply, không dòng ghi công). Nhánh `chore/repo-setup` vẫn còn trên GitHub (chưa xóa).
- PLAYBOOK: Bước 10 liệt kê biến môi trường (thêm `IP_HASH_SECRET`); Bước 19 bỏ "bật auth ẩn danh" (Q12).

## Đang chờ chủ dự án — Bước 10
1. **USER — đưa schema lên DB dev** (Claude bị luật deny chặn `db push`, và lệnh cần đăng nhập + mật khẩu DB):
   `npx supabase login` → `npx supabase link --project-ref tjzlluomausmjgzlsmjs` (nhập mật khẩu DB) → `npx supabase db push`
   (xác nhận áp `20261024173758_init.sql`).
2. **ASK — push `slice/00-skeleton` + tạo PR** vào `main`; CI xanh → merge → Vercel production deploy →
   `BASE_URL=https://gopkeo.vercel.app npm run test:smoke` → **GATE Bước 10**: trang chủ + `/api/health` trên link Vercel.
3. **ASK — 2 điểm lệch kế hoạch slice 00:**
   - Helper integration "gọi Server Action với cookie + `x-real-ip` giả" dời sang **slice 02a** (cookie thiết bị, `lib/ip.ts`
     thuộc 02a; chưa có action nào để gọi).
   - `.env.example` chưa tạo: công cụ ghi file bị luật deny `Read(./**/.env.*)` chặn. Chủ dự án tự tạo (nội dung trong tin
     nhắn phiên 2026-10-25) hoặc cho phép Claude.

## Slice 00 — đã làm (2026-10-25, branch `slice/00-skeleton`)
- `supabase init`; local rút gọn: tắt realtime, storage, studio, edge runtime, analytics, smtp, GraphQL; giữ db + REST +
  gateway + auth (auth chỉ để CLI cấp khóa local cho test; app không dùng Supabase Auth). Docker + WSL 3 GB chạy ổn.
- Migration `supabase/migrations/20261024173758_init.sql` = nguyên `docs/03-schema.sql` (bỏ ghi chú cuối); áp local OK.
- `lib/env.ts` (Zod, server-only, lỗi chỉ nêu tên biến), `lib/db/client.ts` (service role, server-only, no-store),
  `lib/version.ts`, `app/api/health/route.ts` (`connection()`, truy vấn `trips`, 200/503, chỉ log mã lỗi).
- Layout: Nunito (latin + vietnamese, swap), tokens thiết kế trong `@theme`, cột 430px; trang chủ tạm (nút Tạo kèo disabled
  tới slice 02b); 404 "Không tìm thấy kèo này"; header bảo mật (nosniff, DENY, referrer, permissions, bỏ x-powered-by).
- Test: Vitest 2 project (`vitest.config.mts` — đổi đuôi .mts để Vite nạp ESM, không cảnh báo); unit `parseEnv` 3 ca;
  integration I-13 (5 ca, kiểm đúng tên ràng buộc), I-14 (RLS + 0 policy, quyền bảng anon/authenticated, REST anon 15 bảng)
  = 22 ca xanh; Playwright smoke 3 ca xanh trên app build thật + Supabase local (`/api/health`, trang chủ + header, 404).
- Kiểm: `npm run check` xanh; `npm run build` không cần biến môi trường; bundle `.next/static` không có chuỗi khóa server
  (CI có bước tự kiểm); không file `.env*` trong git.
- Subagent reviewer: 0 BLOCKER, 2 MAJOR, 7 MINOR → đã sửa hết trừ 2 điểm lệch ở trên (chờ chủ dự án).
- Ghi nhận: schema không xóa dây chuyền từ `members` sang expenses/payments/trip_events → xóa kèo sẽ lỗi; v1 không có xóa kèo
  nên chưa đổi schema; test tự dọn theo thứ tự.
- `IP_HASH_SECRET` phải ≥ 32 ký tự (lệnh `node ... randomBytes(32).toString('base64url')` ra 43 ký tự, đủ); ngắn hơn thì
  `/api/health` trả 503.
- Chưa kiểm: CI trên GitHub với code mới; `/api/health` trên Vercel (cần db push + merge); Nunito hiển thị trên điện thoại thật.

## Quyết định Bước 9 (2026-10-24)
| Q | Chốt |
|---|---|
| Q1 | Supabase **local rút gọn** cho code + test (cần Docker, WSL giới hạn ~3 GB); project dev trên cloud chỉ cho preview Vercel |
| Q2 | Code Bước 9 trên branch `chore/repo-setup`; push `main` (chỉ docs + .gitignore) và branch; chủ dự án tạo + merge PR |
| Q3 | Chủ dự án tự cài `gh` và đăng nhập |
| Q4 | Repo **công khai** https://github.com/kakout0201/Gop-keo (làm profile). Được phép push theo 5 điều kiện: ls-remote trống, quét secret, hỏi email, README + LICENSE, push rồi hướng dẫn bảo vệ repo |

## Quyết định Bước 7 (Q1–Q14 — đã chốt theo đề xuất, 2026-10-24)
| Q | Câu hỏi | Đã chốt | Lý do ngắn |
|---|---|---|---|
| Q1 | Làm tròn khi chia lẻ (E7) | Chia hết thì chia đều; không thì làm tròn đến 1.000 ₫, người trả chịu phần chênh (người trả không trong danh sách → người vào kèo sớm nhất trong danh sách). Mỗi phần < 1.000 ₫ thì chia đến đồng. Câu S7: "Chia lẻ nên làm tròn đến 1.000 ₫: 86.000 ₫ mỗi người, riêng Tuấn (người trả) 84.000 ₫." | Số tròn dễ chuyển; chênh chỉ vài nghìn, ghi rõ con số thay vì nêu quy tắc |
| Q2 | Gộp nợ hay chuyển riêng | Gộp nợ: mỗi người nợ chuyển cho ít người nhất (thường 1); thuật toán ổn định, đánh dấu đã trả không làm đổi dòng khác (PRD R5). Dữ liệu mẫu ra đúng 6 lần chuyển như prototype | Ít lần quét QR (rủi ro brief); prototype đã giả định |
| Q3 | Ai sửa/xóa được khoản chi | Người ghi khoản, người trả khoản, người tạo kèo. Mọi sửa đều có lịch sử trước/sau | Đủ linh hoạt, hạn chế sửa bậy |
| Q4 | Số TK hiện cho ai (G4, E9) | Chỉ người đã chọn tên trong kèo (và chỉ TK của người mình cần chuyển). Câu S9: "Chỉ người trong nhóm đã chọn tên mới thấy số tài khoản này. Bạn xóa được bất cứ lúc nào." | Bớt lộ khi link bị chuyển tiếp; bớt ngần ngại (giả định 5) |
| Q5 | Trùng tên / đổi máy (G3) | Tên đã có máy khác vẫn chọn được nhưng hỏi lại; đồng ý thì cả 2 máy là người đó, cả nhóm thấy dòng "X vừa mở kèo trên một máy khác". Gõ tên trùng → "Bạn là X này à?" | Người lớn tuổi hay đổi máy/xóa dữ liệu; minh bạch thay cho khóa |
| Q6 | Sửa khoản sau khi đã có người trả (E10) | Người nhận thừa hoàn lại đúng người đã chuyển cho mình; hiện như một dòng nợ "Hoàn lại cho Mai 100.000 ₫" có QR | Đơn giản, đúng với tiền đã đi |
| Q7 | Mở lại vote sau khi chốt | Có, chỉ người tạo; phiếu cũ giữ nguyên | Lịch hay đổi phút chót |
| Q8 | Chỉ số "≥ 5/6 trả trong 48 giờ" | ≥ 80% số lần chuyển đã đánh dấu trong 48 giờ (từ lúc có TK + khoản chi cuối) | Áp dụng được cho nhóm cỡ bất kỳ |
| Q9 | Chấm đỏ tab Trả tiền khi được nợ mà chưa nhập TK (G11) | Có | Không có TK thì không ai trả được |
| Q10 | Nhóm > 7 người | Tối đa 20 người/kèo; màu avatar lặp lại theo thứ tự vào kèo | Đủ cho nhóm bạn/gia đình; chống spam |
| Q11 | Nội dung chuyển khoản | `GOPKEO <mã kèo> <TÊN>`, IN HOA không dấu, ≤ 25 ký tự; mã kèo = chữ đầu 3 từ đầu ("VT2"). Vd "GOPKEO VT2 KHOA" | 25 ký tự là mức an toàn cho mọi ngân hàng (chưa kiểm) |
| Q12 | Kiến trúc dữ liệu (liên quan khóa bí mật) | Chỉ server truy cập DB bằng **service role key** (chỉ trên Vercel + .env.local); RLS bật, không policy; danh tính bằng cookie thiết bị. **Bỏ** "bật auth ẩn danh" ở Bước 19 | Luật quyền ở 1 chỗ, test được; trang nhanh hơn; không lộ anon key |
| Q13 | Người được nợ tự đánh dấu "Đã nhận" (trả tiền mặt) | Có (Should), hoàn tác được | Mẹ/người lớn tuổi hay đưa tiền mặt |
| Q14 | Phạm vi v1 | Không làm: chia không đều, deeplink mở app ngân hàng (chưa tìm được tài liệu chính thức), xóa kèo, trả một phần | Giữ v1 nhỏ |

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

## Bước 7 — chưa kiểm chứng
- Schema đã chạy thử trên Postgres thật (PGlite, ngoài repo): tạo bảng OK, 7 ràng buộc chặn đúng ca sai,
  anon/authenticated không có quyền, mọi bảng bật RLS. **Chưa** chạy trên Supabase thật.
- Thuật toán chia/kế hoạch chuyển chạy thử bằng script node (ngoài repo) trên dữ liệu mẫu: ra đúng 6 lần
  chuyển như prototype, đánh dấu đã trả không đổi dòng khác. Chưa có property test (để Bước 10).
- Schema sau 5 bổ sung chạy lại trên PGlite: thêm 6 kiểm (void_reason, disputed chỉ bởi người nhận, claimed_via,
  rate_limit_hits) đều đúng; 15/15 bảng bật RLS.
- Rà chéo bằng subagent trong phiên bị dừng 2 lần; chủ dự án thay bằng rà độc lập ở chat bên ngoài (4 sửa ở trên).
- Nhãn "mới" < 48h: trong kèo vừa tạo, gần như mọi người đều có nhãn trong 2 ngày đầu (lúc vote) — có thể gây
  nhiễu; xem lại ở bug bash Bước 18.
- `nameKey` bỏ khoảng trắng nên "Tuấn Anh" = "tuananh" = "Tu Ấn Anh"; hai người tên ghép khác nhau nhưng trùng chữ
  sẽ bị coi là trùng (hiếm, chấp nhận; người sau thêm số/chữ để phân biệt).
- Quy tắc 24 giờ (R12) cũng khóa chính chủ khi mất cookie hoặc tự bấm "đổi" rồi chọn lại tên — đánh đổi có chủ đích.
- Ai chọn tên người tạo kèo có ngay quyền người tạo (chốt, sửa mọi khoản) — chấp nhận ở v1, ghi ở kiến trúc §7.
- Prototype chưa vẽ: dòng gộp nợ + sheet chi tiết (US-22), cảnh báo đổi TK (R12), nút "Chưa nhận được" (US-21).
- Cách lấy IP trên Vercel (`x-real-ip`/`x-forwarded-for` do nền tảng đặt) theo hiểu biết, chưa thử trên deploy thật.
- Deeplink app ngân hàng: tìm nhanh không thấy tài liệu chính thức.

## Điểm mở cũ (đã chốt qua Q1–Q14)
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
- **E7:** thay "[quy tắc làm tròn — chốt ở Bước 7]" ở S7 bằng câu theo PRD R3 (vd "Chia lẻ nên làm tròn đến 1.000 ₫: 86.000 ₫ mỗi người, riêng Tuấn (người trả) 84.000 ₫.").
- **E8:** nút "Đổi vai" và màn Demo chỉ có trong prototype; không code, không đưa vào spec.
- E1: "Lưu ảnh QR" phải chạy được trong trình duyệt Zalo; nếu không lưu được thì có phương án
  chạm giữ ảnh. Nút copy số tiền nên copy dạng số trơn (870000) cho app ngân hàng.
