import Link from "next/link";

import { createPdfAction } from "@/app/admin/actions";
import { requireAdminProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "PDF Admin" };

type PageProps = { searchParams: Promise<{ error?: string }> };

export default async function AdminPdfsPage({ searchParams }: PageProps) {
  await requireAdminProfile();
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: pdfs, error } = await supabase.from("pdfs").select("id, title, file_url, is_premium, status, source_type, created_at").order("created_at", { ascending: false }).limit(30);

  if (error) throw new Error(error.message);

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-cyan-200 hover:text-cyan-100">Back to admin</Link>
        <h1 className="mt-3 text-4xl font-semibold">PDF library</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Register uploaded PDFs or AI-generated PDF content, then control premium access and publishing status.</p>
        {params.error ? <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{params.error}</div> : null}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <form action={createPdfAction} className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Add PDF</h2>
            <input name="title" required placeholder="PDF title" className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <textarea name="description" placeholder="Description" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <input name="file_url" required placeholder="Supabase Storage or CDN PDF URL" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <select name="source_type" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"><option>manual</option><option>AI</option><option>previous_paper</option></select>
            <select name="status" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"><option>approved</option><option>pending_review</option><option>rejected</option></select>
            <label className="mt-4 flex items-center gap-3 text-sm text-slate-300"><input type="checkbox" name="is_premium" /> Premium PDF</label>
            <button className="mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Save PDF</button>
          </form>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">PDF inventory</h2>
            <div className="mt-5 space-y-3">
              {(pdfs || []).map((pdf) => <div key={pdf.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"><div className="font-semibold">{pdf.title}</div><div className="mt-2 text-sm text-slate-400">{pdf.status} · {pdf.source_type} · {pdf.is_premium ? "Premium" : "Free"}</div><a className="mt-2 inline-flex break-all text-sm text-cyan-200" href={pdf.file_url}>Open PDF</a></div>)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
