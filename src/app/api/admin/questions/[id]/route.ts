import { fail, ok, readJson } from "@/lib/api/response";
import { requireContentManagerApi } from "@/lib/permissions/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireContentManagerApi();
  if (error) return error;
  const body = await readJson(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail("BAD_REQUEST", "Body must be an object.");
  const allowed = ["prompt", "structured_options", "structured_answer", "explanation", "exam", "year", "subject", "topic", "subtopic", "difficulty", "source_type", "approved", "status"];
  const patch = Object.fromEntries(Object.entries(body).filter(([key]) => allowed.includes(key)));
  if ("prompt" in patch && typeof patch.prompt === "string") patch.question_text = patch.prompt;
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data, error: updateError } = await supabase.from("questions").update(patch).eq("id", id).select("*").single();
  if (updateError) return fail("BAD_REQUEST", updateError.message);
  return ok(data);
}
