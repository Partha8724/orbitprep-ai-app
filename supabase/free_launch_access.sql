-- OrbitPrep AI free launch access policy patch
-- Run this after the base platform/content pipeline SQL while all student features are free.

-- Keep admin/editor write controls unchanged. This only opens already-published or approved student reads.
drop policy if exists "content_items_student_read" on public.content_items;
create policy "content_items_student_read"
on public.content_items
for select
to authenticated
using (status = 'published');

drop policy if exists "content_translations_student_read" on public.content_translations;
create policy "content_translations_student_read"
on public.content_translations
for select
to authenticated
using (
  status = 'approved'
  and exists (
    select 1
    from public.content_items ci
    where ci.id = content_item_id
      and ci.status = 'published'
  )
);

drop policy if exists "generated_pdfs_student_read" on public.generated_pdfs;
create policy "generated_pdfs_student_read"
on public.generated_pdfs
for select
to authenticated
using (is_published = true);