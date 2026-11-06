create table if not exists public.analytics_visitor_keys (
  creator_id uuid not null references public.creator_profiles(id) on delete cascade,
  day date not null,
  visitor_hash text not null,
  created_at timestamptz not null default now(),
  primary key (creator_id, day, visitor_hash)
);

alter table public.analytics_visitor_keys enable row level security;
revoke all on public.analytics_visitor_keys from anon, authenticated;

create or replace function public.record_creator_analytics(
  p_handle text,
  p_event text,
  p_visitor_hash text default null
)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_creator_id uuid;
  v_unique_visitors integer := 0;
  v_inserted integer := 0;
begin
  if p_event not in ('page_view', 'link_click', 'inquiry_start', 'inquiry_complete') then
    raise exception 'Unsupported analytics event';
  end if;

  select cp.creator_id
    into v_creator_id
    from public.creator_pages cp
   where cp.handle = p_handle
     and cp.status = 'published'
   limit 1;

  if v_creator_id is null then
    raise exception 'Published creator page not found';
  end if;

  if p_event = 'page_view' and p_visitor_hash is not null then
    insert into public.analytics_visitor_keys (creator_id, day, visitor_hash)
    values (v_creator_id, current_date, p_visitor_hash)
    on conflict (creator_id, day, visitor_hash) do nothing;

    get diagnostics v_inserted = row_count;
    v_unique_visitors := case when v_inserted > 0 then 1 else 0 end;
  end if;

  insert into public.analytics_daily (
    creator_id, day, page_views, unique_visitors, link_clicks,
    inquiry_starts, completed_inquiries
  )
  values (
    v_creator_id,
    current_date,
    case when p_event = 'page_view' then 1 else 0 end,
    v_unique_visitors,
    case when p_event = 'link_click' then 1 else 0 end,
    case when p_event = 'inquiry_start' then 1 else 0 end,
    case when p_event = 'inquiry_complete' then 1 else 0 end
  )
  on conflict (creator_id, day) do update set
    page_views = public.analytics_daily.page_views + excluded.page_views,
    unique_visitors = public.analytics_daily.unique_visitors + excluded.unique_visitors,
    link_clicks = public.analytics_daily.link_clicks + excluded.link_clicks,
    inquiry_starts = public.analytics_daily.inquiry_starts + excluded.inquiry_starts,
    completed_inquiries = public.analytics_daily.completed_inquiries + excluded.completed_inquiries;
end;
$$;

revoke all on function public.record_creator_analytics(text, text, text) from public, anon, authenticated;
grant execute on function public.record_creator_analytics(text, text, text) to service_role;