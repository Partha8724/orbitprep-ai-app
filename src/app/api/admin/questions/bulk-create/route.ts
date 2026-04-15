import { fail, ok, readJson } from "@/lib/api/response";
import { requireContentManagerApi } from "@/lib/permissions/roles";
import { validateBulkQuestionInput } from "@/lib/validations/platform";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { profile, error } = await requireContentManagerApi();
  if (error || !profile) return error;
  const parsed = validateBulkQuestionInput(await readJson(request));
  if (!parsed.ok) return fail("BAD_REQUEST", "Invalid questions payload.", 400, parsed.errors);
  const rows = parsed.data.questions.map((question) => ({
    prompt: question.prompt,
    question_text: question.prompt,
    structured_options: question.options,
    options: question.options,
    structured_answer: question.answer,
    correct_answer: question.answer.option_id,
    explanation: question.answer.explanation || null,
    exam: question.exam,
    subject: question.subject,
    topic: question.topic,
    subtopic: question.subtopic || null,
    year: question.year || null,
    difficulty: question.difficulty,
    source_type: question.source_type,
    approved: false,
    status: "pending_review",
    created_by: profile.id,
  }));
  const supabase = await createSupabaseServerClient();
  const { data, error: insertError } = await supabase.from("questions").insert(rows).select("id");
  if (insertError) return fail("BAD_REQUEST", insertError.message);
  return ok({ created: data?.length || 0 }, { status: 201 });
}
