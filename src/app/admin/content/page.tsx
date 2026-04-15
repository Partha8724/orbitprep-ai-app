import Link from "next/link";

import { generateAiContentAction, reviewAiGenerationAction } from "@/app/admin/actions";
import { requireAdminProfile } from "@/lib/auth";
import { getAdminQueues } from "@/lib/platform";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Content Pipeline",
};

type PageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function AdminContentPage({ searchParams }: PageProps) {
  await requireAdminProfile();
  const params = await searchParams;
  const queues = await getAdminQueues();

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-cyan-200 hover:text-cyan-100">Back to admin</Link>
        <h1 className="mt-3 text-4xl font-semibold">AI content pipeline</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Generate exam questions, current affairs summaries, revision notes, or PDF-ready content and approve it before students see it.
        </p>

        {params.error ? <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{params.error}</div> : null}
        {params.message ? <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">{params.message}</div> : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form action={generateAiContentAction} className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold">Generate content</h2>
            <div className="mt-6 space-y-4">
              <input name="title" required placeholder="Review title" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none focus:border-cyan-300/60" />
              <select name="content_type" className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none focus:border-cyan-300/60">
                <option value="questions">Questions</option>
                <option value="current_affairs">Current affairs</option>
                <option value="revision_notes">Revision notes</option>
                <option value="pdf">PDF content</option>
              </select>
              <textarea name="prompt" required rows={8} placeholder="Describe the exam, topic, difficulty, source constraints, and expected output." className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none focus:border-cyan-300/60" />
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input name="is_premium" type="checkbox" className="h-4 w-4" /> Premium-only content
              </label>
              <button className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100">Generate and queue</button>
            </div>
          </form>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold">AI review queue</h2>
            <div className="mt-6 space-y-4">
              {queues.aiGenerations.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm uppercase tracking-wide text-cyan-200">{item.content_type}</div>
                      <h3 className="mt-1 font-semibold">{item.title}</h3>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-slate-300">{item.status}</span>
                  </div>
                  <p className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.output}</p>
                  <div className="mt-4 flex gap-3">
                    <form action={reviewAiGenerationAction}>
                      <input type="hidden" name="generation_id" value={item.id} />
                      <input type="hidden" name="decision" value="approve" />
                      <button className="rounded-xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-950">Approve</button>
                    </form>
                    <form action={reviewAiGenerationAction}>
                      <input type="hidden" name="generation_id" value={item.id} />
                      <input type="hidden" name="decision" value="reject" />
                      <button className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200">Reject</button>
                    </form>
                  </div>
                </article>
              ))}
              {queues.aiGenerations.length === 0 ? <p className="text-sm text-slate-400">No AI generations yet.</p> : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
