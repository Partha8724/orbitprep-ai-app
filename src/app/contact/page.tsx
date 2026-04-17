import { Mail } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f7f8fb] px-6 py-20 text-slate-950">
        <section className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <Mail className="size-8 text-cyan-700" />
          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.04em]">Contact OrbitPrep AI</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            For support, partnerships, content corrections, or institutional access, write to the OrbitPrep AI team.
          </p>
          <a
            href="mailto:support@orbitprep.ai"
            className="mt-8 inline-flex rounded-lg bg-slate-950 px-6 py-4 text-sm font-semibold text-white"
          >
            support@orbitprep.ai
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
