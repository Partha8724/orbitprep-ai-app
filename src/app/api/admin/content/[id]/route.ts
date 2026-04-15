import { fail, ok, readJson } from "@/lib/api/response";
import { requireContentManagerApi } from "@/lib/permissions/roles";
import { getContentItemById, patchContentItem } from "@/server/content-pipeline/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireContentManagerApi();
  if (error) return error;
  try {
    const { id } = await params;
    return ok(await getContentItemById(id));
  } catch (err) {
    return fail("NOT_FOUND", err instanceof Error ? err.message : "Content not found.", 404);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const { profile, error } = await requireContentManagerApi();
  if (error || !profile) return error;
  const body = await readJson(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail("BAD_REQUEST", "Body must be an object.");
  try {
    const { id } = await params;
    return ok(await patchContentItem(id, body as Record<string, unknown>, profile));
  } catch (err) {
    return fail("BAD_REQUEST", err instanceof Error ? err.message : "Could not update content.");
  }
}
