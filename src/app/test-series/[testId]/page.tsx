import Link from "next/link";

import { submitMockTestAction } from "@/app/test-series/actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ testId: string }>; searchParams: Promise<{ error?: string }> };

type Option = { label: string; text: string };

export default async function TestAttemptPage({ params, searchParams }: PageProps) {
  const { testId } = await params;
  const query = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: test, error } = await supabase
    .from("mock_tests")
    .select("id, title, description, duration_minutes, is_premium, mock_test_questions(position, questions(id, question_text, options, difficulty))")
    .eq("id", testId)
    .eq("status", "published")
    .single();

  if (error || !test) throw new Error(error?.message || "Test not found");

  const questionRows = [...(test.mock_test_questions || [])].sort((a, b) => a.position - b.position);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-20">
        <Link href="/test-series" className="text-sm text-cyan-200">Back to tests</Link>
        <div className="mt-4 inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100">Free access</div>
        <h1 className="mt-4 text-5xl font-semibold">{test.title}</h1>
        <p className="mt-4 text-slate-300">{test.description}</p>
        <p className="mt-2 text-sm text-slate-400">Duration: {test.duration_minutes} minutes</p>
        {query.error ? <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{query.error}</div> : null}
        <form action={submitMockTestAction} className="mt-10 space-y-6">
          <input type="hidden" name="test_id" value={test.id} />
          {questionRows.map((row, index) => {
            const question = Array.isArray(row.questions) ? row.questions[0] : row.questions;
            const options = (question?.options || []) as Option[];
            return <section key={question.id} className="rounded-[28px] border border-white/10 bg-white/5 p-6"><div className="text-sm text-cyan-200">Question {index + 1} · {question.difficulty}</div><h2 className="mt-3 text-xl font-semibold">{question.question_text}</h2><div className="mt-5 space-y-3">{options.map((option) => <label key={option.label} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm"><input required type="radio" name={`question_${question.id}`} value={option.label} /><span><strong>{option.label}.</strong> {option.text}</span></label>)}</div></section>;
          })}
          <button className="rounded-2xl bg-white px-6 py-3 font-semibold text-slate-950">Submit test</button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}