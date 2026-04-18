-- OrbitPrep AI complete application schema
-- Run in Supabase SQL editor. Safe to run more than once.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  role text not null default 'student' check (role in ('student', 'editor', 'admin')),
  is_premium boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  razorpay_subscription_id text unique,
  razorpay_payment_id text,
  status text not null default 'created' check (status in ('created', 'authenticated', 'active', 'pending', 'halted', 'cancelled', 'completed', 'expired')),
  current_period_end timestamptz,
  provider text not null default 'razorpay',
  provider_customer_id text,
  provider_subscription_id text,
  provider_payment_id text,
  billing_window_start timestamptz,
  billing_window_end timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (exam_id, name)
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (subject_id, name)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics(id) on delete set null,
  question_text text not null,
  prompt text,
  options jsonb not null default '[]'::jsonb,
  structured_options jsonb,
  correct_answer text not null,
  structured_answer jsonb,
  explanation text,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  tags text[] not null default '{}',
  source_type text not null default 'manual' check (source_type in ('manual', 'AI', 'ai', 'previous_paper')),
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
  exam text,
  year integer,
  subject text,
  topic text,
  subtopic text,
  approved boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.question_translations (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  language text not null check (language in ('en','as','hi','bn','ta','te','kn','ml','mr','gu','pa','or')),
  status text not null default 'pending_review' check (status in ('pending_review','approved','rejected')),
  translated_prompt text not null,
  translated_options jsonb not null default '[]'::jsonb,
  translated_explanation text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (question_id, language)
);

create table if not exists public.daily_questions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  display_date date not null default current_date,
  sort_order integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (question_id, display_date)
);

create table if not exists public.mock_tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration_minutes integer not null default 60,
  is_premium boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  exam_id uuid references public.exams(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  exam text,
  subject text,
  language text not null default 'en' check (language in ('en','as','hi','bn','ta','te','kn','ml','mr','gu','pa','or')),
  tags text[] not null default '{}',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mock_test_questions (
  mock_test_id uuid not null references public.mock_tests(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  position integer not null,
  marks numeric not null default 1,
  negative_marks numeric not null default 0,
  primary key (mock_test_id, question_id)
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mock_test_id text not null,
  mock_test_uuid uuid references public.mock_tests(id) on delete set null,
  total_questions integer not null default 0,
  correct_answers integer not null default 0,
  wrong_answers integer not null default 0,
  unanswered integer not null default 0,
  score_percent integer not null default 0,
  accuracy numeric not null default 0,
  topic_breakdown jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default timezone('utc', now()),
  submitted_at timestamptz,
  time_spent_seconds integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.test_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id text not null,
  question_uuid uuid references public.questions(id) on delete set null,
  selected_answer text,
  is_correct boolean not null default false,
  marks_awarded numeric not null default 0,
  time_spent_seconds integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'test_attempts' and column_name = 'mock_test_id' and data_type = 'uuid'
  ) then
    alter table public.test_attempts drop constraint if exists test_attempts_mock_test_id_fkey;
    alter table public.test_attempts alter column mock_test_id type text using mock_test_id::text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'test_attempts' and column_name = 'mock_test_uuid'
  ) then
    alter table public.test_attempts add column mock_test_uuid uuid references public.mock_tests(id) on delete set null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'test_answers' and column_name = 'question_id' and data_type = 'uuid'
  ) then
    alter table public.test_answers drop constraint if exists test_answers_question_id_fkey;
    alter table public.test_answers alter column question_id type text using question_id::text;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'test_answers' and column_name = 'question_uuid'
  ) then
    alter table public.test_answers add column question_uuid uuid references public.questions(id) on delete set null;
  end if;
end $$;

