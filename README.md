# Farm Orders - Premium Agricultural Produce Ordering Platform

A production-ready Next.js 14 (App Router) web application for a farm produce ordering platform. This platform operates on a **quote-based model** - customers submit orders with quantities only, and admins review and send quotes.

## Tech Stack

- **Framework**: Next.js 14 App Router (TypeScript)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Auth**: Supabase Auth (email/password)
- **Database**: Supabase (PostgreSQL)
- **Email**: Resend (react-email templates)
- **Notifications**: Telegram Bot API
- **State**: React Server Components + Server Actions

## Getting Started

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=orders@yourdomain.com
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Supabase Database Setup

Run the following SQL in your Supabase SQL Editor to create the required tables, triggers, and RLS policies:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;

-- RLS Policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Create trigger for new user
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Create products table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  unit text not null default 'kg',
  available boolean default true,
  created_at timestamptz default now()
);

alter table products enable row level security;
create policy "Anyone can view available products" on products for select using (available = true);
create policy "Admins can manage products" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Insert sample products
insert into products (name, category, unit) values
('Maize', 'Grains & Cereals', 'kg'),
('Onion', 'Vegetables', 'kg'),
('Green Pepper', 'Vegetables', 'kg'),
('Cassava', 'Tubers & Roots', 'kg'),
('Tomatoes', 'Vegetables', 'kg'),
('Tombrown', 'Processed', 'kg'),
('Ginger', 'Spices & Herbs', 'kg'),
('Garlic', 'Spices & Herbs', 'kg'),
('Beans', 'Legumes', 'kg'),
('Shrimp Powder', 'Seafood & Proteins', 'kg'),
('Fish Powder', 'Seafood & Proteins', 'kg'),
('Carrots (Local)', 'Vegetables', 'kg'),
('Waakye Leaves', 'Leaves & Herbs', 'bundle'),
('Palm Oil', 'Oils & Fats', 'liter'),
('Cassava Dough', 'Processed', 'kg'),
('Plantain (Green)', 'Fruits', 'bunch'),
('Garden Egg', 'Vegetables', 'kg'),
('Okro', 'Vegetables', 'kg'),
('Negro Pepper', 'Spices & Herbs', 'kg'),
('Soya Sauce', 'Condiments', 'bottle'),
('Local Spices', 'Spices & Herbs', 'pack'),
('Spring Onion', 'Vegetables', 'bunch'),
('Watermelon', 'Fruits', 'piece'),
('Local Spice Grinded', 'Spices & Herbs', 'pack');

-- Create order status enum
create type order_status as enum ('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered');

-- Create orders table
create table orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null default 'ORD-' || upper(substr(gen_random_uuid()::text, 1, 8)),
  user_id uuid references profiles(id) on delete set null,
  status order_status default 'pending',
  delivery_address text,
  delivery_notes text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table orders enable row level security;
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admins can view all orders" on orders for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can update all orders" on orders for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Create order_items table
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  unit text not null,
  quantity numeric(10,2) not null
);

alter table order_items enable row level security;
create policy "Users can view own order items" on order_items for select using (
  exists (select 1 from orders where id = order_id and user_id = auth.uid())
);
create policy "Users can insert own order items" on order_items for insert with check (
  exists (select 1 from orders where id = order_id and user_id = auth.uid())
);
create policy "Admins can view all order items" on order_items for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Create updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute procedure update_updated_at();
```

### 3. Setting Up the Admin User

After creating your account:

1. Go to your Supabase Dashboard
2. Navigate to the **Table Editor**
3. Find the `profiles` table
4. Find your user record and change `role` from `customer` to `admin`

### 4. Setting Up Telegram Bot

1. Start a chat with @BotFather on Telegram
2. Use `/newbot` to create a new bot
3. Copy the bot token
4. Start a chat with your bot and send a message
5. Get your chat ID by visiting `https://api.telegram.org/bot<TOKEN>/getUpdates`

### 5. Setting Up Resend

1. Sign up at https://resend.com
2. Add your domain and verify it
3. Create an API key
4. Update `RESEND_FROM_EMAIL` to use your verified domain

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

### Customer Features
- **Place Orders**: Browse products by category, select quantities, provide delivery details
- **Order Dashboard**: View all orders, see status, check order details
- **Quote-Based Model**: No prices shown to customers - they receive quotes after order review

### Admin Features
- **Dashboard**: View all orders with filtering and search
- **Status Management**: Update order status (pending → confirmed → processing → out_for_delivery → delivered)
- **Product Management**: Add, edit, toggle product availability

## Design System

- **Zero border radius** everywhere for a sharp, corporate aesthetic
- **Typography**: Barlow Condensed (headings), IBM Plex Sans (body), IBM Plex Mono (order numbers)
- **Color Palette**: Warm off-white background, deep agricultural green accents, stark black borders

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login & signup pages
│   ├── (customer)/        # Order form & dashboard
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/
│   ├── admin/             # Admin-specific components
│   ├── dashboard/         # Customer dashboard components
│   ├── order-form/        # Order form components
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── resend/            # Email templates
│   └── supabase/          # Supabase clients
└── types/                 # TypeScript types
```

## Notes

- This platform operates on a **quote-based model** - no prices are shown to customers
- All monetary references are only visible in the admin panel
- Telegram alerts are sent in Ghana local time (UTC+0)
