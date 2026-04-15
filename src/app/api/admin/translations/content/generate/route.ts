import { fail, ok, readJson } from "@/lib/api/response";
import { requireContentManagerApi } from "@/lib/permissions/roles";
import { asLanguage } from "@/lib/validations/platform";
import { generateContentTranslation } from "@/server/content-pipeline/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { profile, error } = await requireContentManagerApi();
  if (error || !profile) return error;
  const body = await readJson(request);
  const record = body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  if (typeof record.content_item_id !== "string") return fail("BAD_REQUEST", "content_item_id is required.");
  try {
    return ok(await generateContentTranslation({ contentItemId: record.content_item_id, language: asLanguage(record.language), actor: profile }), { status: 201 });
  } catch (err) {
    return fail("BAD_REQUEST", err instanceof Error ? err.message : "Could not generate translation.");
  }
}