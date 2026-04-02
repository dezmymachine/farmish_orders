-- Drop old trigger to prevent conflicts
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

-- Drop old profiles table if it exists
drop table if exists profiles cascade;

-- Create new user_profiles table for extra user data
create table user_profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  organisation text,
  phone text,
  contact text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table user_profiles enable row level security;

-- RLS Policies
create policy "Users can view own profile" 
  on user_profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on user_profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on user_profiles for insert 
  with check (auth.uid() = id);

create policy "Admins can view all profiles" 
  on user_profiles for select 
  using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update all profiles" 
  on user_profiles for update 
  using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

-- Update orders table to reference user_profiles
alter table orders 
  drop constraint if exists orders_user_id_fkey,
  add constraint orders_user_id_fkey 
  foreign key (user_id) references user_profiles(id) on delete set null;

-- Update orders RLS policies to use user_profiles
drop policy if exists "Users can view own orders" on orders;
drop policy if exists "Users can insert own orders" on orders;
drop policy if exists "Admins can view all orders" on orders;
drop policy if exists "Admins can update all orders" on orders;

create policy "Users can view own orders" 
  on orders for select 
  using (auth.uid() = user_id);

create policy "Users can insert own orders" 
  on orders for insert 
  with check (auth.uid() = user_id);

create policy "Admins can view all orders" 
  on orders for select 
  using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update all orders" 
  on orders for update 
  using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

-- Update order_items RLS policies
drop policy if exists "Users can view own order items" on order_items;
drop policy if exists "Users can insert own order items" on order_items;
drop policy if exists "Admins can view all order items" on order_items;

create policy "Users can view own order items" 
  on order_items for select 
  using (
    exists (select 1 from orders where id = order_id and user_id = auth.uid())
  );

create policy "Users can insert own order items" 
  on order_items for insert 
  with check (
    exists (select 1 from orders where id = order_id and user_id = auth.uid())
  );

create policy "Admins can view all order items" 
  on order_items for select 
  using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );

-- Update products RLS policies
drop policy if exists "Admins can manage products" on products;

create policy "Admins can manage products" 
  on products for all 
  using (
    exists (select 1 from user_profiles where id = auth.uid() and role = 'admin')
  );
