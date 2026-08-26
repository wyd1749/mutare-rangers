create extension if not exists "pgcrypto";

create table if not exists public.players (
  id text primary key,
  name text not null,
  number integer not null default 0,
  position text not null default '',
  player_group text not null default 'Guard',
  team text not null default '',
  photo text not null default '',
  age integer,
  dob text not null default '',
  nationality text not null default '',
  height text not null default '',
  weight text not null default '',
  college text not null default '',
  years_pro integer not null default 0,
  joined text not null default '',
  bio text not null default '',
  stats jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.news (
  id text primary key,
  title text not null,
  date text not null,
  excerpt text not null default '',
  category text not null default '',
  image text not null default '',
  body text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  price text not null default '',
  image text not null default '',
  category text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists players_set_updated_at on public.players;
create trigger players_set_updated_at before update on public.players
for each row execute function public.set_updated_at();

drop trigger if exists news_set_updated_at on public.news;
create trigger news_set_updated_at before update on public.news
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

alter table public.players enable row level security;
alter table public.news enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can read players" on public.players;
create policy "Public can read players" on public.players for select using (true);
drop policy if exists "Public can read news" on public.news;
create policy "Public can read news" on public.news for select using (true);
drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products for select using (true);
