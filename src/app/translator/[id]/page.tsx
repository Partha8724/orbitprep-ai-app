import Link from "next/link";
import { AlertCircle, Download, History, Languages, LoaderCircle, Plus, Rows2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import { PremiumPageShell, SectionGlowLines } from "@/components/premium";
import { requireProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getLanguageLabel } from "@/lib/translator/languages";

export const dynamic = "force-dynamic";
export const metadata = { title: "Translation Reader" };

type TranslationDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string; error?: string }>;
};

export default async function TranslationDetailPage({ params, searchParams }: TranslationDetailPageProps) {
  const profile = await requireProfile();
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createSupabaseServerClient();

  const { data: job } = await supabase
    .from("translation_jobs")
    .select("id, title, source_language, target_language, original_text, translated_text, status, error_message, created_at, completed_at")
    .eq("id", id)
    .eq("user_id", profile.id)
    .single();

  if (!job) {
    return <MissingTranslationState />;
  }

  const { data: chunks } = await supabase
    .from("translation_chunks")
    .select("id, chunk_index, source_text, translated_text, status")
    .eq("job_id", id)
    .order("chunk_index", { ascending: true });

  const completedChunks = chunks?.filter((chunk) => chunk.status === "completed").length || 0;
  const totalChunks = chunks?.length || 0;
  const progress = totalChunks > 0 ? Math.round((completedChunks / totalChunks) * 100) : job.status === "completed" ? 100 : 0;
  const sideBySide = query.view === "side-by-side";
  const statusLabel = job.status.charAt(0).toUpperCase() + job.status.slice(1);

  return (
    <PremiumPageShell>
      <Navbar />

      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-12 md:pt-40">
        <SectionGlowLines />
        <div className="mb-9 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Demo mode translation
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">{job.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/45">
              <span className="inline-flex items-center gap-2">
                <Languages className="size-4" />
                {getLanguageLabel(job.source_language)} to {getLanguageLabel(job.target_language)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">{statusLabel}</span>
              <span>{new Date(job.created_at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/translator/history" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white">
              <History className="size-4" />
              History
            </Link>
            <Link
              href={`/translator/${job.id}?view=${sideBySide ? "reader" : "side-by-side"}`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <Rows2 className="size-4" />
              {sideBySide ? "Reader view" : "Side by side"}
            </Link>
            {job.status === "completed" && (
              <Link href={`/translator/${job.id}/download`} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black shadow-[0_16px_45px_rgba(255,255,255,0.14)] transition-colors hover:bg-white/90">
                <Download className="size-4" />
                Download
              </Link>
            )}
          </div>
        </div>

        {(query.error || job.error_message) && (
          <div className="mb-6 flex gap-3 rounded-lg border border-red-300/20 bg-red-500/10 p-5 text-sm leading-6 text-red-50">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-200" />
            <div>
              <p className="font-semibold">Translation needs attention</p>
              <p className="mt-1 text-red-100/80">{query.error || job.error_message}</p>
            </div>
          </div>
        )}

        {job.status !== "completed" && (
          <div className="mb-6 rounded-lg border border-white/[0.08] bg-white/[0.035] p-5">
            <div className="mb-4 flex items-center justify-between gap-4 text-sm font-semibold text-white/75">
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="size-4" />
                Translation progress
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-sm leading-6 text-white/42">
              Demo mode keeps saved chunks accessible while real translation is prepared for the free version.
            </p>
          </div>
        )}

        {sideBySide ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <ReaderPanel title="Original" content={job.original_text || ""} />
            <ReaderPanel title="Translated" content={job.translated_text || "Translation output is not ready yet."} />
          </div>
        ) : (
          <ReaderPanel title="Translated study material" content={job.translated_text || "Translation output is not ready yet."} large />
        )}
      </section>
    </PremiumPageShell>
  );
}

function MissingTranslationState() {
  return (
    <PremiumPageShell>
      <Navbar />

      <section className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-32 text-center md:px-12 md:pt-40">
        <SectionGlowLines />
        <div className="flex size-14 items-center justify-center rounded-lg bg-white/[0.08]">
          <AlertCircle className="size-6 text-white/70" />
        </div>
        <p className="mt-7 w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
          Translation not available
        </p>
        <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
          Translation not available.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/50">
          The translation may not have been saved, or it may belong to another account. Start a fresh translation or reopen a saved reader from history.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/translator" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90">
            <Plus className="size-4" />
            New translation
          </Link>
          <Link href="/translator/history" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white">
            <History className="size-4" />
            View history
          </Link>
        </div>
      </section>
    </PremiumPageShell>
  );
}

function ReaderPanel({ title, content, large = false }: { title: string; content: string; large?: boolean }) {
  return (
    <article className="rounded-lg border border-white/[0.08] bg-[#0b0b0d] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)] md:p-8">
      <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">{title}</h2>
      </div>
      <div className={`${large ? "mx-auto max-w-4xl" : ""} min-h-64 whitespace-pre-wrap text-[16px] leading-8 text-white/80 md:text-[18px] md:leading-9`}>
        {content}
      </div>
    </article>
  );
}
