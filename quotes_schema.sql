-- Create quotes table
create table if not exists quotes (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  created_by uuid references user_profiles(id),
  total_amount numeric(10,2) not null,
  notes text,
  created_at timestamptz default now()
);

alter table quotes enable row level security;

create policy "Users can view own order quotes" on quotes for select using (
  exists (select 1 from orders where id = quotes.order_id and user_id = auth.uid())
);

create policy "Admins can manage quotes" on quotes for all using (
  exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
);

-- Create quote_items table
create table if not exists quote_items (
  id uuid default gen_random_uuid() primary key,
  quote_id uuid references quotes(id) on delete cascade,
  order_item_id uuid references order_items(id),
  product_name text not null,
  unit text not null,
  quantity numeric(10,2) not null,
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null
);

alter table quote_items enable row level security;

create policy "Users can view own quote items" on quote_items for select using (
  exists (select 1 from quotes join orders on quotes.order_id = orders.id where quotes.id = quote_items.quote_id and orders.user_id = auth.uid())
);

create policy "Admins can manage quote items" on quote_items for all using (
  exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
);

-- Add quote_sent status to orders if needed
-- alter table orders add column if not exists quote_sent boolean default false;
-- alter table orders add column if not exists quote_sent_at timestamptz;