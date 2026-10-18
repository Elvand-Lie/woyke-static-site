begin;

update public.categories as category
set name = correction.name
from (values
  ('ring', 'Rings'),
  ('stud-earring', 'Stud Earrings'),
  ('dangling-earring', 'Dangling Earrings'),
  ('pendant', 'Pendants'),
  ('necklace', 'Necklaces'),
  ('bracelet', 'Bracelets'),
  ('bangle', 'Bangles'),
  ('brooch', 'Brooches'),
  ('anklet', 'Anklets')
) as correction(slug, name)
where category.slug = correction.slug;

commit;