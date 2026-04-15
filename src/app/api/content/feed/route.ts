import { fail, ok } from "@/lib/api/response";
import { requireApiProfile } from "@/lib/permissions/roles";
import { asLanguage } from "@/lib/validations/platform";
import { getPublishedContentFeed } from "@/server/content-pipeline/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { profile, error } = await requireApiProfile();
  if (error || !profile) return error;
  const url = new URL(request.url);
  try {
    return ok(await getPublishedContentFeed({ language: asLanguage(url.searchParams.get("language") || "en"), isPremium: profile.is_premium }));
  } catch (err) {
    return fail("BAD_REQUEST", err instanceof Error ? err.message : "Could not load feed.");
  }
}
