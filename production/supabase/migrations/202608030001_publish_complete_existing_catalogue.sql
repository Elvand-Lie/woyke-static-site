begin;

-- The production collection now exposes the complete existing 25-piece study
-- instead of the earlier five-piece interest-test subset. These records remain
-- explicitly provisional in metadata; SKUs stay inactive and inventory stays zero.
update public.products
set status = 'published'
where metadata ->> 'seedStatus' = 'provisional';

commit;