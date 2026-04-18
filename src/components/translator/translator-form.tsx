"use client";

import { useFormStatus } from "react-dom";
import { AlertCircle, FileText, Languages, Sparkles, Upload } from "lucide-react";

import { createTranslationAction } from "@/app/translator/actions";
import { TRANSLATION_LANGUAGES } from "@/lib/translator/languages";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-sm font-semibold text-black shadow-[0_16px_45px_rgba(255,255,255,0.14)] transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-55 md:w-auto"
    >
      <Sparkles className="size-4" />
      {pending ? "Creating demo reader..." : "Create demo translation"}
    </button>
  );
}

export function TranslatorForm({ error }: { error?: string }) {
  return (
    <form action={createTranslationAction} className="rounded-lg border border-white/10 bg-[#0b0b0d]/95 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.55)] md:p-7">
      <div className="mb-7 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/35">Demo mode translation</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">Upload or paste notes</h2>
          <p className="mt-2 text-sm leading-6 text-white/45">Free version  real translation coming soon</p>
        </div>
        <div className="hidden size-11 shrink-0 items-center justify-center rounded-lg bg-white text-black sm:flex">
          <Languages className="size-5" />
        </div>
      </div>

      <div className="grid gap-6">
        {error && (
          <div className="flex gap-3 rounded-lg border border-red-300/20 bg-red-500/10 px-4 py-4 text-sm leading-6 text-red-50">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-200" />
            <div>
              <p className="font-semibold">Translation could not start</p>
              <p className="mt-1 text-red-100/80">{error}</p>
            </div>
          </div>
        )}

        <div className="grid gap-3">
          <label htmlFor="title" className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Document title
          </label>
          <input
            id="title"
            name="title"
            placeholder="NCERT polity chapter, Assam history notes..."
            className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-medium text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/35 focus:bg-white/[0.06]"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-3">
            <label htmlFor="sourceLanguage" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              <Languages className="size-3.5" />
              Source
            </label>
            <select
              id="sourceLanguage"
              name="sourceLanguage"
              defaultValue="en"
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white outline-none focus:border-white/35"
            >
              {TRANSLATION_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3">
            <label htmlFor="targetLanguage" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              <Languages className="size-3.5" />
              Target
            </label>
            <select
              id="targetLanguage"
              name="targetLanguage"
              defaultValue="hi"
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold text-white outline-none focus:border-white/35"
            >
              {TRANSLATION_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3">
          <label htmlFor="document" className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Upload TXT
          </label>
          <label className="group flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-white/15 bg-white/[0.035] px-4 py-5 transition-colors hover:border-white/30 hover:bg-white/[0.06]">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] transition-colors group-hover:bg-white/[0.12]">
              <Upload className="size-5 text-white/65" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-white/90">Choose a text-based study file</span>
              <span className="mt-1 block text-xs leading-5 text-white/40">TXT is supported now. Paste text below for other formats.</span>
            </span>
            <input id="document" name="document" type="file" accept=".txt,text/plain" className="sr-only" />
          </label>
        </div>

        <div className="grid gap-3">
          <label htmlFor="sourceText" className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Or paste study material
          </label>
          <textarea
            id="sourceText"
            name="sourceText"
            rows={12}
            placeholder="Paste notes, book excerpts, PYQ explanations, or textbook sections here..."
            className="min-h-72 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 text-[15px] leading-7 text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/35 focus:bg-white/[0.06]"
          />
        </div>

        <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 md:flex-row md:items-center">
          <p className="flex max-w-xl gap-3 text-xs leading-5 text-white/45">
            <FileText className="mt-0.5 size-4 shrink-0 text-white/45" />
            Demo mode saves your material into the same reader flow without calling any external translation API.
          </p>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
