import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { subjectSections } from "@/lib/catalog";

export const metadata = { title: "Subject Sections" };

export default function SubjectsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f7f8fb] px-6 py-20 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Subject sections</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">Study by syllabus area.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Open focused tracks for geography, economy, history, science, static GK, and environment-linked preparation.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {subjectSections.map((section) => (
              <Link key={section.slug} href={`/subjects/${section.slug}`} className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/10">
                <BookOpen className="size-6 text-cyan-700" />
                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em]">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{section.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {section.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
                  Open section
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
