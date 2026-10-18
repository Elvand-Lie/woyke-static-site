begin;

alter table public.consultation_requests
  add column if not exists reference text,
  add column if not exists product_id uuid references public.products(id) on delete set null,
  add column if not exists saved_design_id uuid references public.saved_designs(id) on delete set null;

update public.consultation_requests
set reference = 'WC-' || upper(substr(replace(id::text, '-', ''), 1, 12))
where reference is null;

alter table public.consultation_requests
  alter column reference set not null;

create unique index if not exists consultation_requests_reference_idx
  on public.consultation_requests(reference);
create index if not exists consultation_requests_product_idx
  on public.consultation_requests(product_id) where product_id is not null;
create index if not exists consultation_requests_design_idx
  on public.consultation_requests(saved_design_id) where saved_design_id is not null;

commit;