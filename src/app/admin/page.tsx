import Link from "next/link";
import { BookOpen, Brain, FileText, Newspaper, ShieldCheck, Trophy, UsersRound } from "lucide-react";

import { logoutAction } from "@/app/auth-actions";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminAnalytics } from "@/lib/platform";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
};

const adminLinks = [
  { href: "/admin/content", label: "AI content pipeline", icon: Brain },
  { href: "/admin/question-bank", label: "Question bank", icon: BookOpen },
  { href: "/admin/tests", label: "Mock tests", icon: Trophy },
  { href: "/admin/pdfs", label: "PDF library", icon: FileText },
  { href: "/admin/current-affairs", label: "Current affairs", icon: Newspaper },
];

export default async function AdminPage() {
  const profile = await requireAdminProfile();
  const analytics = await getAdminAnalytics();
  const cards = [
    { label: "Total users", value: analytics.users },
    { label: "Premium users", value: analytics.premiumUsers },
    { label: "Total PDFs", value: analytics.pdfs },
    { label: "Total questions", value: analytics.questions },
    { label: "Test attempts", value: analytics.attempts },
    { label: "AI generation logs", value: analytics.aiLogs },
    { label: "Approval queue", value: analytics.approvalQueue },
  ];

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/dashboard" className="text-sm text-cyan-200 hover:text-cyan-100">
              Back to dashboard
            </Link>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Admin control center</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              {profile.full_name} can manage AI generation, review queues, question banks, tests, PDFs, and current affairs publishing.
            </p>
          </div>

          <form action={logoutAction}>
            <button className="rounded-2xl border border-white/10 bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100">
              Log out
            </button>
          </form>
        </header>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="text-sm text-slate-400">{card.label}</div>
              <div className="mt-3 text-3xl font-semibold">{card.value}</div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/40 hover:bg-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-100">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-5 text-lg font-semibold">{item.label}</div>
              </Link>
            );
          })}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <ShieldCheck className="h-7 w-7 text-emerald-200" />
            <h2 className="mt-4 text-xl font-semibold">Review gate enforced</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Student routes only read approved or published content. Admin drafts and AI generations stay in review queues until approved.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <UsersRound className="h-7 w-7 text-cyan-200" />
            <h2 className="mt-4 text-xl font-semibold">Free launch delivery</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Premium labels remain as admin metadata, but all student-facing learning assets are open during the free launch phase.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
