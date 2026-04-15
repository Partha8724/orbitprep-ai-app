-- OrbitPrep AI product platform schema
-- Run after supabase/profiles.sql. This file creates the education product tables.

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
  options jsonb not null,
  correct_answer text not null,
  explanation text,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  tags text[] not null default '{}',
  source_type text not null default 'manual' check (source_type in ('manual', 'AI', 'previous_paper')),
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mock_tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration_minutes integer not null default 60,
  is_premium boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mock_test_questions (
  mock_test_id uuid not null references public.mock_tests(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  position integer not null,
  primary key (mock_test_id, question_id)
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mock_test_id uuid not null references public.mock_tests(id) on delete cascade,
  total_questions integer not null,
  correct_answers integer not null,
  score_percent integer not null,
  topic_breakdown jsonb not null default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.test_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_answer text,
  is_correct boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.pdfs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  source_type text not null default 'manual' check (source_type in ('manual', 'AI', 'previous_paper')),
  is_premium boolean not null default false,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
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

alter table public.exams enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.mock_tests enable row level security;
alter table public.mock_test_questions enable row level security;
alter table public.test_attempts enable row level security;
alter table public.test_answers enable row level security;
alter table public.pdfs enable row level security;
alter table public.current_affairs enable row level security;
alter table public.ai_generations enable row level security;
alter table public.ai_chats enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

drop policy if exists "admin_all_exams" on public.exams;
drop policy if exists "read_exams" on public.exams;
create policy "admin_all_exams" on public.exams for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read_exams" on public.exams for select to authenticated using (is_active = true or public.is_admin());

drop policy if exists "admin_all_subjects" on public.subjects;
drop policy if exists "read_subjects" on public.subjects;
create policy "admin_all_subjects" on public.subjects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read_subjects" on public.subjects for select to authenticated using (true);

drop policy if exists "admin_all_topics" on public.topics;
drop policy if exists "read_topics" on public.topics;
create policy "admin_all_topics" on public.topics for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read_topics" on public.topics for select to authenticated using (true);

drop policy if exists "admin_all_questions" on public.questions;
drop policy if exists "read_approved_questions" on public.questions;
create policy "admin_all_questions" on public.questions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read_approved_questions" on public.questions for select to authenticated using (status = 'approved' or public.is_admin());

drop policy if exists "admin_all_mock_tests" on public.mock_tests;
drop policy if exists "read_published_mock_tests" on public.mock_tests;
create policy "admin_all_mock_tests" on public.mock_tests for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read_published_mock_tests" on public.mock_tests for select to authenticated using (status = 'published' or public.is_admin());

drop policy if exists "admin_all_mock_test_questions" on public.mock_test_questions;
drop policy if exists "read_mock_test_questions" on public.mock_test_questions;
create policy "admin_all_mock_test_questions" on public.mock_test_questions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read_mock_test_questions" on public.mock_test_questions for select to authenticated using (true);

drop policy if exists "admin_all_test_attempts" on public.test_attempts;
drop policy if exists "user_attempts" on public.test_attempts;
create policy "admin_all_test_attempts" on public.test_attempts for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "user_attempts" on public.test_attempts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "admin_all_test_answers" on public.test_answers;
drop policy if exists "user_test_answers" on public.test_answers;
create policy "admin_all_test_answers" on public.test_answers for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "user_test_answers" on public.test_answers for all to authenticated using (exists(select 1 from public.test_attempts where id = attempt_id and user_id = auth.uid())) with check (exists(select 1 from public.test_attempts where id = attempt_id and user_id = auth.uid()));

drop policy if exists "admin_all_pdfs" on public.pdfs;
drop policy if exists "read_approved_pdfs" on public.pdfs;
create policy "admin_all_pdfs" on public.pdfs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read_approved_pdfs" on public.pdfs for select to authenticated using (status = 'approved' or public.is_admin());

drop policy if exists "admin_all_current_affairs" on public.current_affairs;
drop policy if exists "read_approved_current_affairs" on public.current_affairs;
create policy "admin_all_current_affairs" on public.current_affairs for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read_approved_current_affairs" on public.current_affairs for select to authenticated using (status = 'approved' or public.is_admin());

drop policy if exists "admin_all_ai_generations" on public.ai_generations;
create policy "admin_all_ai_generations" on public.ai_generations for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all_ai_chats" on public.ai_chats;
drop policy if exists "user_ai_chats" on public.ai_chats;
create policy "admin_all_ai_chats" on public.ai_chats for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "user_ai_chats" on public.ai_chats for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists questions_topic_id_idx on public.questions(topic_id);
create index if not exists questions_status_idx on public.questions(status);
create index if not exists mock_tests_status_idx on public.mock_tests(status);
create index if not exists test_attempts_user_id_idx on public.test_attempts(user_id);
create index if not exists pdfs_status_idx on public.pdfs(status);
create index if not exists current_affairs_status_date_idx on public.current_affairs(status, published_date desc);
create index if not exists ai_generations_status_idx on public.ai_generations(status);
create index if not exists ai_chats_user_id_idx on public.ai_chats(user_id);
