-- 04 - Data model baseline (PostgreSQL)

create table users (
  id uuid primary key,
  email varchar(255) unique not null,
  full_name varchar(180),
  phone varchar(32),
  password_hash text,
  auth_provider varchar(40) default 'local',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key,
  slug varchar(120) unique not null,
  name varchar(180) not null,
  description text,
  thumbnail_url text,
  trailer_url text,
  status varchar(20) not null default 'active',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table offers (
  id uuid primary key,
  product_id uuid not null references products(id),
  name varchar(140) not null,
  price_cents int not null,
  currency char(3) not null default 'BRL',
  billing_provider varchar(40) not null,
  external_offer_id varchar(120) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table orders (
  id uuid primary key,
  user_id uuid not null references users(id),
  provider varchar(40) not null,
  provider_order_id varchar(120) not null,
  status varchar(30) not null,
  gross_amount_cents int not null,
  net_amount_cents int,
  currency char(3) not null default 'BRL',
  approved_at timestamptz,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider, provider_order_id)
);

create table order_items (
  id uuid primary key,
  order_id uuid not null references orders(id),
  product_id uuid not null references products(id),
  offer_id uuid references offers(id),
  quantity int not null default 1,
  unit_price_cents int not null,
  created_at timestamptz not null default now()
);

create table entitlements (
  id uuid primary key,
  user_id uuid not null references users(id),
  product_id uuid not null references products(id),
  source_order_id uuid references orders(id),
  status varchar(30) not null default 'active',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  revoked_reason varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create table modules (
  id uuid primary key,
  product_id uuid not null references products(id),
  title varchar(180) not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table lessons (
  id uuid primary key,
  module_id uuid not null references modules(id),
  title varchar(180) not null,
  media_url text,
  duration_seconds int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table lesson_progress (
  id uuid primary key,
  user_id uuid not null references users(id),
  lesson_id uuid not null references lessons(id),
  watched_seconds int not null default 0,
  completed boolean not null default false,
  last_position_seconds int not null default 0,
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create table recommendation_events (
  id uuid primary key,
  user_id uuid not null references users(id),
  event_type varchar(60) not null,
  product_id uuid references products(id),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table webhook_events (
  id uuid primary key,
  provider varchar(40) not null,
  event_id varchar(140) not null,
  event_type varchar(80) not null,
  payload jsonb not null,
  processed boolean not null default false,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(provider, event_id)
);

create index idx_entitlements_user on entitlements(user_id);
create index idx_orders_user on orders(user_id);
create index idx_products_status_sort on products(status, sort_order);
create index idx_progress_user on lesson_progress(user_id);

