-- =============================================================
-- KILLAH v2 migration — Supabase SQL Editor дээр нэг удаа RUN.
-- Хуучин датаг эвдэхгүй (add column if not exists).
-- =============================================================

-- 1. Habit төрөл: build (сайн) / break (хорт)
alter table habits add column if not exists kind text not null default 'build';
alter table habits drop constraint if exists habits_kind_check;
alter table habits add constraint habits_kind_check check (kind in ('build','break'));

-- habit_logs.done утгын тайлбар:
--   build habit → done=true : хийсэн
--   break habit → done=true : ТЭССЭН (сайн),  done=false : АВТСАН (муу)
--   record байхгүй = тухайн өдөр тэмдэглээгүй
-- (шинэ багана хэрэггүй)

-- 2. Life items — family / money / skill / read / watch bucket
create table if not exists life_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket text not null check (bucket in ('family','money','skill','read','watch')),
  title text not null,
  note text,
  status text default 'todo',          -- todo / doing / done
  emoji text default '•',
  due_date date,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table life_items enable row level security;
drop policy if exists "own life_items" on life_items;
create policy "own life_items" on life_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- projects table нь "Ажил" bucket-ын үүрэг гүйцэтгэнэ (өөрчлөх шаардлагагүй).
