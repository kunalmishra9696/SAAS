alter table public.brand_inquiries
  add column if not exists compensation_type text not null default 'cash'
  check (compensation_type in ('cash','barter','affiliate','mixed'));