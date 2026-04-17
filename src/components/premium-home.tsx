"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Layers3,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const examPaths = [
  { name: "UPSC", slug: "upsc", overview: "Polity, economy, history, geography, science, environment, ethics, and current affairs." },
  { name: "APSC", slug: "apsc", overview: "Assam-specific GK, state polity, geography, economy, and national current affairs." },
  { name: "SSC", slug: "ssc", overview: "Reasoning, quantitative aptitude, English, general awareness, and computer basics." },
  { name: "Railway", slug: "railway", overview: "Arithmetic, reasoning, general science, technical awareness, and current affairs." },
  { name: "Banking", slug: "banking", overview: "Reasoning, quantitative aptitude, English, banking awareness, and economics." },
  { name: "Police", slug: "police", overview: "State GK, law basics, reasoning, physical-test awareness, and current affairs." },
  { name: "State PSC", slug: "state-psc", overview: "State-specific GK, polity, geography, history, and public administration." },
  { name: "Teaching", slug: "teaching", overview: "Child development, pedagogy, language, mathematics, EVS, and GK." },
  { name: "Defence", slug: "defence", overview: "NDA, CDS, AFCAT, general ability, mathematics, and defence awareness." },
  { name: "Assam Govt Jobs", slug: "assam-govt-jobs", overview: "Assam history, geography, culture, polity, schemes, and job-focused GK." },
];

const subjectTracks = [
  { title: "Galaxy UI", slug: "galaxy-ui" },
  { title: "Earth Knowledge", slug: "earth-knowledge" },
  { title: "Economy Radar", slug: "economy-radar" },
  { title: "History Vault", slug: "history-vault" },
  { title: "Science Pulse", slug: "science-pulse" },
  { title: "GK Stream", slug: "gk-stream" },
];
const platform = [
  {
    href: "/ai-mentor",
    title: "AI Mentor",
    copy: "Ask for study plans, explanations, current affairs summaries, and next-topic recommendations.",
    icon: Bot,
  },
  {
    href: "/test-series",
    title: "Mock Test Studio",
    copy: "Take timed UPSC, APSC, and SSC tests with scoring, analytics, and answer review.",
    icon: Trophy,
  },
  {
    href: "/daily-questions",
    title: "Daily Practice",
    copy: "Build accuracy with high-signal MCQs mapped to government exam patterns.",
    icon: CheckCircle2,
  },
  {
    href: "/current-affairs",
    title: "Current Affairs",
    copy: "Read exam-oriented daily summaries connected to static syllabus areas.",
    icon: Newspaper,
  },
  {
    href: "/pdfs",
    title: "PDF Library",
    copy: "Use concise notes, revision sheets, and previous paper resources from one place.",
    icon: FileText,
  },
  {
    href: "/exams",
    title: "Exam Hubs",
    copy: "Follow dedicated paths for UPSC, APSC, SSC, Banking, Railway, Defence, and Assam jobs.",
    icon: ShieldCheck,
  },
];

export function PremiumHome() {
  return (
    <main className="bg-[#f7f8fb] text-slate-950">
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#eef4ff_82%,#f7f8fb_100%)] px-6 pb-12 pt-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:min-h-[760px] lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
              <Sparkles className="size-4 text-cyan-700" />
              Premium AI prep for UPSC, APSC, and SSC
            </div>
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-7xl lg:text-8xl">
              Prepare like every minute has a purpose.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              OrbitPrep AI brings mentor guidance, timed mock tests, current affairs, PDF notes, and progress analytics into one calm study workspace.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/test-series"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Take a mock test
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/exams"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-200"
              >
                Browse exam paths
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ["3", "core exams"],
                ["15+", "sample MCQs"],
                ["24/7", "AI guidance"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur">
                  <p className="text-2xl font-semibold tracking-[-0.03em]">{value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-lg border border-white bg-white p-2 shadow-2xl shadow-slate-950/15">
              <Image
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
                alt="Student studying with a laptop"
                width={1200}
                height={800}
                priority
                className="h-[360px] w-full rounded-md object-cover sm:h-[520px]"
              />
            </div>
            <div className="absolute -bottom-6 left-4 right-4 rounded-lg border border-slate-200 bg-white/92 p-4 shadow-2xl shadow-slate-950/15 backdrop-blur sm:left-10 sm:right-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Today&apos;s prep rhythm</p>
                  <p className="mt-1 text-xs text-slate-500">Polity test, Assam GK review, current affairs recap</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                  <BarChart3 className="size-6" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Plan", "Practice", "Review"].map((item) => (
                  <div key={item} className="rounded-md bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-600">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Learning system</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              One platform for the full preparation loop.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {platform.map((item, index) => (
              <motion.div
                key={item.href}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <Link
                  href={item.href}
                  className="group block h-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-950/10"
                >
                  <div className="flex size-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <item.icon className="size-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.copy}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
                    Open
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Mock test engine</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Timer, scoring, results, and review are ready.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Students can attempt tests without friction, submit automatically on timeout, see score breakdowns, and review every answer with explanations.
            </p>
            <Link
              href="/test-series"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-4 text-sm font-semibold text-white"
            >
              Launch mock tests
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Clock, title: "Live timer", copy: "Auto-submit keeps attempts realistic." },
              { icon: Trophy, title: "Exam scoring", copy: "Correct, wrong, skipped, and negative marks." },
              { icon: Layers3, title: "Question flow", copy: "Palette navigation with stable state." },
              { icon: BookOpen, title: "Answer review", copy: "Explanations and topic-level analysis." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-[#f7f8fb] p-6">
                <item.icon className="size-6 text-emerald-700" />
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Exam coverage</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Choose your path.</h2>
            </div>
            <Link href="/exams" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700">
              View all exams
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {examPaths.map((exam) => (
              <Link key={exam.slug} href={`/exams/${exam.slug}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-200">
                <GraduationCap className="size-5 text-cyan-700" />
                <p className="mt-4 font-semibold">{exam.name}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{exam.overview}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-lg bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">Subject tracks</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Study by syllabus, not by scattered tabs.
              </h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {subjectTracks.map((section) => (
                <Link
                  key={section.slug}
                  href={`/subjects/${section.slug}`}
                  className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                >
                  {section.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}




