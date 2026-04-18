-- AI Mentor chat history schema
-- Run this after profiles.sql.

create table if not exists public.ai_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  response text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.ai_chats enable row level security;

drop policy if exists "ai_chats_select_own" on public.ai_chats;
create policy "ai_chats_select_own"
on public.ai_chats
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "ai_chats_insert_own" on public.ai_chats;
create policy "ai_chats_insert_own"
on public.ai_chats
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "ai_chats_update_own" on public.ai_chats;
create policy "ai_chats_update_own"
on public.ai_chats
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "ai_chats_delete_own" on public.ai_chats;
create policy "ai_chats_delete_own"
on public.ai_chats
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists ai_chats_user_created_at_idx
on public.ai_chats(user_id, created_at desc);
