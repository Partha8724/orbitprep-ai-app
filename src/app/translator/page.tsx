import Link from "next/link";
import { BookOpen, FileText, History, Languages, ShieldCheck } from "lucide-react";

import Navbar from "@/components/Navbar";
import { PremiumPageShell, SectionGlowLines } from "@/components/premium";
import { TranslatorForm } from "@/components/translator/translator-form";
import { requireProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Study Material Translator" };

type TranslatorPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function TranslatorPage({ searchParams }: TranslatorPageProps) {
  await requireProfile();
  const params = await searchParams;

  return (
    <PremiumPageShell>
      <Navbar />

      <section className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-32 md:px-12 md:pt-40 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <SectionGlowLines />
        <div className="flex flex-col gap-9 lg:sticky lg:top-28">
          <div className="flex flex-col gap-7">
            <p className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Demo mode translation
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.055em] text-white sm:text-7xl">
              Study in the language that clicks.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/55">
              Save notes, book excerpts, and text-based study material into a calm reader. Free version  real translation coming soon.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { icon: FileText, title: "TXT first", copy: "Paste text or upload readable notes." },
              { icon: Languages, title: "Language preview", copy: "Choose a pair now; real translation comes later." },
              { icon: BookOpen, title: "Reader mode", copy: "Original and translated text stay available." },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
                <Icon className="mb-5 size-5 text-white/65" />
                <h2 className="text-sm font-semibold text-white/90">{title}</h2>
                <p className="mt-2 text-xs leading-5 text-white/42">{copy}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <div className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-black">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Demo mode translation</h2>
                <p className="mt-2 text-sm leading-6 text-white/45">
                  Free version  real translation coming soon. This version saves your reader without calling any external translation API.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/translator/history"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <History className="size-4" />
            View history
          </Link>
        </div>

        <TranslatorForm error={params.error} />
      </section>
    </PremiumPageShell>
  );
}
