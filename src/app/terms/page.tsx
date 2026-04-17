import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f7f8fb] px-6 py-20 text-slate-950">
        <article className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Terms</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em]">Terms of use</h1>
          <div className="mt-8 space-y-5 text-base leading-8 text-slate-600">
            <p>OrbitPrep AI provides preparation content, AI-assisted guidance, and practice tools for educational use.</p>
            <p>Students should verify official exam notices, eligibility, and syllabus changes from the relevant government or exam authority.</p>
            <p>Content may not be copied, resold, or redistributed as a competing preparation product without written permission.</p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
