import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireProfile } from "@/lib/auth";
import { getStudentLearningData } from "@/lib/platform";

export const dynamic = "force-dynamic";
export const metadata = { title: "PDF Library" };

export default async function PdfLibraryPage() {
  const profile = await requireProfile();
  const learning = await getStudentLearningData(profile);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100">Free access</div>
        <h1 className="mt-5 text-5xl font-semibold">PDF Library</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">Approved study PDFs, revision notes, current affairs digests, and AI-generated materials are available to every student during launch.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {learning.pdfs.map((pdf) => <a key={pdf.id} href={pdf.file_url} className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/40"><div className="text-sm text-cyan-200">{pdf.source_type} · Free download</div><h2 className="mt-3 text-2xl font-semibold">{pdf.title}</h2><p className="mt-3 text-sm leading-6 text-slate-300">{pdf.description || "Approved study material from the OrbitPrep AI content workflow."}</p></a>)}
          {learning.pdfs.length === 0 ? <p className="text-slate-400">No approved PDFs are available yet.</p> : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}