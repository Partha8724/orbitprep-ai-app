import { NextResponse } from "next/server";

import { requireProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DownloadRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: DownloadRouteContext) {
  const profile = await requireProfile();
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: job } = await supabase
    .from("translation_jobs")
    .select("title, translated_text")
    .eq("id", id)
    .eq("user_id", profile.id)
    .single();

  if (!job?.translated_text) {
    return NextResponse.json({ error: "Translated content is not available." }, { status: 404 });
  }

  const safeTitle = job.title.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "") || "translation";

  return new Response(job.translated_text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeTitle}.txt"`,
    },
  });
}
