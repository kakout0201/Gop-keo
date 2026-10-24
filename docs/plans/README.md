# Kế hoạch slice — Góp Kèo v1

Trạng thái: Bước 8, đã duyệt 2026-10-24 (kèm tách 02 thành 02a/02b, quy ước hàm SQL, tên migration). Nguồn: [01-prd](../01-prd.md), [02-architecture](../02-architecture.md),
[03-schema.sql](../03-schema.sql), [04-contracts](../04-contracts.md), [05-test-plan](../05-test-plan.md),
[06-acceptance](../06-acceptance.md).

## Thứ tự và phụ thuộc
```
00 Khung + deploy ─► 01 Lõi tính tiền ─► 02a Hạ tầng ─► 02b Kèo, vote, danh tính ─┬─► 03 Chốt / sửa kèo ─┐
                                                                                 └─► 04 Chi tiêu ────────┴─► 05 Trả tiền (người nợ, TK) ─► 06 Người được nợ, nhắc
```
| Slice | Story | Phụ thuộc | Song song được với |
|---|---|---|---|
| [00](slice-00.md) Khung + deploy | — (GATE Bước 10) | Bước 9 | — |
| [01](slice-01.md) Lõi tính tiền (hàm thuần) | nền cho US-09..23 | 00 | — |
| [02a](slice-02a.md) Hạ tầng dùng chung (không UI nghiệp vụ) | — | 01 | — |
| [02b](slice-02b.md) Kèo, vote, "Bạn là ai?" | US-01..05 (+ phần S4 của US-20) | 02a | — |
| [03](slice-03.md) Chốt / sửa kèo | US-06, 07, 08 | 02b | **04** |
| [04](slice-04.md) Chi tiêu | US-09, 10, 11 | 02b | **03** |
| [05](slice-05.md) Trả tiền: người nợ + tài khoản | US-12, 13, 14, 18, 20, 22, 23 | 03 và 04 | — |
| [06](slice-06.md) Người được nợ, tin nhắc, tiến độ | US-15, 16, 17, 19, 21 | 05 | — |

**03 ∥ 04:** chạy bằng 2 git worktree (2 session). Không file nào chung: slice 02a tạo sẵn file "khung" cho từng
phần của `TripView` (`lib/view/sections/*.ts`) và tab bar, nên 03 chỉ sửa `closing.ts`, 04 chỉ sửa `expenses.ts`.
Slice merge sau rebase lên slice merge trước; xung đột chỉ có thể ở `tests/integration/permissions.matrix.test.ts`
(mỗi slice thêm dòng riêng, nối cuối file). Mỗi slice có migration riêng, tên theo mốc thời gian nên không đụng nhau.

## Quy ước chung cho mọi slice
- Branch `slice/XX-ten-ngan`, commit `feat(scope): ...` / `test(scope): ...` / `fix(scope): ...`.
- **Test trước** cho logic tiền, quyền và mọi action (05-test-plan); mỗi action mới thêm dòng vào ma trận quyền §3b.
- **Lệnh kiểm tra chung:** `npm run check` (lint + typecheck + unit) và `npm run test:int` (integration, cần DB dev
  theo quyết định Bước 9) và `npm run test:e2e -- --grep @sliceXX` (Playwright 360/390). Tất cả phải xanh.
- **File cấm sửa ở mọi slice** (đổi phải hỏi chủ dự án — CLAUDE.md): `.env*`; migration đã có
  (`supabase/migrations/*.sql` của slice trước; đổi bảng/cột = migration mới + hỏi); `docs/0*.md` (đặc tả); `docs/design/**`; `CLAUDE.md`, `.claude/**`
  (trừ mục "Bài học" sau GATE). Không tạo `NEXT_PUBLIC_*` chứa khóa.
- **Xong slice** = tiêu chí riêng + lệnh kiểm tra xanh + subagent reviewer đọc diff + GATE test tay trên điện thoại
  (`npm run dev -- -H 0.0.0.0`) + `/ship` sau khi được phép.
- **Không thuộc slice nào:** AC-03.2 (≤ 3 giây qua 4G) và đo Lighthouse kiểm ở Bước 17; M-1, M-6..M-8 trên máy thật
  ở Bước 18 (M-2..M-5 là GATE của slice 05).
- **Migration:** tên theo chuẩn Supabase CLI `supabase/migrations/YYYYMMDDHHMMSS_ten.sql` (tạo bằng
  `npx supabase migration new <ten>`), kể cả bản đầu `<ts>_init.sql` ở slice 00. Áp lên DB local thoải mái; `supabase db push`
  lên project dev/prod luôn **hỏi trước** (CLAUDE.md).
- **Hàm SQL ghi (đã duyệt 2026-10-24, kiến trúc D10):** mọi thao tác ghi đi qua hàm `plpgsql` `app_<việc>` gọi bằng
  `supabase.rpc`. Mỗi hàm: SECURITY INVOKER, `set search_path = public`; `revoke execute ... from public, anon,
  authenticated` + `grant execute ... to service_role`; câu đầu tiên `perform pg_advisory_xact_lock(hashtext(p_trip_id::text))`;
  **kiểm lại bên trong hàm** mọi điều kiện phụ thuộc trạng thái (version khoản chi; `trips.money_version` cho
  `markSent`/`markReceived`; giới hạn số lượng; quyền theo thành viên). Slice nào thêm action thì thêm hàm của nó trong
  migration mới của slice đó. Test I-29 (gọi bằng anon key bị từ chối) tự phủ mọi hàm mới.
- Câu chữ lấy từ prototype ([design/screens/](../design/screens/)) và PRD; màu/chữ/kích thước từ
  [design/tokens.md](../design/tokens.md).
