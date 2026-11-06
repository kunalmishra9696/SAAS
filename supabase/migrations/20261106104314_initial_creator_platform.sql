create schema if not exists app_private;

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.creator_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  email text not null default '',
  avatar_url text,
  niche text,
  onboarding_step integer not null default 0 check (onboarding_step between 0 and 9),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_pages (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null unique references public.creator_profiles(id) on delete cascade,
  handle text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published', 'unpublished')),
  page_data jsonb not null default '{}'::jsonb,
  theme jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint creator_pages_handle_format check (handle ~ '^[a-z0-9][a-z0-9_-]{2,29}$')
);

create table if not exists public.creator_settings (
  creator_id uuid primary key references public.creator_profiles(id) on delete cascade,
  currency text not null default 'INR' check (currency in ('INR', 'USD')),
  target_rate numeric(12,2) not null default 0 check (target_rate >= 0),
  minimum_rate numeric(12,2) not null default 0 check (minimum_rate >= 0),
  public_starting_rate numeric(12,2) check (public_starting_rate is null or public_starting_rate >= 0),
  allowed_compensation text[] not null default array['cash']::text[],
  preferred_categories text[] not null default '{}'::text[],
  excluded_categories text[] not null default '{}'::text[],
  hard_no_terms text[] not null default '{}'::text[],
  negotiation_counter_limit integer not null default 2 check (negotiation_counter_limit between 0 and 2),
  decision_window_days integer not null default 14 check (decision_window_days between 1 and 30),
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint creator_settings_floor_lte_target check (minimum_rate <= target_rate or target_rate = 0)
);

