import { fail, ok } from "@/lib/api/response";
import { requireApiProfile } from "@/lib/permissions/roles";
import { asLanguage } from "@/lib/validations/platform";
import { getPublishedContentBySlug } from "@/server/content-pipeline/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Params = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Params) {
  const { profile, error } = await requireApiProfile();
  if (error || !profile) return error;
  const url = new URL(request.url);
  try {
    const { slug } = await params;
    return ok(await getPublishedContentBySlug({ slug, language: asLanguage(url.searchParams.get("language") || "en"), isPremium: profile.is_premium }));
  } catch (err) {
    return fail("NOT_FOUND", err instanceof Error ? err.message : "Content not found.", 404);
  }
}
