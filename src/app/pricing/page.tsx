import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-semibold">Pricing</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          Full premium support for just ₹199 per month, including AI mentor access, PDFs, patterns, and tests.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}