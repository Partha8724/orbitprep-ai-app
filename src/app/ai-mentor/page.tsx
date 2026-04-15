import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function AiMentorPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="text-5xl font-semibold">AI Mentor</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          Get AI help for revision, topic planning, previous year analysis, and exam-focused learning support.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}