create table if not exists public.pdfs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  source_type text not null default 'manual' check (source_type in ('manual', 'AI', 'ai', 'previous_paper')),
  is_premium boolean not null default false,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
  exam_id uuid references public.exams(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  storage_path text,
  tags text[] not null default '{}',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.current_affairs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  category text,
  published_date date not null default current_date,
  tags text[] not null default '{}',
  quiz_questions text,
  is_premium boolean not null default false,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
  exam_id uuid references public.exams(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('questions', 'current_affairs', 'revision_notes', 'pdf')),
  title text not null,
  prompt text not null,
  output text not null,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
  is_premium boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ai_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  response text not null,
  created_at timestamptz not null default timezone('utc', now())
);

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

create table if not exists public.content_sources (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('manual','url','pdf','news','previous_paper')),
  title text not null,
  source_url text,
  raw_text text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.content_sources(id) on delete set null,
  content_type text not null check (content_type in ('current_affairs','revision_notes','pdf','article')),
  exam_tags text[] not null default '{}',
  state_tags text[] not null default '{}',
  subject_tags text[] not null default '{}',
  title text not null,
  slug text not null unique,
  summary text not null,
  body jsonb not null default '{}'::jsonb,
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  status text not null default 'draft' check (status in ('draft','in_review','approved','rejected','published','archived')),
  visibility text not null default 'free' check (visibility in ('free','premium')),
  ai_metadata jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.content_translations (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  language text not null check (language in ('en','as','hi','bn','ta','te','kn','ml','mr','gu','pa','or')),
  status text not null default 'pending_review' check (status in ('pending_review','approved','rejected')),
  translated_title text not null,
  translated_summary text not null,
  translated_body jsonb not null default '{}'::jsonb,
  ai_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (content_item_id, language)
);

create table if not exists public.review_queue (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('content_source','content_item','content_translation','question','question_translation','generated_pdf')),
  entity_id uuid not null,
  reviewer_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','changes_requested')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.student_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  target_exam text not null default 'UPSC',
  preferred_language text not null default 'en',
  state text,
  daily_study_minutes integer not null default 60,
  level text not null default 'beginner',
  weak_subjects text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.student_diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  exam text not null,
  subject text not null,
  topic text not null,
  subtopic text,
  attempts_count integer not null default 0,
  accuracy numeric not null default 0,
  avg_time_seconds numeric not null default 0,
  weakness_level text not null default 'unknown',
  recommended_action text not null default 'Continue practice and review explanations.',
  recommended_content_ids uuid[] not null default '{}',
  recommended_question_ids uuid[] not null default '{}',
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.generated_pdfs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null,
  storage_path text not null,
  content_item_id uuid references public.content_items(id) on delete set null,
  is_published boolean not null default false,
  visibility text not null default 'free',
  language text not null default 'en',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.exams enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.question_translations enable row level security;
alter table public.daily_questions enable row level security;
alter table public.mock_tests enable row level security;
alter table public.mock_test_questions enable row level security;
alter table public.test_attempts enable row level security;
alter table public.test_answers enable row level security;
alter table public.pdfs enable row level security;
alter table public.current_affairs enable row level security;
alter table public.ai_generations enable row level security;
alter table public.ai_chats enable row level security;
alter table public.uploaded_documents enable row level security;
alter table public.translation_jobs enable row level security;
alter table public.translation_chunks enable row level security;
alter table public.content_sources enable row level security;
alter table public.content_items enable row level security;
alter table public.content_translations enable row level security;
alter table public.review_queue enable row level security;
alter table public.audit_logs enable row level security;
alter table public.student_profiles enable row level security;
alter table public.student_diagnostics enable row level security;
alter table public.generated_pdfs enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_editor_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role in ('editor','admin'));
$$;

create or replace function public.has_active_subscription(user_uuid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = user_uuid and is_premium = true)
    or exists(select 1 from public.subscriptions where user_id = user_uuid and status = 'active');
$$;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role, is_premium)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    'student',
    false
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user_profile();

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles for select to authenticated using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "subscriptions_select_own_or_admin" on public.subscriptions;
create policy "subscriptions_select_own_or_admin" on public.subscriptions for select to authenticated using (auth.uid() = user_id or public.is_admin());

