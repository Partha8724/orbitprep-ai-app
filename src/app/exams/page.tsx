import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function ExamsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-semibold">Exams</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          Browse UPSC, APSC, SSC, Railway, Banking, Defence, Teaching and more with exam-focused preparation sections.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}