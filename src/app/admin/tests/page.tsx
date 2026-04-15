import Link from "next/link";

import { createMockTestAction } from "@/app/admin/actions";
import { requireAdminProfile } from "@/lib/auth";
import { getMockTestAdminData } from "@/lib/platform";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mock Test Admin" };

type PageProps = { searchParams: Promise<{ error?: string }> };

export default async function AdminTestsPage({ searchParams }: PageProps) {
  await requireAdminProfile();
  const params = await searchParams;
  const data = await getMockTestAdminData();

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-cyan-200 hover:text-cyan-100">Back to admin</Link>
        <h1 className="mt-3 text-4xl font-semibold">Mock test engine</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Create scored tests from approved questions. Student attempts calculate score, accuracy, and topic breakdown.</p>
        {params.error ? <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{params.error}</div> : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <form action={createMockTestAction} className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Create test</h2>
            <input name="title" required placeholder="APSC Polity Practice Test" className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <textarea name="description" placeholder="Test description" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <input name="duration_minutes" type="number" min="1" defaultValue="60" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <textarea name="question_ids" required rows={5} placeholder="Comma-separated approved question IDs" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <select name="status" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"><option>published</option><option>draft</option></select>
            <label className="mt-4 flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" name="is_premium" /> Premium test</label>
            <button className="mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Create test</button>
          </form>

          <div className="space-y-5">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold">Published tests</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {data.tests.map((test) => <div key={test.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"><div className="font-semibold">{test.title}</div><div className="mt-2 text-sm text-slate-400">{test.status} · {test.duration_minutes} min · {test.is_premium ? "Premium" : "Free"}</div></div>)}
              </div>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-semibold">Approved question IDs</h2>
              <div className="mt-5 max-h-80 space-y-3 overflow-auto">
                {data.questions.map((question) => <div key={question.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"><div className="font-mono text-xs text-cyan-200">{question.id}</div><p className="mt-2 text-sm text-slate-300">{question.question_text}</p></div>)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
