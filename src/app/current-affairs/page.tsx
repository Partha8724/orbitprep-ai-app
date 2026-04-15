import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentProfile } from "@/lib/auth";
import { getStudentLearningData } from "@/lib/platform";

export const dynamic = "force-dynamic";

export default async function CurrentAffairsPage() {
  const profile = await getCurrentProfile();
  const learning = profile ? await getStudentLearningData(profile) : { currentAffairs: [] };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-semibold">Current Affairs</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">Approved daily current affairs entries and quiz-ready summaries for exam revision.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {learning.currentAffairs.map((entry) => <article key={entry.id} className="rounded-[28px] border border-white/10 bg-white/5 p-6"><div className="text-sm text-cyan-200">{entry.published_date} · {entry.category || "General"}</div><h2 className="mt-3 text-2xl font-semibold">{entry.title}</h2><p className="mt-3 text-sm leading-7 text-slate-300">{entry.summary}</p><div className="mt-4 text-xs text-slate-400">Free launch access</div></article>)}
          {learning.currentAffairs.length === 0 ? <p className="text-slate-400">Log in to view approved current affairs available yet.</p> : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
