import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function TestSeriesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-semibold">Test Series</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          Practice timed tests, see your score, and build stronger exam confidence through digital mock exams.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}