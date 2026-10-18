begin;

-- Production completion primitives. The seeded inventory below is explicitly
-- marked as a development fixture and must be replaced before live mode.
alter table public.orders
  add column if not exists checkout_session_id text unique,
  add column if not exists checkout_expires_at timestamptz;

create table if not exists public.inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  inventory_id uuid not null references public.inventory(id),
  quantity integer not null check (quantity > 0),
  status text not null default 'active'
    check (status in ('active', 'consumed', 'released')),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  released_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (order_id, inventory_id)
);
create index if not exists inventory_reservations_status_expiry_idx
  on public.inventory_reservations(status, expires_at);

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  preferred_date date,
  preferred_time text,
  channel text not null default 'video'
    check (channel in ('video', 'phone', 'in_person')),
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index if not exists consultation_requests_status_created_idx
  on public.consultation_requests(status, created_at desc);

create trigger set_inventory_reservations_updated_at
  before update on public.inventory_reservations
  for each row execute function public.set_updated_at();
create trigger set_consultation_requests_updated_at
  before update on public.consultation_requests
  for each row execute function public.set_updated_at();

alter table public.inventory_reservations enable row level security;
alter table public.consultation_requests enable row level security;

create policy inventory_reservations_owner_read on public.inventory_reservations
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.owner_id = auth.uid() or public.is_admin())
    )
  );
create policy consultation_requests_owner_read on public.consultation_requests
  for select using (owner_id = auth.uid() or public.is_admin());

create or replace function public.reserve_order_inventory(
  target_order_id uuid,
  reservation_minutes integer default 30
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  line record;
  available integer;
begin
  if reservation_minutes < 5 or reservation_minutes > 1440 then
    raise exception 'invalid reservation window';
  end if;

  for line in
    select oi.sku_id, sum(oi.quantity)::integer as quantity
    from public.order_items oi
    where oi.order_id = target_order_id and oi.sku_id is not null
    group by oi.sku_id
    order by oi.sku_id
  loop
    select quantity_on_hand - quantity_reserved
      into available
    from public.inventory
    where sku_id = line.sku_id
    for update;

    if available is null or available < line.quantity then
      raise exception 'insufficient inventory for sku %', line.sku_id;
    end if;

    update public.inventory
      set quantity_reserved = quantity_reserved + line.quantity
      where sku_id = line.sku_id;

    insert into public.inventory_reservations (
      order_id, inventory_id, quantity, status, expires_at
    )
    select target_order_id, id, line.quantity, 'active',
      timezone('utc', now()) + make_interval(mins => reservation_minutes)
    from public.inventory
    where sku_id = line.sku_id
    on conflict (order_id, inventory_id) do nothing;
  end loop;

  update public.orders
    set checkout_expires_at = timezone('utc', now()) + make_interval(mins => reservation_minutes)
    where id = target_order_id;
end;
$$;

create or replace function public.release_order_inventory(target_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  reservation record;
begin
  for reservation in
    select id, inventory_id, quantity
    from public.inventory_reservations
    where order_id = target_order_id and status = 'active'
    for update
  loop
    update public.inventory
      set quantity_reserved = greatest(0, quantity_reserved - reservation.quantity)
      where id = reservation.inventory_id;
    update public.inventory_reservations
      set status = 'released', released_at = timezone('utc', now())
      where id = reservation.id;
  end loop;
end;
$$;

create or replace function public.consume_order_inventory(target_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  reservation record;
begin
  for reservation in
    select id, inventory_id, quantity
    from public.inventory_reservations
    where order_id = target_order_id and status = 'active'
    for update
  loop
    update public.inventory
      set quantity_on_hand = greatest(0, quantity_on_hand - reservation.quantity),
          quantity_reserved = greatest(0, quantity_reserved - reservation.quantity)
      where id = reservation.inventory_id;
    update public.inventory_reservations
      set status = 'consumed', consumed_at = timezone('utc', now())
      where id = reservation.id;
  end loop;
end;
$$;

create or replace function public.release_expired_inventory_reservations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  target record;
  released integer := 0;
begin
  for target in
    select distinct order_id
    from public.inventory_reservations
    where status = 'active' and expires_at <= timezone('utc', now())
  loop
    perform public.release_order_inventory(target.order_id);
    update public.orders
      set status = 'cancelled', payment_status = 'cancelled'
      where id = target.order_id and payment_status = 'pending';
    released := released + 1;
  end loop;
  return released;
end;
$$;

revoke all on function public.reserve_order_inventory(uuid, integer) from public;
revoke all on function public.release_order_inventory(uuid) from public;
revoke all on function public.consume_order_inventory(uuid) from public;
revoke all on function public.release_expired_inventory_reservations() from public;
grant execute on function public.reserve_order_inventory(uuid, integer) to service_role;
grant execute on function public.release_order_inventory(uuid) to service_role;
grant execute on function public.consume_order_inventory(uuid) to service_role;
grant execute on function public.release_expired_inventory_reservations() to service_role;

-- Publish the validated configurator definition. Pricing remains database-owned.
update public.configurator_forms
set status = 'published'
where slug = 'woyke-guided';

insert into public.pricing_rules (form_id, name, condition_rule, adjustment_minor, priority, is_active)
select id, 'Personal engraving', '{"all":[{"field":"_engraving","operator":"equals","value":"yes"}]}'::jsonb, 5000, 100, true
from public.configurator_forms where slug = 'woyke-guided'
on conflict (form_id, name) do update
set condition_rule = excluded.condition_rule, adjustment_minor = excluded.adjustment_minor, is_active = true;

-- Development-project fixture stock for Stripe test-mode acceptance only.
update public.skus
set is_active = true,
    metadata = metadata || '{"inventory_source":"development_fixture","live_sale_approved":false}'::jsonb
where product_id in (select id from public.products where status = 'published');

update public.inventory
set quantity_on_hand = 20,
    quantity_reserved = 0
where sku_id in (
  select id from public.skus
  where metadata->>'inventory_source' = 'development_fixture'
);

insert into public.content_blocks (key, locale, title, body, status, published_at)
values (
  'commerce.test_mode_notice',
  'en-SG',
  'Test checkout',
  '{"text":"Payments and inventory currently run in Stripe test mode using clearly labelled development stock."}'::jsonb,
  'published',
  timezone('utc', now())
)
on conflict (key, locale) do update
set title = excluded.title, body = excluded.body, status = excluded.status,
    published_at = excluded.published_at;

commit;
