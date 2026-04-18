import Link from "next/link";
import { ArrowRight, BookOpen, Layers } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { exams, getPublishedExams, subjectSections } from "@/lib/catalog";

export const metadata = { title: "Exams" };

export default async function ExamsPage() {
  const dbExams = await getPublishedExams();
  const examItems = dbExams.length > 0
    ? dbExams.map((exam) => ({
        name: exam.name,
        slug: exam.slug,
        overview: exam.description || "Exam preparation resources, questions, PDFs, mock tests, and current affairs will appear here.",
      }))
    : exams;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f7f8fb] px-6 py-20 text-slate-950">
        <section className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <BookOpen className="size-4" />
              Free exam hubs
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">Exam preparation hubs.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Browse UPSC, APSC, SSC, Railway, Banking, Police, State PSC, Teaching, Defence, and Assam government job preparation paths.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <Layers className="size-5 text-cyan-700" />
            <h2 className="text-xl font-semibold">All exam categories</h2>
            <span className="ml-auto rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-500 shadow-sm">{examItems.length} exams</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {examItems.map((exam) => (
              <Link key={exam.slug} href={`/exams/${exam.slug}`} className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/10">
                <div className="flex size-11 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <BookOpen className="size-5" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em]">{exam.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{exam.overview}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
                  Open preparation hub
                  <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-7xl border-t border-slate-200 pt-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-semibold tracking-[-0.04em]">Subject sections</h2>
            <p className="mt-4 text-slate-600">Deep-dive into focused subject areas across all exam categories.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {subjectSections.map((section) => (
              <Link key={section.slug} href={`/subjects/${section.slug}`} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-cyan-200">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{section.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{section.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
