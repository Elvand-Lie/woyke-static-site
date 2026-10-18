begin;

drop index public.saved_designs_owner_client_sync_idx;
create unique index saved_designs_owner_client_sync_idx
  on public.saved_designs(owner_id, client_sync_id);

commit;