drop policy if exists "admin_all_exams" on public.exams;
create policy "admin_all_exams" on public.exams for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read_active_exams" on public.exams;
create policy "read_active_exams" on public.exams for select to authenticated using (is_active or public.is_admin());

drop policy if exists "admin_all_subjects" on public.subjects;
create policy "admin_all_subjects" on public.subjects for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read_subjects" on public.subjects;
create policy "read_subjects" on public.subjects for select to authenticated using (true);

drop policy if exists "admin_all_topics" on public.topics;
create policy "admin_all_topics" on public.topics for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read_topics" on public.topics;
create policy "read_topics" on public.topics for select to authenticated using (true);

drop policy if exists "admin_all_questions" on public.questions;
create policy "admin_all_questions" on public.questions for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read_approved_questions" on public.questions;
create policy "read_approved_questions" on public.questions for select to authenticated using (status = 'approved' or public.is_admin());

drop policy if exists "admin_all_question_translations" on public.question_translations;
create policy "admin_all_question_translations" on public.question_translations for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
drop policy if exists "read_approved_question_translations" on public.question_translations;
create policy "read_approved_question_translations" on public.question_translations for select to authenticated using (status = 'approved');

drop policy if exists "admin_all_daily_questions" on public.daily_questions;
create policy "admin_all_daily_questions" on public.daily_questions for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read_published_daily_questions" on public.daily_questions;
create policy "read_published_daily_questions" on public.daily_questions for select to authenticated using (status = 'published' or public.is_admin());

drop policy if exists "admin_all_mock_tests" on public.mock_tests;
create policy "admin_all_mock_tests" on public.mock_tests for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read_published_mock_tests" on public.mock_tests;
create policy "read_published_mock_tests" on public.mock_tests for select to authenticated using (status = 'published' or public.is_admin());

drop policy if exists "admin_all_mock_test_questions" on public.mock_test_questions;
create policy "admin_all_mock_test_questions" on public.mock_test_questions for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read_mock_test_questions" on public.mock_test_questions;
create policy "read_mock_test_questions" on public.mock_test_questions for select to authenticated using (true);

drop policy if exists "admin_all_test_attempts" on public.test_attempts;
create policy "admin_all_test_attempts" on public.test_attempts for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "user_test_attempts" on public.test_attempts;
create policy "user_test_attempts" on public.test_attempts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_test_answers" on public.test_answers;
create policy "user_test_answers" on public.test_answers for all to authenticated
using (exists(select 1 from public.test_attempts where test_attempts.id = test_answers.attempt_id and test_attempts.user_id = auth.uid()) or public.is_admin())
with check (exists(select 1 from public.test_attempts where test_attempts.id = test_answers.attempt_id and test_attempts.user_id = auth.uid()) or public.is_admin());

drop policy if exists "admin_all_pdfs" on public.pdfs;
create policy "admin_all_pdfs" on public.pdfs for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read_approved_pdfs" on public.pdfs;
create policy "read_approved_pdfs" on public.pdfs for select to authenticated using (status = 'approved' or public.is_admin());

drop policy if exists "admin_all_current_affairs" on public.current_affairs;
create policy "admin_all_current_affairs" on public.current_affairs for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "read_approved_current_affairs" on public.current_affairs;
create policy "read_approved_current_affairs" on public.current_affairs for select to authenticated using (status = 'approved' or public.is_admin());

drop policy if exists "admin_all_ai_generations" on public.ai_generations;
create policy "admin_all_ai_generations" on public.ai_generations for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "user_ai_chats" on public.ai_chats;
create policy "user_ai_chats" on public.ai_chats for all to authenticated using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "user_uploaded_documents" on public.uploaded_documents;
create policy "user_uploaded_documents" on public.uploaded_documents for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_translation_jobs" on public.translation_jobs;
create policy "user_translation_jobs" on public.translation_jobs for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_translation_chunks" on public.translation_chunks;
create policy "user_translation_chunks" on public.translation_chunks for all to authenticated
using (exists(select 1 from public.translation_jobs where translation_jobs.id = translation_chunks.job_id and translation_jobs.user_id = auth.uid()))
with check (exists(select 1 from public.translation_jobs where translation_jobs.id = translation_chunks.job_id and translation_jobs.user_id = auth.uid()));

