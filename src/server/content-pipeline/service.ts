import { generateEducationContent } from "@/lib/ai";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import type { ContentGenerateInput, ContentSourceInput, SupportedLanguage } from "@/lib/validations/platform";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

async function audit({
  actorId,
  action,
  entityType,
  entityId,
  beforeState = null,
  afterState = null,
}: {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  beforeState?: unknown;
  afterState?: unknown;
}) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("audit_logs").insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_state: beforeState,
    after_state: afterState,
  });
}

export async function createContentSource(input: ContentSourceInput, actor: Profile) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_sources")
    .insert({ ...input, created_by: actor.id })
    .select("id, source_type, title, source_url, raw_text, metadata, created_at")
    .single();

  if (error || !data) throw new Error(error?.message || "Could not create content source.");
  await audit({ actorId: actor.id, action: "content_source.created", entityType: "content_sources", entityId: data.id, afterState: data });
  return data;
}

export async function listContentItems() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("id, content_type, title, slug, status, visibility, exam_tags, subject_tags, published_at, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getContentItemById(id: string) {
  const supabase = await createSupabaseServerClient();
  const [item, translations, reviews, audits] = await Promise.all([
    supabase.from("content_items").select("*").eq("id", id).single(),
    supabase.from("content_translations").select("*").eq("content_item_id", id).order("created_at", { ascending: false }),
    supabase.from("review_queue").select("*").eq("entity_id", id).order("created_at", { ascending: false }),
    supabase.from("audit_logs").select("*").eq("entity_id", id).order("created_at", { ascending: false }).limit(30),
  ]);

  if (item.error || !item.data) throw new Error(item.error?.message || "Content item not found.");
  if (translations.error) throw new Error(translations.error.message);
  if (reviews.error) throw new Error(reviews.error.message);
  if (audits.error) throw new Error(audits.error.message);
  return { item: item.data, translations: translations.data || [], reviews: reviews.data || [], audits: audits.data || [] };
}

export async function generateContentItem(input: ContentGenerateInput, actor: Profile) {
  const supabase = await createSupabaseServerClient();
  const source = input.source_id
    ? await supabase.from("content_sources").select("id, title, raw_text, metadata").eq("id", input.source_id).single()
    : null;

  if (source?.error) throw new Error(source.error.message);
  const sourceText = source?.data?.raw_text ? `\n\nSource material:\n${source.data.raw_text}` : "";
  const output = await generateEducationContent({
    kind: input.content_type === "article" ? "revision_notes" : input.content_type,
    prompt: `${input.prompt}${sourceText}`,
  });
  const title = source?.data?.title || input.prompt.slice(0, 80);
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;
  const body = { format: "markdown", content: output };
  const aiMetadata = { provider: "openai", model: process.env.OPENAI_MODEL || "gpt-4.1-mini", prompt_version: "content-pipeline-v1" };
  const { data, error } = await supabase
    .from("content_items")
    .insert({
      source_id: input.source_id,
      content_type: input.content_type,
      exam_tags: input.exam_tags,
      state_tags: input.state_tags,
      subject_tags: input.subject_tags,
      title,
      slug,
      summary: output.slice(0, 280),
      body,
      difficulty: "medium",
      status: "draft",
      visibility: input.visibility,
      ai_metadata: aiMetadata,
      created_by: actor.id,
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message || "Could not create content item.");
  await supabase.from("content_translations").insert({
    content_item_id: data.id,
    language: input.language,
    status: input.language === "en" ? "approved" : "pending_review",
    translated_title: data.title,
    translated_summary: data.summary,
    translated_body: data.body,
  });
  await audit({ actorId: actor.id, action: "content_item.generated", entityType: "content_items", entityId: data.id, afterState: data });
  return data;
}

export async function submitContentForReview(id: string, actor: Profile) {
  const supabase = await createSupabaseServerClient();
  const { data: before } = await supabase.from("content_items").select("*").eq("id", id).single();
  const { data, error } = await supabase.from("content_items").update({ status: "in_review" }).eq("id", id).select("*").single();
  if (error || !data) throw new Error(error?.message || "Could not submit content for review.");
  await supabase.from("review_queue").insert({ entity_type: "content_item", entity_id: id, status: "pending", notes: "Submitted for editorial review." });
  await audit({ actorId: actor.id, action: "content_item.submitted", entityType: "content_items", entityId: id, beforeState: before, afterState: data });
  return data;
}

export async function approveContentItem(id: string, actor: Profile, notes = "") {
  const supabase = await createSupabaseServerClient();
  const { data: before } = await supabase.from("content_items").select("*").eq("id", id).single();
  const { data, error } = await supabase
    .from("content_items")
    .update({ status: "approved", approved_by: actor.id })
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message || "Could not approve content.");
  await supabase.from("review_queue").insert({ entity_type: "content_item", entity_id: id, reviewer_id: actor.id, status: "approved", notes });
  await audit({ actorId: actor.id, action: "content_item.approved", entityType: "content_items", entityId: id, beforeState: before, afterState: data });
  return data;
}

