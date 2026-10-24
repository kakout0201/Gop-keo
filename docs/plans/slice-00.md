# Slice 00 — Khung chạy được + deploy (walking skeleton)

## Mục tiêu
Một app Next.js trống nhưng **đi hết đường ống**: code → test → Vercel → Supabase. Trang chủ có font Nunito và
tokens; `/api/health` truy vấn DB thật; toàn bộ schema đã lên DB dev; bộ khung test (unit, integration, e2e, smoke)
chạy được. Đây là GATE của PLAYBOOK Bước 10.

## Story
Không có story người dùng. Phục vụ NFR (PRD §6) và kiến trúc D1, D7, §4, §6.

## File được sửa / tạo
- Cấu hình: `package.json` (scripts `dev`, `build`, `lint`, `typecheck`, `test`, `test:int`, `test:e2e`, `test:smoke`,
  `check`), lockfile, `next.config.ts` (header bảo mật cơ bản: `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options: DENY`), `tsconfig.json` (strict), `eslint.config.mjs`, `.prettierrc`, `postcss.config.mjs`,
  `.gitignore` (có `.env*`), `.env.example` (chỉ tên biến, không giá trị).
- `app/layout.tsx` (lang="vi", Nunito qua `next/font/google` với `display: swap`, nền `background`, cột giữa 430px),
  `app/globals.css` (tokens thành biến CSS + Tailwind theme), `app/page.tsx` (trang chủ: 1 câu giới thiệu + nút
  "Tạo kèo" trỏ `/tao`, tạm là trang "Sắp có"), `app/not-found.tsx`.
- `app/api/health/route.ts` (04-contracts §5).
- `lib/env.ts` (đọc + kiểm biến môi trường bằng Zod, `server-only`), `lib/db/client.ts` (Supabase client service role,
  `server-only`, không session, không cache), `lib/version.ts`.
- `supabase/config.toml`, `supabase/migrations/<YYYYMMDDHHMMSS>_init.sql` (tạo bằng `npx supabase migration new init`,
  **chép nguyên** từ docs/03-schema.sql, bỏ phần ghi chú cuối).
- `vitest.config.ts` (2 project: `unit`, `integration`), `playwright.config.ts` (viewport 360×780 và 390×844, UA Android),
  `tests/integration/helpers/` (tạo client DB test, dọn dữ liệu theo `trip_id`, gọi Server Action với cookie và
  `x-real-ip` giả), `tests/integration/schema.test.ts` (I-13, I-14), `tests/smoke/health.spec.ts` (`@smoke`),
  `tests/unit/env.test.ts`.
- `.github/workflows/ci.yml`: đã tạo ở Bước 9 (job `check`: `npm ci`, `npm run check`, `npm run build`, không cần secret);
  slice 00 giữ nguyên tên job (branch protection trỏ vào nó), chỉ thêm bước nếu cần.

## File cấm sửa
Theo [README](README.md). Thêm: không tạo route, action hay component nghiệp vụ (để slice sau).

## Phụ thuộc
- Bước 9 xong (repo, cấu hình Claude, quyết định Supabase local hay cloud dev).
- USER (PLAYBOOK Bước 10): tạo Supabase dev, import repo vào Vercel, nhập `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
  `IP_HASH_SECRET`, `APP_URL` trên Vercel và `.env.local`. Chạy migration lên DB dev là `supabase db push` → **hỏi trước**.

## Lệnh kiểm tra
```bash
npm run check
npm run test:int
npm run build
npm run test:smoke -- --base-url=<link Vercel>
```

## Tiêu chí xong
- [ ] `npm run check`, `npm run build` xanh; CI trên GitHub xanh.
- [ ] `tests/integration/schema.test.ts`: chèn sai tổng phần chia / tự chuyển cho mình / tên TK có dấu bị DB chặn (I-13);
      gọi REST Supabase bằng anon key vào mọi bảng bị từ chối (I-14).
- [ ] Trên link Vercel: `/` hiện trang chủ chữ Nunito, nền #FFF7EE; `/api/health` trả `200 {"ok":true,"db":"ok"}`.
- [ ] Bundle client không chứa `SUPABASE_SERVICE_ROLE_KEY` hay `service_role` (lệnh grep trong `.next/static` rỗng).
- [ ] Không file `.env*` nào trong git trừ `.env.example`.