drop policy if exists "content_sources_editor" on public.content_sources;
create policy "content_sources_editor" on public.content_sources for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
drop policy if exists "content_items_editor" on public.content_items;
create policy "content_items_editor" on public.content_items for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
drop policy if exists "content_items_student_read" on public.content_items;
create policy "content_items_student_read" on public.content_items for select to authenticated using (status = 'published' and (visibility = 'free' or public.has_active_subscription(auth.uid())));
drop policy if exists "content_translations_editor" on public.content_translations;
create policy "content_translations_editor" on public.content_translations for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
drop policy if exists "content_translations_student_read" on public.content_translations;
create policy "content_translations_student_read" on public.content_translations for select to authenticated using (status = 'approved');
drop policy if exists "review_queue_editor" on public.review_queue;
create policy "review_queue_editor" on public.review_queue for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
drop policy if exists "audit_logs_editor" on public.audit_logs;
create policy "audit_logs_editor" on public.audit_logs for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());

drop policy if exists "student_profiles_own" on public.student_profiles;
create policy "student_profiles_own" on public.student_profiles for all to authenticated using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());
drop policy if exists "student_diagnostics_own" on public.student_diagnostics;
create policy "student_diagnostics_own" on public.student_diagnostics for all to authenticated using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());
drop policy if exists "generated_pdfs_editor" on public.generated_pdfs;
create policy "generated_pdfs_editor" on public.generated_pdfs for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
drop policy if exists "generated_pdfs_student_read" on public.generated_pdfs;
create policy "generated_pdfs_student_read" on public.generated_pdfs for select to authenticated using (is_published and (visibility = 'free' or public.has_active_subscription(auth.uid())));

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists exams_slug_idx on public.exams(slug);
create index if not exists subjects_exam_id_idx on public.subjects(exam_id);
create index if not exists topics_subject_id_idx on public.topics(subject_id);
create index if not exists questions_topic_id_idx on public.questions(topic_id);
create index if not exists questions_status_idx on public.questions(status);
create index if not exists questions_tags_idx on public.questions using gin(tags);
create index if not exists daily_questions_display_date_idx on public.daily_questions(display_date desc, sort_order);
create index if not exists daily_questions_question_id_idx on public.daily_questions(question_id);
create index if not exists mock_tests_status_idx on public.mock_tests(status);
create index if not exists mock_test_questions_test_idx on public.mock_test_questions(mock_test_id, position);
create index if not exists test_attempts_user_id_idx on public.test_attempts(user_id, created_at desc);
create index if not exists test_answers_attempt_id_idx on public.test_answers(attempt_id);
create index if not exists pdfs_status_idx on public.pdfs(status);
create index if not exists pdfs_tags_idx on public.pdfs using gin(tags);
create index if not exists current_affairs_status_date_idx on public.current_affairs(status, published_date desc);
create index if not exists current_affairs_tags_idx on public.current_affairs using gin(tags);
create index if not exists ai_generations_status_idx on public.ai_generations(status);
create index if not exists ai_chats_user_created_at_idx on public.ai_chats(user_id, created_at desc);
create index if not exists translation_jobs_user_id_idx on public.translation_jobs(user_id, created_at desc);
create index if not exists translation_chunks_job_id_idx on public.translation_chunks(job_id, chunk_index);
create index if not exists content_items_status_visibility_idx on public.content_items(status, visibility);
create index if not exists content_items_slug_idx on public.content_items(slug);
create index if not exists content_translations_item_language_idx on public.content_translations(content_item_id, language);
create index if not exists review_queue_status_idx on public.review_queue(status);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);
