import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireProfile } from "@/lib/auth";
import { getPublishedMockTests } from "@/lib/platform";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ error?: string; message?: string }> };

export default async function TestSeriesPage({ searchParams }: PageProps) {
  const profile = await requireProfile();
  const params = await searchParams;
  const tests = await getPublishedMockTests(profile);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-semibold">Test Series</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">Published mock tests with stored attempts, score calculation, accuracy, and topic-wise breakdown.</p>
        {params.error ? <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{params.error}</div> : null}
        {params.message ? <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">{params.message}</div> : null}
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {tests.map((test) => <Link key={test.id} href={`/test-series/${test.id}`} className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/40"><div className="text-sm text-cyan-200">{test.duration_minutes} minutes · Free access</div><h2 className="mt-3 text-2xl font-semibold">{test.title}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{test.description}</p></Link>)}
          {tests.length === 0 ? <p className="text-slate-400">No tests are published yet.</p> : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
