-- OrbitPrep AI Phase 1: admin-controlled multilingual AI content pipeline
-- Safe additive migration for existing OrbitPrep AI Supabase projects.

create extension if not exists pgcrypto;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('student', 'editor', 'admin'));

create table if not exists public.student_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  target_exam text not null default 'UPSC',
  preferred_language text not null default 'en' check (preferred_language in ('en','as','hi','bn','ta','te','kn','ml','mr','gu','pa','or')),
  state text,
  daily_study_minutes integer not null default 60 check (daily_study_minutes between 5 and 720),
  level text not null default 'beginner' check (level in ('beginner','intermediate','advanced')),
  weak_subjects text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.subscriptions add column if not exists provider text not null default 'razorpay';
alter table public.subscriptions add column if not exists provider_customer_id text;
alter table public.subscriptions add column if not exists provider_subscription_id text;
alter table public.subscriptions add column if not exists provider_payment_id text;
alter table public.subscriptions add column if not exists billing_window_start timestamptz;
alter table public.subscriptions add column if not exists billing_window_end timestamptz;
alter table public.subscriptions add column if not exists metadata jsonb not null default '{}';
update public.subscriptions set provider_subscription_id = coalesce(provider_subscription_id, razorpay_subscription_id), provider_payment_id = coalesce(provider_payment_id, razorpay_payment_id);

create table if not exists public.content_sources (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('manual','url','pdf','news','previous_paper')),
  title text not null,
  source_url text,
  raw_text text not null,
  metadata jsonb not null default '{}',
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
  body jsonb not null default '{}',
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  status text not null default 'draft' check (status in ('draft','in_review','approved','rejected','published','archived')),
  visibility text not null default 'free' check (visibility in ('free','premium')),
  ai_metadata jsonb not null default '{}',
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
  translated_body jsonb not null default '{}',
  ai_metadata jsonb not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (content_item_id, language)
);

alter table public.questions add column if not exists prompt text;
alter table public.questions add column if not exists structured_options jsonb;
alter table public.questions add column if not exists structured_answer jsonb;
alter table public.questions add column if not exists exam text;
alter table public.questions add column if not exists year integer;
alter table public.questions add column if not exists subject text;
alter table public.questions add column if not exists topic text;
alter table public.questions add column if not exists subtopic text;
alter table public.questions add column if not exists approved boolean not null default false;
update public.questions set prompt = coalesce(prompt, question_text), structured_options = coalesce(structured_options, options), structured_answer = coalesce(structured_answer, jsonb_build_object('option_id', correct_answer, 'explanation', explanation)), approved = approved or status = 'approved';

create table if not exists public.question_translations (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  language text not null check (language in ('en','as','hi','bn','ta','te','kn','ml','mr','gu','pa','or')),
  status text not null default 'pending_review' check (status in ('pending_review','approved','rejected')),
  translated_prompt text not null,
  translated_options jsonb not null default '[]',
  translated_explanation text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (question_id, language)
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

create table if not exists public.generated_pdfs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('daily_current_affairs','weekly_current_affairs','mock_test','solution','topic_digest')),
  storage_path text not null,
  content_item_id uuid references public.content_items(id) on delete set null,
  is_published boolean not null default false,
  visibility text not null default 'free' check (visibility in ('free','premium')),
  language text not null default 'en' check (language in ('en','as','hi','bn','ta','te','kn','ml','mr','gu','pa','or')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
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

alter table public.mock_tests add column if not exists exam text;
alter table public.mock_tests add column if not exists language text not null default 'en' check (language in ('en','as','hi','bn','ta','te','kn','ml','mr','gu','pa','or'));
alter table public.mock_tests add column if not exists subject text;

alter table public.mock_test_questions add column if not exists marks numeric not null default 1;
alter table public.mock_test_questions add column if not exists negative_marks numeric not null default 0;

alter table public.test_attempts add column if not exists started_at timestamptz not null default timezone('utc', now());
alter table public.test_attempts add column if not exists submitted_at timestamptz;
alter table public.test_attempts add column if not exists time_spent_seconds integer not null default 0;
alter table public.test_attempts add column if not exists wrong_answers integer not null default 0;
alter table public.test_attempts add column if not exists unanswered integer not null default 0;
alter table public.test_attempts add column if not exists accuracy numeric not null default 0;

alter table public.test_answers add column if not exists marks_awarded numeric not null default 0;
alter table public.test_answers add column if not exists time_spent_seconds integer not null default 0;

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
  weakness_level text not null default 'unknown' check (weakness_level in ('unknown','low','medium','high')),
  recommended_action text not null default 'Continue practice and review explanations.',
  recommended_content_ids uuid[] not null default '{}',
  recommended_question_ids uuid[] not null default '{}',
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.student_profiles enable row level security;
alter table public.content_sources enable row level security;
alter table public.content_items enable row level security;
alter table public.content_translations enable row level security;
alter table public.question_translations enable row level security;
alter table public.review_queue enable row level security;
alter table public.generated_pdfs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.student_diagnostics enable row level security;

create or replace function public.is_editor_or_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role in ('editor','admin'));
$$;

