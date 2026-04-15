import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function CurrentAffairsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-semibold">Current Affairs</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          Daily current affairs updates, revision notes, and PDF-based preparation support.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}