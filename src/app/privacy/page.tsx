import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f7f8fb] px-6 py-20 text-slate-950">
        <article className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Privacy</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em]">Privacy policy</h1>
          <div className="mt-8 space-y-5 text-base leading-8 text-slate-600">
            <p>OrbitPrep AI uses account, usage, and learning activity data to provide preparation tools, mock-test history, and platform support.</p>
            <p>Mock-test attempts created in the public demo flow are stored locally in your browser. Clearing browser storage removes those local attempts.</p>
            <p>We do not sell student preparation data. Contact support for data access, correction, or deletion requests.</p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
