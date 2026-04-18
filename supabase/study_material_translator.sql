-- Study Material Translator schema
-- Run this after profiles.sql/platform.sql.

create table if not exists public.uploaded_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  file_name text,
  file_path text,
  mime_type text,
  character_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.translation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  uploaded_document_id uuid references public.uploaded_documents(id) on delete set null,
  title text not null,
  source_language text not null,
  target_language text not null,
  original_text text not null,
  translated_text text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.translation_chunks (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.translation_jobs(id) on delete cascade,
  chunk_index integer not null,
  source_text text not null,
  translated_text text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (job_id, chunk_index)
);

alter table public.uploaded_documents enable row level security;
alter table public.translation_jobs enable row level security;
alter table public.translation_chunks enable row level security;

drop policy if exists "user_uploaded_documents" on public.uploaded_documents;
create policy "user_uploaded_documents"
on public.uploaded_documents
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_translation_jobs" on public.translation_jobs;
create policy "user_translation_jobs"
on public.translation_jobs
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_translation_chunks" on public.translation_chunks;
create policy "user_translation_chunks"
on public.translation_chunks
for all
to authenticated
using (
  exists (
    select 1
    from public.translation_jobs
    where translation_jobs.id = translation_chunks.job_id
      and translation_jobs.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.translation_jobs
    where translation_jobs.id = translation_chunks.job_id
      and translation_jobs.user_id = auth.uid()
  )
);

create index if not exists uploaded_documents_user_id_idx on public.uploaded_documents(user_id, created_at desc);
create index if not exists translation_jobs_user_id_idx on public.translation_jobs(user_id, created_at desc);
create index if not exists translation_jobs_status_idx on public.translation_jobs(status);
create index if not exists translation_chunks_job_id_idx on public.translation_chunks(job_id, chunk_index);