export async function publishContentItem(id: string, actor: Profile) {
  const supabase = await createSupabaseServerClient();
  const { data: item, error: itemError } = await supabase.from("content_items").select("*, content_translations(id, language, status)").eq("id", id).single();
  if (itemError || !item) throw new Error(itemError?.message || "Content item not found.");
  if (item.status !== "approved") throw new Error("Content must be approved before publishing.");
  const approvedTranslation = (item.content_translations || []).some((translation: { status: string }) => translation.status === "approved");
  if (!approvedTranslation) throw new Error("At least one approved translation is required before publishing.");
  const { data, error } = await supabase.from("content_items").update({ status: "published", published_at: new Date().toISOString() }).eq("id", id).select("*").single();
  if (error || !data) throw new Error(error?.message || "Could not publish content.");
  await audit({ actorId: actor.id, action: "content_item.published", entityType: "content_items", entityId: id, beforeState: item, afterState: data });
  return data;
}

export async function patchContentItem(id: string, input: Record<string, unknown>, actor: Profile) {
  const allowed = ["title", "summary", "body", "difficulty", "visibility", "exam_tags", "state_tags", "subject_tags"];
  const patch = Object.fromEntries(Object.entries(input).filter(([key]) => allowed.includes(key)));
  if (Object.keys(patch).length === 0) throw new Error("No editable fields provided.");
  const supabase = await createSupabaseServerClient();
  const { data: before } = await supabase.from("content_items").select("*").eq("id", id).single();
  const { data, error } = await supabase.from("content_items").update(patch).eq("id", id).select("*").single();
  if (error || !data) throw new Error(error?.message || "Could not update content.");
  await audit({ actorId: actor.id, action: "content_item.updated", entityType: "content_items", entityId: id, beforeState: before, afterState: data });
  return data;
}

export async function generateContentTranslation({ contentItemId, language, actor }: { contentItemId: string; language: SupportedLanguage; actor: Profile }) {
  const supabase = await createSupabaseServerClient();
  const { data: item, error } = await supabase.from("content_items").select("id, title, summary, body").eq("id", contentItemId).single();
  if (error || !item) throw new Error(error?.message || "Content item not found.");
  const translated = await generateEducationContent({ kind: "revision_notes", prompt: `Translate this content into ${language}. Preserve meaning, exam terms, and JSON-safe structure.\n\nTitle: ${item.title}\nSummary: ${item.summary}\nBody: ${JSON.stringify(item.body)}` });
  const { data, error: upsertError } = await supabase.from("content_translations").upsert({ content_item_id: contentItemId, language, status: "pending_review", translated_title: item.title, translated_summary: item.summary, translated_body: { format: "markdown", content: translated }, ai_metadata: { prompt_version: "translation-v1" } }, { onConflict: "content_item_id,language" }).select("*").single();
  if (upsertError || !data) throw new Error(upsertError?.message || "Could not save translation.");
  await audit({ actorId: actor.id, action: "content_translation.generated", entityType: "content_translations", entityId: data.id, afterState: data });
  return data;
}

export async function approveTranslation(id: string, actor: Profile) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("content_translations").update({ status: "approved" }).eq("id", id).select("*").single();
  if (error || !data) throw new Error(error?.message || "Could not approve translation.");
  await audit({ actorId: actor.id, action: "translation.approved", entityType: "content_translations", entityId: id, afterState: data });
  return data;
}

export async function getPublishedContentFeed({ language }: { language: SupportedLanguage; isPremium: boolean }) {
  const supabase = await createSupabaseServerClient();
  const query = supabase
    .from("content_items")
    .select("id, slug, content_type, title, summary, visibility, exam_tags, subject_tags, published_at, content_translations(language, status, translated_title, translated_summary)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []).map((item) => {
    const translations = (item.content_translations || []) as Array<{ language: string; status: string; translated_title: string; translated_summary: string }>;
    const translation = translations.find((entry) => entry.language === language && entry.status === "approved") || translations.find((entry) => entry.language === "en" && entry.status === "approved");
    return { ...item, title: translation?.translated_title || item.title, summary: translation?.translated_summary || item.summary };
  });
}

export async function getPublishedContentBySlug({ slug, language }: { slug: string; language: SupportedLanguage; isPremium: boolean }) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("*, content_translations(language, status, translated_title, translated_summary, translated_body)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error || !data) throw new Error(error?.message || "Content not found.");
  const translations = (data.content_translations || []) as Array<{ language: string; status: string; translated_title: string; translated_summary: string; translated_body: unknown }>;
  const translation = translations.find((entry) => entry.language === language && entry.status === "approved") || translations.find((entry) => entry.language === "en" && entry.status === "approved");
  return { ...data, title: translation?.translated_title || data.title, summary: translation?.translated_summary || data.summary, body: translation?.translated_body || data.body };
}
