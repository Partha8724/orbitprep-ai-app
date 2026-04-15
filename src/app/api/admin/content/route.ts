import { fail, ok } from "@/lib/api/response";
import { requireContentManagerApi } from "@/lib/permissions/roles";
import { listContentItems } from "@/server/content-pipeline/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { error } = await requireContentManagerApi();
  if (error) return error;
  try {
    return ok(await listContentItems());
  } catch (err) {
    return fail("INTERNAL_ERROR", err instanceof Error ? err.message : "Could not list content.", 500);
  }
}
