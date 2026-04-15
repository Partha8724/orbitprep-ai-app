import { fail, ok } from "@/lib/api/response";
import { requireContentManagerApi } from "@/lib/permissions/roles";
import { publishContentItem } from "@/server/content-pipeline/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { profile, error } = await requireContentManagerApi();
  if (error || !profile) return error;
  try {
    const { id } = await params;
    return ok(await publishContentItem(id, profile));
  } catch (err) {
    return fail("BAD_REQUEST", err instanceof Error ? err.message : "Could not publish content.");
  }
}
