import { fail, ok, readJson } from "@/lib/api/response";
import { requireContentManagerApi } from "@/lib/permissions/roles";
import { generateEducationContent } from "@/lib/ai";
import { asLanguage } from "@/lib/validations/platform";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { profile, error } = await requireContentManagerApi();
  if (error || !profile) return error;
  const body = await readJson(request);
  const record = body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  if (typeof record.question_id !== "string") return fail("BAD_REQUEST", "question_id is required.");
  const language = asLanguage(record.language);
  const supabase = await createSupabaseServerClient();
  const { data: question, error: questionError } = await supabase.from("questions").select("id, prompt, question_text, structured_options, options, explanation").eq("id", record.question_id).single();
  if (questionError || !question) return fail("NOT_FOUND", questionError?.message || "Question not found.", 404);
  try {
    const translated = await generateEducationContent({ kind: "questions", prompt: `Translate this question into ${language}. Preserve option identities exactly.\n\n${JSON.stringify(question)}` });
    const { data, error: upsertError } = await supabase.from("question_translations").upsert({ question_id: question.id, language, status: "pending_review", translated_prompt: question.prompt || question.question_text, translated_options: question.structured_options || question.options, translated_explanation: translated }, { onConflict: "question_id,language" }).select("*").single();
    if (upsertError) return fail("BAD_REQUEST", upsertError.message);
    return ok(data, { status: 201 });
  } catch (err) {
    return fail("BAD_REQUEST", err instanceof Error ? err.message : "Could not generate question translation.");
  }
}
