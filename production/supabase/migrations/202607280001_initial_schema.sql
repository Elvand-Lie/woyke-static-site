begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  phone text,
  preferred_locale text not null default 'en-SG',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('customer', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, role)
);

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Delivery',
  recipient_name text not null,
  phone text,
  address_line_1 text not null,
  address_line_2 text,
  city text not null,
  region text,
  postal_code text not null,
  country_code char(2) not null default 'SG',
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index customer_addresses_user_id_idx on public.customer_addresses(user_id);
create unique index customer_addresses_one_default_idx
  on public.customer_addresses(user_id) where is_default;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id),
  slug text not null unique,
  name text not null,
  description text not null default '',
  base_price_minor integer not null check (base_price_minor >= 0),
  currency char(3) not null default 'SGD',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  customizable boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index products_category_id_idx on public.products(category_id);
create index products_status_sort_idx on public.products(status, sort_order);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text,
  url text not null,
  alt_text text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  role text not null default 'gallery' check (role in ('primary', 'gallery', 'detail', 'social')),
  match_quality text not null default 'representative'
    check (match_quality in ('exact', 'representative', 'fallback')),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (product_id, url)
);
create index product_media_product_sort_idx on public.product_media(product_id, sort_order);

create table public.skus (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  code text not null unique,
  option_signature text not null default 'base',
  price_minor integer not null check (price_minor >= 0),
  currency char(3) not null default 'SGD',
  is_active boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (product_id, option_signature)
);
create index skus_product_id_idx on public.skus(product_id);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  sku_id uuid not null unique references public.skus(id) on delete cascade,
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0),
  low_stock_threshold integer not null default 0 check (low_stock_threshold >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (quantity_reserved <= quantity_on_hand)
);

create table public.inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  inventory_id uuid not null references public.inventory(id) on delete cascade,
  delta integer not null check (delta <> 0),
  reason text not null,
  reference_type text,
  reference_id uuid,
  actor_id uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index inventory_adjustments_inventory_created_idx
  on public.inventory_adjustments(inventory_id, created_at desc);

create table public.configurator_forms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  version integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (slug, version)
);

create table public.configurator_components (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.configurator_forms(id) on delete cascade,
  slug text not null,
  name text not null,
  description text,
  component_type text not null,
  display_step integer not null,
  sort_order integer not null,
  is_required boolean not null default true,
  condition_rule jsonb not null default '{}'::jsonb,
  guide jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (form_id, slug)
);
create index configurator_components_form_sort_idx
  on public.configurator_components(form_id, sort_order);

create table public.configurator_options (
  id uuid primary key default gen_random_uuid(),
  component_id uuid not null references public.configurator_components(id) on delete cascade,
  slug text not null,
  value text not null,
  label text not null,
  description text,
  price_delta_minor integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  sort_order integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (component_id, value)
);
create index configurator_options_component_sort_idx
  on public.configurator_options(component_id, sort_order);

create table public.valid_option_combinations (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.configurator_forms(id) on delete cascade,
  name text not null,
  selection_rule jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (form_id, name)
);

create table public.pricing_rules (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.configurator_forms(id) on delete cascade,
  name text not null,
  condition_rule jsonb not null,
  adjustment_minor integer not null,
  currency char(3) not null default 'SGD',
  priority integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (form_id, name)
);
create index pricing_rules_form_priority_idx on public.pricing_rules(form_id, priority);

create table public.saved_designs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id),
  name text not null,
  currency char(3) not null default 'SGD',
  indicative_total_minor integer not null default 0 check (indicative_total_minor >= 0),
  preview jsonb not null default '{}'::jsonb,
  public_snapshot jsonb not null default '{}'::jsonb,
  share_token uuid not null default gen_random_uuid() unique,
  is_public boolean not null default false,
  revoked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index saved_designs_owner_updated_idx on public.saved_designs(owner_id, updated_at desc);

