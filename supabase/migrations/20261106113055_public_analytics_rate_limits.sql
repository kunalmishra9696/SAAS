create table if not exists public.analytics_rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creator_profiles(id) on delete cascade,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists analytics_rate_limit_events_window_idx
  on public.analytics_rate_limit_events (creator_id, ip_hash, created_at desc);

alter table public.analytics_rate_limit_events enable row level security;
revoke all on public.analytics_rate_limit_events from anon, authenticated;