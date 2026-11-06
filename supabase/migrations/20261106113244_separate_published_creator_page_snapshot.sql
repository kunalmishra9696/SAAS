alter table public.creator_pages
  add column if not exists published_data jsonb,
  add column if not exists published_theme jsonb;

update public.creator_pages
   set published_data = page_data,
       published_theme = theme
 where status = 'published'
   and published_data is null;