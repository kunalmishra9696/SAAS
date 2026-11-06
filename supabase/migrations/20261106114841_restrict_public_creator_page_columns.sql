drop policy if exists creator_pages_public_or_owner_read on public.creator_pages;

drop policy if exists creator_pages_owner_select on public.creator_pages;
create policy creator_pages_owner_select on public.creator_pages
for select to authenticated
using ((select auth.uid()) = creator_id);

revoke select on public.creator_pages from anon;
grant select on public.creator_pages to authenticated;

create or replace view public.public_creator_pages
with (security_barrier = true)
as
select
  handle,
  published_data,
  published_theme
from public.creator_pages
where status = 'published'
  and published_data is not null;

revoke all on public.public_creator_pages from public;
grant select on public.public_creator_pages to anon, authenticated;