create or replace function public.has_active_subscription(user_uuid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = user_uuid and is_premium = true)
    or exists(select 1 from public.subscriptions where user_id = user_uuid and status = 'active');
$$;

drop policy if exists "student_profile_own" on public.student_profiles;
drop policy if exists "student_profile_admin" on public.student_profiles;
drop policy if exists "content_sources_admin" on public.content_sources;
drop policy if exists "content_items_admin" on public.content_items;
drop policy if exists "content_items_student_read" on public.content_items;
drop policy if exists "content_translations_admin" on public.content_translations;
drop policy if exists "content_translations_student_read" on public.content_translations;
drop policy if exists "question_translations_admin" on public.question_translations;
drop policy if exists "question_translations_student_read" on public.question_translations;
drop policy if exists "review_queue_admin" on public.review_queue;
drop policy if exists "generated_pdfs_admin" on public.generated_pdfs;
drop policy if exists "generated_pdfs_student_read" on public.generated_pdfs;
drop policy if exists "audit_logs_admin_read" on public.audit_logs;
drop policy if exists "student_diagnostics_own" on public.student_diagnostics;
drop policy if exists "student_diagnostics_admin" on public.student_diagnostics;

create policy "student_profile_own" on public.student_profiles for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "student_profile_admin" on public.student_profiles for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "content_sources_admin" on public.content_sources for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "content_items_admin" on public.content_items for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "content_items_student_read" on public.content_items for select to authenticated using (status = 'published' and (visibility = 'free' or public.has_active_subscription(auth.uid())));
create policy "content_translations_admin" on public.content_translations for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "content_translations_student_read" on public.content_translations for select to authenticated using (status = 'approved' and exists(select 1 from public.content_items ci where ci.id = content_item_id and ci.status = 'published' and (ci.visibility = 'free' or public.has_active_subscription(auth.uid()))));
create policy "question_translations_admin" on public.question_translations for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "question_translations_student_read" on public.question_translations for select to authenticated using (status = 'approved');
create policy "review_queue_admin" on public.review_queue for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "generated_pdfs_admin" on public.generated_pdfs for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create policy "generated_pdfs_student_read" on public.generated_pdfs for select to authenticated using (is_published and (visibility = 'free' or public.has_active_subscription(auth.uid())));
create policy "audit_logs_admin_read" on public.audit_logs for select to authenticated using (public.is_editor_or_admin());
create policy "student_diagnostics_own" on public.student_diagnostics for select to authenticated using (auth.uid() = user_id);
create policy "student_diagnostics_admin" on public.student_diagnostics for all to authenticated using (public.is_editor_or_admin()) with check (public.is_editor_or_admin());
create index if not exists content_items_status_visibility_idx on public.content_items(status, visibility);
create index if not exists content_items_slug_idx on public.content_items(slug);
create index if not exists content_translations_item_language_idx on public.content_translations(content_item_id, language);
create index if not exists question_translations_question_language_idx on public.question_translations(question_id, language);
create index if not exists review_queue_status_idx on public.review_queue(status);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);
create index if not exists student_diagnostics_user_idx on public.student_diagnostics(user_id);
create unique index if not exists student_diagnostics_unique_idx on public.student_diagnostics(user_id, exam, subject, topic, coalesce(subtopic, ''));

insert into storage.buckets (id, name, public)
values ('generated-assets', 'generated-assets', false)
on conflict (id) do nothing;

drop policy if exists "generated_assets_admin" on storage.objects;
drop policy if exists "generated_assets_student_read" on storage.objects;
create policy "generated_assets_admin" on storage.objects for all to authenticated using (bucket_id = 'generated-assets' and public.is_editor_or_admin()) with check (bucket_id = 'generated-assets' and public.is_editor_or_admin());
create policy "generated_assets_student_read" on storage.objects for select to authenticated using (bucket_id = 'generated-assets');
