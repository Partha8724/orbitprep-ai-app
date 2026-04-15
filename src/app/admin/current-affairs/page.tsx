import Link from "next/link";

import { createCurrentAffairAction, reviewCurrentAffairAction } from "@/app/admin/actions";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminQueues } from "@/lib/platform";

export const dynamic = "force-dynamic";
export const metadata = { title: "Current Affairs Admin" };

type PageProps = { searchParams: Promise<{ error?: string }> };

export default async function AdminCurrentAffairsPage({ searchParams }: PageProps) {
  await requireAdminProfile();
  const params = await searchParams;
  const queues = await getAdminQueues();

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-cyan-200 hover:text-cyan-100">Back to admin</Link>
        <h1 className="mt-3 text-4xl font-semibold">Current affairs</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Create daily current affairs entries, category tags, and quiz material. Approve entries before publishing.</p>
        {params.error ? <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{params.error}</div> : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <form action={createCurrentAffairAction} className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Create entry</h2>
            <input name="title" required placeholder="Headline" className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <textarea name="summary" required rows={5} placeholder="Exam-focused summary" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <input name="category" placeholder="Polity, Economy, Science" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <input name="published_date" type="date" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <input name="tags" placeholder="assam, prelims, budget" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <textarea name="quiz_questions" rows={4} placeholder="Quiz questions generated from this entry" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <select name="status" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"><option>pending_review</option><option>approved</option><option>rejected</option></select>
            <label className="mt-4 flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" name="is_premium" /> Premium current affairs</label>
            <button className="mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Save entry</button>
          </form>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Review queue</h2>
            <div className="mt-5 space-y-3">
              {queues.currentAffairs.map((entry) => <article key={entry.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"><div className="flex justify-between gap-3"><h3 className="font-semibold">{entry.title}</h3><span className="text-xs text-slate-400">{entry.status}</span></div><p className="mt-2 text-sm leading-6 text-slate-300">{entry.summary}</p><div className="mt-4 flex gap-3"><form action={reviewCurrentAffairAction}><input type="hidden" name="current_affair_id" value={entry.id} /><input type="hidden" name="decision" value="approve" /><button className="rounded-xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-950">Approve</button></form><form action={reviewCurrentAffairAction}><input type="hidden" name="current_affair_id" value={entry.id} /><input type="hidden" name="decision" value="reject" /><button className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">Reject</button></form></div></article>)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
