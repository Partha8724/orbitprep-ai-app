import Link from "next/link";
import { Bot, BookOpen, ClipboardList, FileText, Newspaper, ShieldCheck, Sparkles, Trophy, UserRound } from "lucide-react";

import { logoutAction } from "@/app/auth-actions";
import { requireProfile } from "@/lib/auth";
import { getStudentLearningData } from "@/lib/platform";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

const studentSections = [
  { href: "/daily-questions", title: "Daily questions", copy: "Practice approved AI and admin-reviewed MCQs every day.", icon: ClipboardList },
  { href: "/test-series", title: "Mock tests", copy: "Attempt published tests with server-side scoring and accuracy history.", icon: Trophy },
  { href: "/pdfs", title: "PDF library", copy: "Download approved revision PDFs, current affairs digests, and study notes.", icon: FileText },
  { href: "/ai-mentor", title: "AI mentor", copy: "Ask for strategy, weak-topic help, explanations, and daily study planning.", icon: Bot },
  { href: "/current-affairs", title: "Current affairs", copy: "Read exam-ready summaries from the approved content workflow.", icon: Newspaper },
  { href: "/previous-papers", title: "Previous papers", copy: "Analyze repeated patterns and focus areas from older exams.", icon: BookOpen },
];

export default async function DashboardPage() {
  const profile = await requireProfile();
  const learning = await getStudentLearningData(profile);

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-sm text-cyan-200 hover:text-cyan-100">OrbitPrep AI</Link>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Welcome, {profile.full_name}</h1>
              <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-sm font-medium text-emerald-100">Free launch access</span>
            </div>
            <p className="mt-3 max-w-2xl text-slate-300">All student services are open right now: AI mentor, tests, PDFs, daily questions, current affairs, and previous-paper support.</p>
          </div>
          <form action={logoutAction}><button className="rounded-2xl border border-white/10 bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100">Log out</button></form>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"><UserRound className="h-7 w-7 text-cyan-200" /><h2 className="mt-5 text-xl font-semibold">Profile</h2><p className="mt-3 text-sm text-slate-300">{profile.email}</p></div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"><Sparkles className="h-7 w-7 text-violet-200" /><h2 className="mt-5 text-xl font-semibold">Access mode</h2><div className="mt-3 inline-flex rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm">Everything is free for students</div></div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"><ShieldCheck className="h-7 w-7 text-emerald-200" /><h2 className="mt-5 text-xl font-semibold">Role</h2><div className="mt-3 capitalize text-slate-300">{profile.role}</div>{profile.role === "admin" ? <Link href="/admin" className="mt-4 inline-flex text-sm text-cyan-200">Open admin</Link> : null}</div>
        </section>

        <section className="mt-8 rounded-[32px] border border-emerald-300/20 bg-emerald-300/10 p-6 backdrop-blur-xl md:p-8">
          <h2 className="text-2xl font-semibold">Free AI study workspace</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-emerald-50/80">Payment gates are disabled for the current launch phase. Admin premium labels remain visible only as planning metadata, but students can access every published learning asset.</p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {studentSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href} className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/40 hover:bg-white/10">
                <Icon className="h-7 w-7 text-cyan-200" />
                <h2 className="mt-5 text-xl font-semibold">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{section.copy}</p>
              </Link>
            );
          })}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6"><FileText className="h-7 w-7 text-cyan-200" /><h2 className="mt-4 text-xl font-semibold">Latest PDFs</h2><div className="mt-5 space-y-3">{learning.pdfs.map((pdf) => <a key={pdf.id} href={pdf.file_url} className="block rounded-2xl border border-white/10 bg-slate-950/60 p-4"><div className="font-semibold">{pdf.title}</div><div className="mt-1 text-sm text-slate-400">Available now · {pdf.source_type}</div></a>)}{learning.pdfs.length === 0 ? <p className="text-sm text-slate-400">No approved PDFs available yet.</p> : null}</div></div>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6"><Trophy className="h-7 w-7 text-violet-200" /><h2 className="mt-4 text-xl font-semibold">Published mock tests</h2><div className="mt-5 space-y-3">{learning.tests.map((test) => <Link key={test.id} href={`/test-series/${test.id}`} className="block rounded-2xl border border-white/10 bg-slate-950/60 p-4"><div className="font-semibold">{test.title}</div><div className="mt-1 text-sm text-slate-400">{test.duration_minutes} min · Free access</div></Link>)}{learning.tests.length === 0 ? <p className="text-sm text-slate-400">No published tests available yet.</p> : null}</div></div>
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6"><Newspaper className="h-7 w-7 text-emerald-200" /><h2 className="mt-4 text-xl font-semibold">Current affairs</h2><div className="mt-5 space-y-3">{learning.currentAffairs.map((entry) => <Link key={entry.id} href="/current-affairs" className="block rounded-2xl border border-white/10 bg-slate-950/60 p-4"><div className="font-semibold">{entry.title}</div><p className="mt-1 line-clamp-2 text-sm text-slate-400">{entry.summary}</p></Link>)}{learning.currentAffairs.length === 0 ? <p className="text-sm text-slate-400">No approved current affairs available yet.</p> : null}</div></div>
        </section>
      </div>
    </main>
  );
}