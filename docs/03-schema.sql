-- Góp Kèo v1 — schema Postgres (Supabase)
-- Trạng thái: duyệt GATE Bước 7 + bổ sung GATE Bước 8 (money_version). Slice 00 chép thành
-- supabase/migrations/<YYYYMMDDHHMMSS>_init.sql (tên theo chuẩn Supabase CLI).
-- Quy ước:
--   * Tiền: bigint, số nguyên VND, không bao giờ âm trong bảng (dấu do ngữ cảnh: trả / phần chia).
--   * Thời gian: timestamptz (UTC), hiển thị giờ Việt Nam ở app.
--   * Truy cập: chỉ server (service role) — xem 02-architecture.md D1 [Q12].
--     RLS bật trên mọi bảng, KHÔNG có policy cho anon/authenticated => mọi truy cập trực tiếp bị chặn.
--   * Xóa mềm cho khoản chi (giữ lịch sử); hoàn tác lần chuyển = voided_at.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Thiết bị (cookie gk_device). Chỉ lưu sha256 của token.
-- ---------------------------------------------------------------------------
create table public.devices (
  id            uuid primary key default gen_random_uuid(),
  token_hash    bytea not null unique check (octet_length(token_hash) = 32),
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Kèo
-- ---------------------------------------------------------------------------
create table public.trips (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique check (slug ~ '^[A-Za-z0-9]{16}$'),
  title                   text not null check (char_length(btrim(title)) between 1 and 60),
  status                  text not null default 'voting' check (status in ('voting', 'closed')),
  creator_member_id       uuid not null,    -- id tạo trước ở server; FK hoãn tới cuối giao dịch (vòng tròn với members)
  created_by_device_id    uuid not null references public.devices(id),
  closed_date_option_id   uuid,             -- FK thêm bên dưới
  closed_place_option_id  uuid,             -- FK thêm bên dưới; null nếu kèo không có chỗ
  closed_at               timestamptz,
  -- Tăng 1 mỗi khi khoản chi hoặc lần chuyển đổi (kiến trúc D10). app_mark_sent / app_mark_received kiểm lại
  -- giá trị này bên trong hàm để remainingVnd do TS tính không bị cũ.
  money_version           bigint not null default 0 check (money_version >= 0),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint trips_closed_consistent check (
    (status = 'voting' and closed_date_option_id is null and closed_place_option_id is null and closed_at is null)
    or (status = 'closed' and closed_date_option_id is not null and closed_at is not null)
  )
);
create index trips_created_by_device_idx on public.trips (created_by_device_id, created_at);  -- giới hạn 20 kèo/ngày

-- ---------------------------------------------------------------------------
-- Thành viên (tên trong kèo). join_order bắt đầu từ 1 = người tạo.
-- ---------------------------------------------------------------------------
create table public.members (
  id            uuid primary key default gen_random_uuid(),
  trip_id       uuid not null references public.trips(id) on delete cascade,
  display_name  text not null check (char_length(btrim(display_name)) between 1 and 30),
  name_key      text not null check (name_key ~ '^[a-z0-9]{1,30}$'),  -- bỏ dấu (đ→d), thường, CHỈ giữ a-z 0-9 (PRD R1)
  join_order    int  not null check (join_order between 1 and 20),             -- [Q10] tối đa 20 người
  created_at    timestamptz not null default now(),
  unique (trip_id, name_key),
  unique (trip_id, join_order),
  unique (trip_id, id)            -- để FK ghép (trip_id, member_id) ở các bảng con
);

alter table public.trips
  add constraint trips_creator_fk
  foreign key (id, creator_member_id) references public.members (trip_id, id)
  deferrable initially deferred;

-- Thiết bị nào đang là thành viên nào. Một thiết bị = một thành viên trong một kèo.
-- Một thành viên có thể có nhiều thiết bị [Q5].
create table public.member_devices (
  trip_id     uuid not null,
  member_id   uuid not null,
  device_id   uuid not null references public.devices(id) on delete cascade,
  -- 'created' = máy tạo ra tên (createTrip, joinAsNewMember); 'claimed' = máy gắn vào tên có sẵn (claimMember).
  -- 'claimed' + created_at < 24h => không được lưu/xóa tài khoản nhận tiền (PRD R12, kiến trúc D9).
  claimed_via text not null check (claimed_via in ('created', 'claimed')),
  created_at  timestamptz not null default now(),
  primary key (trip_id, device_id),
  foreign key (trip_id, member_id) references public.members (trip_id, id) on delete cascade
);
create index member_devices_member_idx on public.member_devices (member_id);

-- ---------------------------------------------------------------------------
-- Lựa chọn ngày / chỗ và phiếu
-- ---------------------------------------------------------------------------
create table public.date_options (
  id          uuid primary key default gen_random_uuid(),
  trip_id     uuid not null references public.trips(id) on delete cascade,
  start_date  date not null,
  end_date    date not null,
  created_at  timestamptz not null default now(),
  check (end_date >= start_date and end_date - start_date <= 13),
  unique (trip_id, start_date),
  unique (trip_id, id)
);

create table public.place_options (
  id                   uuid primary key default gen_random_uuid(),
  trip_id              uuid not null references public.trips(id) on delete cascade,
  name                 text not null check (char_length(btrim(name)) between 1 and 80),
  price_per_night_vnd  bigint check (price_per_night_vnd between 0 and 1000000000),
  url                  text check (url ~ '^https://' and char_length(url) <= 500),
  position             smallint not null check (position between 1 and 6),
  created_at           timestamptz not null default now(),
  unique (trip_id, position),
  unique (trip_id, id)
);

alter table public.trips
  add constraint trips_closed_date_fk
  foreign key (id, closed_date_option_id) references public.date_options (trip_id, id),
  add constraint trips_closed_place_fk
  foreign key (id, closed_place_option_id) references public.place_options (trip_id, id);

create table public.date_votes (
  trip_id         uuid not null,
  date_option_id  uuid not null,
  member_id       uuid not null,
  created_at      timestamptz not null default now(),
  primary key (date_option_id, member_id),
  foreign key (trip_id, date_option_id) references public.date_options (trip_id, id) on delete cascade,
  foreign key (trip_id, member_id) references public.members (trip_id, id) on delete cascade
);
create index date_votes_trip_idx on public.date_votes (trip_id);

create table public.place_votes (
  trip_id          uuid not null,
  place_option_id  uuid not null,
  member_id        uuid not null,
  created_at       timestamptz not null default now(),
  primary key (place_option_id, member_id),
  foreign key (trip_id, place_option_id) references public.place_options (trip_id, id) on delete cascade,
  foreign key (trip_id, member_id) references public.members (trip_id, id) on delete cascade
);
create index place_votes_trip_idx on public.place_votes (trip_id);

-- ---------------------------------------------------------------------------
-- Chi tiêu. Phần chia tính ở server (R3) và lưu lại; DB kiểm tổng = số tiền.
-- ---------------------------------------------------------------------------
create table public.expenses (
  id                     uuid primary key default gen_random_uuid(),
  trip_id                uuid not null references public.trips(id) on delete cascade,
  title                  text not null check (char_length(btrim(title)) between 1 and 60),
  amount_vnd             bigint not null check (amount_vnd between 1000 and 500000000),
  payer_member_id        uuid not null,
  created_by_member_id   uuid not null,
  updated_by_member_id   uuid not null,
  version                int  not null default 1,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  deleted_at             timestamptz,
  deleted_by_member_id   uuid,
  unique (trip_id, id),
  foreign key (trip_id, payer_member_id)      references public.members (trip_id, id),
  foreign key (trip_id, created_by_member_id) references public.members (trip_id, id),
  foreign key (trip_id, updated_by_member_id) references public.members (trip_id, id),
  foreign key (trip_id, deleted_by_member_id) references public.members (trip_id, id),
  check ((deleted_at is null) = (deleted_by_member_id is null))
);
create index expenses_trip_idx on public.expenses (trip_id, created_at) where deleted_at is null;

create table public.expense_shares (
  trip_id     uuid   not null,
  expense_id  uuid   not null,
  member_id   uuid   not null,
  amount_vnd  bigint not null check (amount_vnd >= 0),
  primary key (expense_id, member_id),
  foreign key (trip_id, expense_id) references public.expenses (trip_id, id) on delete cascade,
  foreign key (trip_id, member_id)  references public.members (trip_id, id)
);
create index expense_shares_trip_idx on public.expense_shares (trip_id);

-- Tổng phần chia phải bằng số tiền (kiểm ở cuối giao dịch).
create or replace function public.check_expense_shares_sum() returns trigger
language plpgsql as $$
declare
  v_expense_id uuid := coalesce(new.expense_id, old.expense_id);
  v_amount bigint;
  v_sum bigint;
  v_count int;
begin
  select amount_vnd into v_amount from public.expenses where id = v_expense_id;
  if v_amount is null then
    return null;  -- khoản chi đã bị xóa cứng (cascade)
  end if;
  select coalesce(sum(amount_vnd), 0), count(*) into v_sum, v_count
    from public.expense_shares where expense_id = v_expense_id;
  if v_count = 0 or v_sum <> v_amount then
    raise exception 'expense % shares sum % <> amount %', v_expense_id, v_sum, v_amount
      using errcode = '23514';
  end if;
  return null;
end $$;

create constraint trigger expense_shares_sum_on_shares
  after insert or update or delete on public.expense_shares
  deferrable initially deferred
  for each row execute function public.check_expense_shares_sum();

-- Khi đổi số tiền của khoản chi cũng phải kiểm lại.
create or replace function public.check_expense_amount_change() returns trigger
language plpgsql as $$
declare v_sum bigint;
begin
  select coalesce(sum(amount_vnd), 0) into v_sum from public.expense_shares where expense_id = new.id;
  if v_sum <> new.amount_vnd then
    raise exception 'expense % shares sum % <> amount %', new.id, v_sum, new.amount_vnd
      using errcode = '23514';
  end if;
  return null;
end $$;

create constraint trigger expenses_amount_matches_shares
  after insert or update of amount_vnd on public.expenses
  deferrable initially deferred
  for each row execute function public.check_expense_amount_change();

-- ---------------------------------------------------------------------------
-- Tài khoản nhận tiền: một tài khoản cho một thành viên trong một kèo.
-- ---------------------------------------------------------------------------
create table public.payout_accounts (
  member_id       uuid primary key,
  trip_id         uuid not null,
  bank_bin        text not null check (bank_bin ~ '^[0-9]{6}$'),
  account_number  text not null check (account_number ~ '^[0-9]{4,19}$'),
  account_name    text not null check (account_name ~ '^[A-Z][A-Z ]{0,48}[A-Z]$'),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- now() khi lưu mà thành viên đã từng có tài khoản (có event account_saved trước đó, kể cả đã xóa).
  -- null = lần nhập đầu. changed_at > now() - 48h => cảnh báo ở S10 (PRD R12.2a).
  changed_at      timestamptz,
  -- Máy đã lưu lần gần nhất, và ảnh chụp "máy đó gắn vào tên có sẵn (claimed)" tại lúc lưu.
  -- saved_from_claimed_device and updated_at > now() - 48h => cảnh báo ở S10 (PRD R12.2b), kể cả lần nhập đầu.
  saved_by_device_id         uuid references public.devices(id) on delete set null,
  saved_from_claimed_device  boolean not null,
  foreign key (trip_id, member_id) references public.members (trip_id, id) on delete cascade
);
create index payout_accounts_trip_idx on public.payout_accounts (trip_id);

-- ---------------------------------------------------------------------------
-- Lần chuyển tiền do người dùng tự đánh dấu. Không bao giờ xóa; hoàn tác = voided_at.
-- method: 'sent' = người chuyển tự đánh dấu; 'received' = người nhận đánh dấu đã nhận [Q13].
-- ---------------------------------------------------------------------------
create table public.payments (
  id                      uuid primary key default gen_random_uuid(),
  trip_id                 uuid not null references public.trips(id) on delete cascade,
  from_member_id          uuid not null,
  to_member_id            uuid not null,
  amount_vnd              bigint not null check (amount_vnd between 1 and 1000000000),
  method                  text not null check (method in ('sent', 'received')),
  recorded_by_member_id   uuid not null,
  created_at              timestamptz not null default now(),
  voided_at               timestamptz,
  voided_by_member_id     uuid,
  -- 'undo' = người đã ghi hoàn tác; 'disputed' = người nhận báo "Chưa nhận được" (chỉ cho method='sent').
  void_reason             text check (void_reason in ('undo', 'disputed')),
  check (from_member_id <> to_member_id),
  check ((voided_at is null) = (voided_by_member_id is null)),
  check ((voided_at is null) = (void_reason is null)),
  check (void_reason is distinct from 'disputed' or (method = 'sent' and voided_by_member_id = to_member_id)),
  foreign key (trip_id, from_member_id)        references public.members (trip_id, id),
  foreign key (trip_id, to_member_id)          references public.members (trip_id, id),
  foreign key (trip_id, recorded_by_member_id) references public.members (trip_id, id),
  foreign key (trip_id, voided_by_member_id)   references public.members (trip_id, id)
);
create index payments_trip_idx on public.payments (trip_id, created_at) where voided_at is null;

-- ---------------------------------------------------------------------------
-- Hoạt động của kèo (lịch sử, banner P11, "mở trên máy khác").
-- kind: trip_created | trip_updated | trip_closed | trip_reopened | member_joined
--       | member_new_device | expense_created | expense_updated | expense_deleted
--       | payment_recorded | payment_voided | payment_disputed | account_saved | account_deleted
-- payload: before/after của khoản chi (tiêu đề, số tiền, người trả, phần chia); account_saved có
--          bankBin, bankName, isChange. KHÔNG BAO GIỜ chứa số TK, tên chủ TK, IP, token.
-- ---------------------------------------------------------------------------
create table public.trip_events (
  id               bigint generated always as identity primary key,
  trip_id          uuid not null references public.trips(id) on delete cascade,
  actor_member_id  uuid,
  kind             text not null check (kind in (
                     'trip_created','trip_updated','trip_closed','trip_reopened',
                     'member_joined','member_new_device',
                     'expense_created','expense_updated','expense_deleted',
                     'payment_recorded','payment_voided','payment_disputed',
                     'account_saved','account_deleted')),
  expense_id       uuid,
  payload          jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  foreign key (trip_id, actor_member_id) references public.members (trip_id, id)
);
create index trip_events_trip_idx on public.trip_events (trip_id, id desc);
create index trip_events_expense_idx on public.trip_events (expense_id) where expense_id is not null;

-- Mốc "Đã hiểu" của banner thay đổi chi tiêu, theo thành viên.
create table public.member_reads (
  member_id              uuid primary key,
  trip_id                uuid not null,
  expense_events_seen_id bigint not null default 0,
  foreign key (trip_id, member_id) references public.members (trip_id, id) on delete cascade
);

-- ---------------------------------------------------------------------------
-- Giới hạn tần suất (kiến trúc D8). key_hash = HMAC-SHA256(IP_HASH_SECRET, bucket:ip) hoặc sha256 device id.
-- Không lưu IP gốc. Dòng cũ hơn 7 ngày bị xóa khi chèn.
-- bucket: 'create_trip:ip' | 'join_member:ip' | 'create_device:ip'
--         (giới hạn theo thiết bị đếm từ trips.created_by_device_id)
-- ---------------------------------------------------------------------------
create table public.rate_limit_hits (
  id          bigint generated always as identity primary key,
  bucket      text  not null check (bucket in ('create_trip:ip', 'join_member:ip', 'create_device:ip')),
  key_hash    bytea not null check (octet_length(key_hash) = 32),
  created_at  timestamptz not null default now()
);
create index rate_limit_hits_lookup_idx on public.rate_limit_hits (bucket, key_hash, created_at);
create index rate_limit_hits_created_idx on public.rate_limit_hits (created_at);

-- ---------------------------------------------------------------------------
-- updated_at tự cập nhật
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger trips_touch before update on public.trips
  for each row execute function public.touch_updated_at();
create trigger expenses_touch before update on public.expenses
  for each row execute function public.touch_updated_at();
create trigger payout_accounts_touch before update on public.payout_accounts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: bật trên mọi bảng, không policy cho anon/authenticated.
-- service_role bỏ qua RLS (mặc định của Supabase) => chỉ server đọc/ghi được.
-- ---------------------------------------------------------------------------
alter table public.devices          enable row level security;
alter table public.trips            enable row level security;
alter table public.members          enable row level security;
alter table public.member_devices   enable row level security;
alter table public.date_options     enable row level security;
alter table public.place_options    enable row level security;
alter table public.date_votes       enable row level security;
alter table public.place_votes      enable row level security;
alter table public.expenses         enable row level security;
alter table public.expense_shares   enable row level security;
alter table public.payout_accounts  enable row level security;
alter table public.payments         enable row level security;
alter table public.trip_events      enable row level security;
alter table public.member_reads     enable row level security;
alter table public.rate_limit_hits  enable row level security;

revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables    from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Ghi chú cho Bước 10
-- * Mọi thao tác ghi đi qua hàm SQL app_<việc> (kiến trúc D10, duyệt GATE Bước 8): security invoker,
--   revoke execute from public/anon/authenticated, grant execute to service_role, khóa
--   pg_advisory_xact_lock(hashtext(trip_id::text)) đầu hàm, kiểm lại điều kiện trạng thái trong hàm.
--   Hàm nằm ở các migration riêng của từng slice, không ở file init.
-- * Giới hạn 20 thành viên: kiểm ở server + check join_order <= 20 ở DB.
-- * Giới hạn 200 khoản chi/kèo: kiểm ở server.
-- ---------------------------------------------------------------------------
