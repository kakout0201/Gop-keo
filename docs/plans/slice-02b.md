# Slice 02b — Tạo kèo, mở link, vote, "Bạn là ai?"

## Mục tiêu
Luồng chốt kèo phần đầu chạy thật trên điện thoại: Hùng tạo kèo → gửi link → Tuấn mở link trong Zalo thấy kèo ngay
(HTML render sẵn) → chạm vote → "Bạn là ai?" → lưu vote, có toast và "bạn đã vote".

## Story
US-01, US-02, US-03, US-04, US-05; sheet S4 dùng chung cho US-20. Quy tắc PRD R1, R2 (phần vote), R10 (toast, chấm đỏ
tab Kèo), R11 (tin mời, nhắc vote), §6 giới hạn. Kiến trúc D2. Màn S1, S2, S3, S4 (P01–P06, P19).

## File được sửa / tạo
- Actions: `lib/actions/trip.ts` (**chỉ** `createTrip`), `lib/actions/members.ts` (`claimMember`, `joinAsNewMember`,
  `releaseClaim`), `lib/actions/votes.ts` (`setVote`).
- Migration `supabase/migrations/<YYYYMMDDHHMMSS>_trip_vote_functions.sql`: `app_create_trip`, `app_claim_member`,
  `app_join_member`, `app_release_claim`, `app_set_vote` theo quy ước D10 (khóa theo kèo, kiểm lại trong hàm: giới hạn
  20 người, tên trùng theo `name_key`, kèo còn `voting`).
- `lib/view/sections/votes.ts` (điền khung: lựa chọn, người vote, "★ Đang dẫn", `voteSummary`, chấm đỏ Kèo).
- UI: `app/tao/page.tsx` (S1), `app/k/[slug]/page.tsx` (S3; chỗ trống cho S6 ở slice 03/05), `app/k/[slug]/chia-se/page.tsx`
  (S2), Open Graph cho `/k/[slug]` (D2).
- Component: `MoneyText`, `MemberAvatar` (màu theo thứ tự, "Th", nhãn "mới"), `Calendar` (nhiều ngày, sang tháng — G12),
  `VoteOption`, `LeadingLabel`, `BottomSheet`, `WhoAreYouSheet` (S4), `EmptyState`, `CopyButton`.
- Test: `tests/integration/trip.test.ts` (I-1, I-2), `members.test.ts` (I-3, I-4, I-25, I-26 phần action), `votes.test.ts`
  (I-5), dòng ma trận cho `createTrip`, `claimMember`, `joinAsNewMember`, `releaseClaim`, `setVote` (+ I-11 cho các action
  này), `tests/e2e/vote.spec.ts` (`@slice02b`: E2E 1 tới bước vote, slug sai, ngắt mạng khi vote, chấm đỏ), axe trên S1–S4.

## File cấm sửa
Theo [README](README.md). Thêm: `lib/device.ts`, `lib/ip.ts`, `lib/rate-limit.ts`, `lib/actions/context.ts`,
`lib/view/build-trip-view.ts`, `lib/view/sections/core.ts` (của 02a; chỉ sửa lỗi kèm test).

## Phụ thuộc
Slice 02a.

## Lệnh kiểm tra
```bash
npm run check
npm run test:int
npm run test:e2e -- --grep @slice02b
```

## Tiêu chí xong
- [ ] AC-01.1..01.6, AC-02.1..02.3, AC-03.1, AC-03.3, AC-04.1..04.9, AC-05.1..05.2, AC-G.1..G.9 đạt.
- [ ] Mở `/k/[slug]` lần đầu **không** đặt cookie (AC-03.1); chỉ đặt khi chọn tên / tạo kèo.
- [ ] Ma trận quyền xanh cho 5 action; mọi lỗi để DB không đổi; I-29 vẫn xanh với các hàm mới.
- [ ] GATE: test tay trên điện thoại thật, mở link trong Zalo, vote bằng 2 máy.
