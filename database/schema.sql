create table if not exists bookings (
  id uuid primary key,
  confirmation varchar(32) unique not null,
  property_id varchar(80) not null,
  guest_name varchar(160) not null,
  email varchar(255) not null,
  phone varchar(80),
  check_in date not null,
  check_out date not null,
  guests integer not null check (guests > 0),
  total numeric(12,2) not null check (total >= 0),
  status varchar(40) not null default 'confirmed',
  created_at timestamptz not null default now(),
  constraint valid_booking_dates check (check_out > check_in)
);

create index if not exists bookings_property_dates_idx
  on bookings(property_id, check_in, check_out);

create table if not exists leads (
  id uuid primary key,
  kind varchar(40) not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key,
  conversation_id varchar(100) not null,
  author varchar(40) not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx
  on messages(conversation_id, created_at);

create table if not exists webhook_events (
  id uuid primary key,
  provider varchar(80) not null,
  external_id varchar(255),
  payload jsonb not null,
  received_at timestamptz not null default now()
);
