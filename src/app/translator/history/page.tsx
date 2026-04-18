import Link from "next/link";
import { AlertCircle, ArrowUpRight, BookOpen, Languages, Plus, Sparkles } from "lucide-react";

import Navbar from "@/components/Navbar";
import { PremiumPageShell, SectionGlowLines } from "@/components/premium";
import { requireProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getLanguageLabel } from "@/lib/translator/languages";

export const dynamic = "force-dynamic";
export const metadata = { title: "Translation History" };

export default async function TranslationHistoryPage() {
  const profile = await requireProfile();
  const supabase = await createSupabaseServerClient();

  const { data: jobs, error } = await supabase
    .from("translation_jobs")
    .select("id, title, source_language, target_language, status, created_at, completed_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <PremiumPageShell>
      <Navbar />

      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-12 md:pt-40">
        <SectionGlowLines />
        <div className="mb-11 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <p className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Saved translations
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">Translation history</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/50">
              Reopen translated study material, continue revision, or download completed outputs.
            </p>
          </div>
          <Link href="/translator" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_16px_45px_rgba(255,255,255,0.14)] transition-colors hover:bg-white/90">
            <Plus className="size-4" />
            New translation
          </Link>
        </div>

        {error ? (
          <div className="flex gap-3 rounded-lg border border-red-300/20 bg-red-500/10 p-5 text-sm leading-6 text-red-50">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-200" />
            <div>
              <p className="font-semibold">History could not load</p>
              <p className="mt-1 text-red-100/80">{error.message}</p>
            </div>
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/translator/${job.id}`}
                className="group grid gap-5 rounded-lg border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.25)] transition-colors hover:border-white/[0.14] hover:bg-white/[0.06] md:grid-cols-[1fr_auto]"
              >
                <div className="flex gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/[0.08]">
                    <BookOpen className="size-5 text-white/70" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-[-0.02em] text-white/90">{job.title}</h2>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-white/42">
                      <span className="inline-flex items-center gap-1.5">
                        <Languages className="size-3.5" />
                        {getLanguageLabel(job.source_language)} to {getLanguageLabel(job.target_language)}
                      </span>
                      <span>{new Date(job.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 uppercase tracking-[0.16em]">{job.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm font-semibold text-white/55 md:justify-end">
                  Open reader
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.025] p-10 text-center shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:p-14">
            <div className="mx-auto flex size-14 items-center justify-center rounded-lg bg-white text-black">
              <Sparkles className="size-6" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em]">No translations yet</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/45">
              Your translated notes, book excerpts, and saved readers will appear here after the first job completes.
            </p>
            <Link href="/translator" className="mt-7 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90">
              Translate study material
            </Link>
          </div>
        )}
      </section>
    </PremiumPageShell>
  );
}