create table if not exists public.brand_inquiries (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creator_profiles(id) on delete cascade,
  page_id uuid references public.creator_pages(id) on delete set null,
  brand_name text not null,
  brand_email text,
  brand_website text,
  campaign_name text,
  currency text not null default 'INR' check (currency in ('INR', 'USD')),
  budget_min numeric(12,2) check (budget_min is null or budget_min >= 0),
  budget_max numeric(12,2) check (budget_max is null or budget_max >= 0),
  proposed_amount numeric(12,2) check (proposed_amount is null or proposed_amount >= 0),
  deliverables jsonb not null default '[]'::jsonb,
  campaign_timeline text,
  usage_rights text,
  exclusivity text,
  whitelisting boolean not null default false,
  payment_terms text,
  content_requirements text,
  status text not null default 'unfinished' check (status in ('unfinished', 'visible', 'hidden', 'on_hold', 'accepted', 'declined', 'hard_blocked', 'expired')),
  score numeric(4,2) check (score is null or score between 0 and 10),
  score_breakdown jsonb not null default '{}'::jsonb,
  score_explanation text,
  hard_block_reason text,
  negotiation_counters_used integer not null default 0 check (negotiation_counters_used between 0 and 2),
  last_activity_at timestamptz not null default now(),
  expires_at timestamptz,
  submitted_at timestamptz,
  decision_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brand_inquiries_creator_status_idx
  on public.brand_inquiries (creator_id, status, score desc, created_at desc);
create index if not exists brand_inquiries_expiry_idx
  on public.brand_inquiries (expires_at)
  where status in ('unfinished', 'visible', 'hidden', 'on_hold');

create table if not exists public.inquiry_messages (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.brand_inquiries(id) on delete cascade,
  sender text not null check (sender in ('brand', 'assistant', 'creator', 'system')),
  body text not null check (char_length(body) between 1 and 5000),
  message_kind text not null default 'text',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists inquiry_messages_inquiry_created_idx
  on public.inquiry_messages (inquiry_id, created_at);

create table if not exists public.creator_deals (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creator_profiles(id) on delete cascade,
  inquiry_id uuid unique references public.brand_inquiries(id) on delete set null,
  brand_name text not null,
  brand_email text,
  campaign_name text,
  currency text not null default 'INR' check (currency in ('INR', 'USD')),
  agreed_amount numeric(12,2) not null check (agreed_amount >= 0),
  deliverables jsonb not null default '[]'::jsonb,
  deadline timestamptz,
  usage_rights text,
  exclusivity text,
  whitelisting boolean not null default false,
  payment_terms text,
  status text not null default 'accepted' check (status in ('accepted', 'payment_pending', 'payment_received', 'content_in_progress', 'submitted', 'posted', 'completed', 'cancelled')),
  activity_log jsonb not null default '[]'::jsonb,
  accepted_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists creator_deals_creator_status_idx
  on public.creator_deals (creator_id, status, created_at desc);

create table if not exists public.analytics_daily (
  creator_id uuid not null references public.creator_profiles(id) on delete cascade,
  day date not null,
  page_views integer not null default 0 check (page_views >= 0),
  unique_visitors integer not null default 0 check (unique_visitors >= 0),
  link_clicks integer not null default 0 check (link_clicks >= 0),
  inquiry_starts integer not null default 0 check (inquiry_starts >= 0),
  completed_inquiries integer not null default 0 check (completed_inquiries >= 0),
  primary key (creator_id, day)
);

drop trigger if exists creator_profiles_updated_at on public.creator_profiles;
create trigger creator_profiles_updated_at
before update on public.creator_profiles
for each row execute function app_private.set_updated_at();

drop trigger if exists creator_pages_updated_at on public.creator_pages;
create trigger creator_pages_updated_at
before update on public.creator_pages
for each row execute function app_private.set_updated_at();

drop trigger if exists creator_settings_updated_at on public.creator_settings;
create trigger creator_settings_updated_at
before update on public.creator_settings
for each row execute function app_private.set_updated_at();

drop trigger if exists brand_inquiries_updated_at on public.brand_inquiries;
create trigger brand_inquiries_updated_at
before update on public.brand_inquiries
for each row execute function app_private.set_updated_at();

drop trigger if exists creator_deals_updated_at on public.creator_deals;
create trigger creator_deals_updated_at
before update on public.creator_deals
for each row execute function app_private.set_updated_at();

alter table public.creator_profiles enable row level security;
alter table public.creator_pages enable row level security;
alter table public.creator_settings enable row level security;
alter table public.brand_inquiries enable row level security;
alter table public.inquiry_messages enable row level security;
alter table public.creator_deals enable row level security;
alter table public.analytics_daily enable row level security;

drop policy if exists creator_profiles_select_own on public.creator_profiles;
create policy creator_profiles_select_own on public.creator_profiles
for select to authenticated using ((select auth.uid()) = id);

drop policy if exists creator_profiles_insert_own on public.creator_profiles;
create policy creator_profiles_insert_own on public.creator_profiles
for insert to authenticated with check ((select auth.uid()) = id);

drop policy if exists creator_profiles_update_own on public.creator_profiles;
create policy creator_profiles_update_own on public.creator_profiles
for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists creator_profiles_delete_own on public.creator_profiles;
create policy creator_profiles_delete_own on public.creator_profiles
for delete to authenticated using ((select auth.uid()) = id);

drop policy if exists creator_pages_public_or_owner_read on public.creator_pages;
create policy creator_pages_public_or_owner_read on public.creator_pages
for select to anon, authenticated using (
  status = 'published' or (select auth.uid()) = creator_id
);

drop policy if exists creator_pages_insert_own on public.creator_pages;
create policy creator_pages_insert_own on public.creator_pages
for insert to authenticated with check ((select auth.uid()) = creator_id);

drop policy if exists creator_pages_update_own on public.creator_pages;
create policy creator_pages_update_own on public.creator_pages
for update to authenticated using ((select auth.uid()) = creator_id) with check ((select auth.uid()) = creator_id);

drop policy if exists creator_pages_delete_own on public.creator_pages;
create policy creator_pages_delete_own on public.creator_pages
for delete to authenticated using ((select auth.uid()) = creator_id);

drop policy if exists creator_settings_owner_all on public.creator_settings;
create policy creator_settings_owner_all on public.creator_settings
for all to authenticated using ((select auth.uid()) = creator_id) with check ((select auth.uid()) = creator_id);

drop policy if exists brand_inquiries_owner_read on public.brand_inquiries;
create policy brand_inquiries_owner_read on public.brand_inquiries
for select to authenticated using ((select auth.uid()) = creator_id);

drop policy if exists brand_inquiries_owner_update on public.brand_inquiries;
create policy brand_inquiries_owner_update on public.brand_inquiries
for update to authenticated using ((select auth.uid()) = creator_id) with check ((select auth.uid()) = creator_id);

drop policy if exists inquiry_messages_owner_read on public.inquiry_messages;
create policy inquiry_messages_owner_read on public.inquiry_messages
for select to authenticated using (
  exists (
    select 1 from public.brand_inquiries bi
    where bi.id = inquiry_id and bi.creator_id = (select auth.uid())
  )
);

drop policy if exists creator_deals_owner_all on public.creator_deals;
create policy creator_deals_owner_all on public.creator_deals
for all to authenticated using ((select auth.uid()) = creator_id) with check ((select auth.uid()) = creator_id);

drop policy if exists analytics_daily_owner_read on public.analytics_daily;
create policy analytics_daily_owner_read on public.analytics_daily
for select to authenticated using ((select auth.uid()) = creator_id);

grant usage on schema public to anon, authenticated;
grant select on public.creator_pages to anon, authenticated;
grant insert, select, update, delete on public.creator_profiles, public.creator_pages, public.creator_settings to authenticated;
grant select, update on public.brand_inquiries to authenticated;
grant select on public.inquiry_messages to authenticated;
grant select, insert, update on public.creator_deals to authenticated;
grant select on public.analytics_daily to authenticated;