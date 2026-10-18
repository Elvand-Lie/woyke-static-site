begin;

alter table public.saved_designs
  add column client_sync_id text;

create unique index saved_designs_owner_client_sync_idx
  on public.saved_designs(owner_id, client_sync_id)
  where client_sync_id is not null;

update public.products
set status = 'published'
where slug in (
  'imperial-jade-bloom',
  'jade-cabochon-statement',
  'celestial-diamond-floral',
  'cushion-brilliance',
  'emerald-accent-marquise'
);

commit;
