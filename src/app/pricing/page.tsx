import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100">Free launch access</div>
        <h1 className="mt-5 text-5xl font-semibold">Pricing</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          OrbitPrep AI student features are free right now: AI mentor, mock tests, PDFs, current affairs, previous-paper support, and daily questions.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}