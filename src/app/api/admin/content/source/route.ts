import { fail, ok, readJson } from "@/lib/api/response";
import { requireContentManagerApi } from "@/lib/permissions/roles";
import { validateContentSourceInput } from "@/lib/validations/platform";
import { createContentSource } from "@/server/content-pipeline/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { profile, error } = await requireContentManagerApi();
  if (error || !profile) return error;
  const parsed = validateContentSourceInput(await readJson(request));
  if (!parsed.ok) return fail("BAD_REQUEST", "Invalid content source.", 400, parsed.errors);
  try {
    return ok(await createContentSource(parsed.data, profile), { status: 201 });
  } catch (err) {
    return fail("INTERNAL_ERROR", err instanceof Error ? err.message : "Could not create source.", 500);
  }
}