create table public.saved_design_selections (
  id uuid primary key default gen_random_uuid(),
  saved_design_id uuid not null references public.saved_designs(id) on delete cascade,
  component_slug text not null,
  option_value text,
  value_json jsonb,
  price_delta_minor integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (saved_design_id, component_slug)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  guest_token uuid,
  currency char(3) not null default 'SGD',
  status text not null default 'active' check (status in ('active', 'converted', 'abandoned')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check ((owner_id is not null) <> (guest_token is not null))
);
create unique index carts_active_owner_idx on public.carts(owner_id)
  where owner_id is not null and status = 'active';
create unique index carts_active_guest_idx on public.carts(guest_token)
  where guest_token is not null and status = 'active';

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id),
  sku_id uuid references public.skus(id),
  saved_design_id uuid references public.saved_designs(id) on delete set null,
  configuration_fingerprint text not null,
  quantity integer not null check (quantity > 0),
  unit_price_minor integer not null check (unit_price_minor >= 0),
  configuration_snapshot jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (cart_id, configuration_fingerprint)
);
create index cart_items_cart_id_idx on public.cart_items(cart_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  owner_id uuid not null references public.profiles(id),
  cart_id uuid references public.carts(id),
  status text not null default 'payment_pending'
    check (status in ('payment_pending', 'confirmed', 'crafting', 'ready', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded')),
  fulfillment_status text not null default 'unfulfilled'
    check (fulfillment_status in ('unfulfilled', 'crafting', 'ready', 'shipped', 'delivered', 'cancelled')),
  currency char(3) not null default 'SGD',
  subtotal_minor integer not null check (subtotal_minor >= 0),
  shipping_minor integer not null default 0 check (shipping_minor >= 0),
  tax_minor integer not null default 0 check (tax_minor >= 0),
  total_minor integer not null check (total_minor >= 0),
  shipping_address_snapshot jsonb not null,
  customer_snapshot jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index orders_owner_created_idx on public.orders(owner_id, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  sku_id uuid references public.skus(id),
  product_name text not null,
  sku_code text,
  quantity integer not null check (quantity > 0),
  unit_price_minor integer not null check (unit_price_minor >= 0),
  line_total_minor integer not null check (line_total_minor >= 0),
  product_snapshot jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index order_items_order_id_idx on public.order_items(order_id);

create table public.order_configuration_snapshots (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null unique references public.order_items(id) on delete cascade,
  selections jsonb not null,
  pricing_breakdown jsonb not null,
  preview jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  provider text not null default 'stripe',
  provider_payment_id text unique,
  status text not null check (status in ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
  amount_minor integer not null check (amount_minor >= 0),
  currency char(3) not null default 'SGD',
  failure_code text,
  failure_message text,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index payments_order_id_idx on public.payments(order_id);

create table public.stripe_event_records (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  processing_status text not null default 'received'
    check (processing_status in ('received', 'processed', 'ignored', 'failed')),
  attempts integer not null default 0,
  processed_at timestamptz,
  last_error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  actor_id uuid references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index order_status_history_order_created_idx
  on public.order_status_history(order_id, created_at);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  request_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index admin_audit_logs_actor_created_idx
  on public.admin_audit_logs(actor_id, created_at desc);

create table public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  locale text not null default 'en-SG',
  title text,
  body jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (key, locale)
);

create table public.translations (
  id uuid primary key default gen_random_uuid(),
  namespace text not null,
  key text not null,
  locale text not null,
  value text not null,
  status text not null default 'draft' check (status in ('draft', 'approved')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (namespace, key, locale)
);

create or replace function public.is_admin(candidate uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.roles
    where user_id = candidate and role = 'admin'
  );
$$;

create or replace function public.get_shared_design(token uuid)
returns table (
  id uuid,
  name text,
  public_snapshot jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select d.id, d.name, d.public_snapshot, d.created_at, d.updated_at
  from public.saved_designs d
  where d.share_token = token
    and d.is_public
    and d.revoked_at is null;
$$;

revoke all on function public.get_shared_design(uuid) from public;
grant execute on function public.get_shared_design(uuid) to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, phone, display_name)
  values (
    new.id,
    new.email,
    new.phone,
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  );
  insert into public.roles (user_id, role) values (new.id, 'customer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'roles', 'customer_addresses', 'categories', 'products',
    'product_media', 'skus', 'inventory', 'inventory_adjustments',
    'configurator_forms', 'configurator_components', 'configurator_options',
    'valid_option_combinations', 'pricing_rules', 'saved_designs',
    'saved_design_selections', 'carts', 'cart_items', 'orders', 'order_items',
    'order_configuration_snapshots', 'payments', 'stripe_event_records',
    'order_status_history', 'admin_audit_logs', 'content_blocks', 'translations'
  ]
  loop
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.skus enable row level security;
alter table public.inventory enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.configurator_forms enable row level security;
alter table public.configurator_components enable row level security;
alter table public.configurator_options enable row level security;
alter table public.valid_option_combinations enable row level security;
alter table public.pricing_rules enable row level security;
alter table public.saved_designs enable row level security;
alter table public.saved_design_selections enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_configuration_snapshots enable row level security;
alter table public.payments enable row level security;
alter table public.stripe_event_records enable row level security;
alter table public.order_status_history enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.content_blocks enable row level security;
alter table public.translations enable row level security;

create policy profiles_select_own on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = auth.uid())
  with check (id = auth.uid());
create policy roles_select_own on public.roles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

create policy addresses_select_own on public.customer_addresses
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy addresses_insert_own on public.customer_addresses
  for insert to authenticated with check (user_id = auth.uid());
create policy addresses_update_own on public.customer_addresses
  for update to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid());
create policy addresses_delete_own on public.customer_addresses
  for delete to authenticated using (user_id = auth.uid());

create policy categories_public_read on public.categories
  for select to anon, authenticated using (is_active);
create policy products_public_read on public.products
  for select to anon, authenticated using (status = 'published');
create policy product_media_public_read on public.product_media
  for select to anon, authenticated using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
  );
create policy skus_public_read on public.skus
  for select to anon, authenticated using (
    is_active and exists (
      select 1 from public.products p
      where p.id = product_id and p.status = 'published'
    )
  );
create policy inventory_public_read on public.inventory
  for select to anon, authenticated using (
    exists (
      select 1 from public.skus s
      join public.products p on p.id = s.product_id
      where s.id = sku_id and s.is_active and p.status = 'published'
    )
  );

create policy forms_public_read on public.configurator_forms
  for select to anon, authenticated using (status = 'published');
create policy components_public_read on public.configurator_components
  for select to anon, authenticated using (
    exists (
      select 1 from public.configurator_forms f
      where f.id = form_id and f.status = 'published'
    )
  );
create policy options_public_read on public.configurator_options
  for select to anon, authenticated using (
    is_active and exists (
      select 1
      from public.configurator_components c
      join public.configurator_forms f on f.id = c.form_id
      where c.id = component_id and f.status = 'published'
    )
  );
create policy combinations_public_read on public.valid_option_combinations
  for select to anon, authenticated using (
    is_active and exists (
      select 1 from public.configurator_forms f
      where f.id = form_id and f.status = 'published'
    )
  );
create policy pricing_public_read on public.pricing_rules
  for select to anon, authenticated using (
    is_active and exists (
      select 1 from public.configurator_forms f
      where f.id = form_id and f.status = 'published'
    )
  );

create policy saved_designs_own_all on public.saved_designs
  for all to authenticated using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
create policy design_selections_own_all on public.saved_design_selections
  for all to authenticated
  using (
    exists (
      select 1 from public.saved_designs d
      where d.id = saved_design_id and d.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.saved_designs d
      where d.id = saved_design_id and d.owner_id = auth.uid()
    )
  );

create policy carts_own_all on public.carts
  for all to authenticated using (owner_id = auth.uid())
  with check (owner_id = auth.uid() and guest_token is null);
create policy cart_items_own_all on public.cart_items
  for all to authenticated
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.carts c
      where c.id = cart_id and c.owner_id = auth.uid()
    )
  );

create policy orders_read_own on public.orders
  for select to authenticated using (owner_id = auth.uid() or public.is_admin());
create policy order_items_read_own on public.order_items
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.owner_id = auth.uid() or public.is_admin())
    )
  );
create policy order_snapshots_read_own on public.order_configuration_snapshots
  for select to authenticated using (
    exists (
      select 1
      from public.order_items oi
      join public.orders o on o.id = oi.order_id
      where oi.id = order_item_id
        and (o.owner_id = auth.uid() or public.is_admin())
    )
  );
create policy payments_read_own on public.payments
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.owner_id = auth.uid() or public.is_admin())
    )
  );
create policy order_history_read_own on public.order_status_history
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.owner_id = auth.uid() or public.is_admin())
    )
  );

create policy content_blocks_public_read on public.content_blocks
  for select to anon, authenticated using (status = 'published');
create policy translations_public_read on public.translations
  for select to anon, authenticated using (status = 'approved');
create policy audit_logs_admin_read on public.admin_audit_logs
  for select to authenticated using (public.is_admin());
create policy adjustments_admin_read on public.inventory_adjustments
  for select to authenticated using (public.is_admin());

commit;
