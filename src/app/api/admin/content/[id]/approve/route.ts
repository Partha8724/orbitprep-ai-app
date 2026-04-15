import { fail, ok, readJson } from "@/lib/api/response";
import { requireContentManagerApi } from "@/lib/permissions/roles";
import { approveContentItem } from "@/server/content-pipeline/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { profile, error } = await requireContentManagerApi();
  if (error || !profile) return error;
  const body = await readJson(request);
  const record = body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
  const notes = typeof record.notes === "string" ? record.notes : "";
  try {
    const { id } = await params;
    return ok(await approveContentItem(id, profile, notes));
  } catch (err) {
    return fail("BAD_REQUEST", err instanceof Error ? err.message : "Could not approve content.");
  }
}
