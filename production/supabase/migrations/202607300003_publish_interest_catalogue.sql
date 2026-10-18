begin;

update public.products
set status = 'published'
where slug in (
  'imperial-jade-bloom-ring',
  'jade-cabochon-statement-ring',
  'celestial-diamond-floral-ring',
  'cushion-brilliance-ring',
  'emerald-marquise-ring'
);

commit;