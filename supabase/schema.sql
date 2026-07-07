-- =============================================================
-- KILLAH tracker — Supabase schema
-- Supabase → SQL Editor → энэ бүхнийг paste хийж RUN дар.
-- =============================================================

-- 1. PROFILES (level / xp)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text default 'killah',
  xp int not null default 0,
  created_at timestamptz default now()
);

-- 2. HABITS
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  emoji text default '🔥',
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- 3. HABIT LOGS (өдөр бүрийн чек)
create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references habits(id) on delete cascade,
  log_date date not null,
  done boolean not null default true,
  unique (habit_id, log_date)
);

-- 4. DAILY LOGS (mood / нойр / энерги)
create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  mood int check (mood between 1 and 5),
  sleep_hours numeric(3,1),
  energy int check (energy between 1 and 5),
  note text,
  unique (user_id, log_date)
);

-- 5. PROJECTS
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text default '#FF7A45',
  archived boolean default false,
  created_at timestamptz default now()
);

-- 6. TASKS
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  done boolean default false,
  due_date date,
  created_at timestamptz default now()
);

-- =============================================================
-- ROW LEVEL SECURITY — хэн ч зөвхөн ӨӨРИЙН датаг харна
-- =============================================================
alter table profiles    enable row level security;
alter table habits      enable row level security;
alter table habit_logs  enable row level security;
alter table daily_logs  enable row level security;
alter table projects    enable row level security;
alter table tasks       enable row level security;

-- profiles
create policy "own profile select" on profiles for select using (auth.uid() = id);
create policy "own profile insert" on profiles for insert with check (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);

-- generic owner policies
create policy "own habits"     on habits     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own habit_logs" on habit_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own daily_logs" on daily_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own projects"   on projects   for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own tasks"      on tasks      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =============================================================
-- AUTO-CREATE profile хэрэглэгч бүртгүүлэхэд
-- =============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- SEED — анхны habit-ууд (эхний хэрэглэгчдэд заавал биш).
-- Login хийсний дараа UI-аас нэмж болно.
-- =============================================================
