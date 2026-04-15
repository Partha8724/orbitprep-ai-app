import Link from "next/link";

import { createExamAction, createQuestionAction, createSubjectAction, createTopicAction } from "@/app/admin/actions";
import { requireAdminProfile } from "@/lib/auth";
import { getQuestionBankAdminData } from "@/lib/platform";

export const dynamic = "force-dynamic";

export const metadata = { title: "Question Bank" };

type PageProps = { searchParams: Promise<{ error?: string }> };

export default async function QuestionBankPage({ searchParams }: PageProps) {
  await requireAdminProfile();
  const params = await searchParams;
  const data = await getQuestionBankAdminData();

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm text-cyan-200 hover:text-cyan-100">Back to admin</Link>
        <h1 className="mt-3 text-4xl font-semibold">Question bank</h1>
        <p className="mt-3 max-w-3xl text-slate-300">Create exams, subjects, topics, and real answer-key backed questions for mock tests.</p>
        {params.error ? <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{params.error}</div> : null}

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <form action={createExamAction} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold">Exam</h2>
            <input name="name" required placeholder="UPSC CSE" className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <input name="slug" required placeholder="upsc-cse" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <textarea name="description" placeholder="Exam description" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <button className="mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Create exam</button>
          </form>

          <form action={createSubjectAction} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold">Subject</h2>
            <select name="exam_id" className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
              {data.exams.map((exam) => <option key={exam.id} value={exam.id}>{exam.name}</option>)}
            </select>
            <input name="name" required placeholder="Polity" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <button className="mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Create subject</button>
          </form>

          <form action={createTopicAction} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold">Topic</h2>
            <select name="subject_id" className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
              {data.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
            <input name="name" required placeholder="Fundamental Rights" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <button className="mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Create topic</button>
          </form>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form action={createQuestionAction} className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Create question</h2>
            <select name="topic_id" className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
              <option value="">No topic</option>
              {data.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
            </select>
            <textarea name="question_text" required rows={4} placeholder="Question text" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <textarea name="options" required rows={5} placeholder={"A|Option one\nB|Option two\nC|Option three\nD|Option four"} className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <input name="correct_answer" required placeholder="Correct label, e.g. A" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <textarea name="explanation" placeholder="Explanation" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <select name="difficulty" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"><option>easy</option><option>medium</option><option>hard</option></select>
              <select name="source_type" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"><option>manual</option><option>AI</option><option>previous_paper</option></select>
              <select name="status" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3"><option>approved</option><option>pending_review</option></select>
            </div>
            <input name="tags" placeholder="polity, prelims, constitution" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3" />
            <button className="mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Save question</button>
          </form>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Latest questions</h2>
            <div className="mt-5 space-y-3">
              {data.questions.map((question) => (
                <div key={question.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="text-sm text-cyan-200">{question.difficulty} · {question.source_type} · {question.status}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{question.question_text}</p>
                  <div className="mt-2 break-all font-mono text-xs text-slate-500">{question.id}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
