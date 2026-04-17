"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, CircleAlert, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getMockTest, type StoredAttempt } from "@/lib/mock-tests";

const storageKey = "orbitprep_mock_attempts";

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining}s`;
}

export function MockTestResults({ attemptId }: { attemptId: string }) {
  const [attempt, setAttempt] = useState<StoredAttempt | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const attempts = JSON.parse(window.localStorage.getItem(storageKey) || "[]") as StoredAttempt[];
      setAttempt(attempts.find((item) => item.id === attemptId) || null);
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [attemptId]);

  const test = attempt ? getMockTest(attempt.testId) : null;
  const topicStats = useMemo(() => {
    if (!attempt || !test) return [];

    const stats = new Map<string, { total: number; correct: number }>();
    test.questions.forEach((question) => {
      const current = stats.get(question.topic) || { total: 0, correct: 0 };
      current.total += 1;
      if (attempt.answers[question.id] === question.correctAnswer) {
        current.correct += 1;
      }
      stats.set(question.topic, current);
    });

    return Array.from(stats.entries())
      .map(([topic, value]) => ({
        topic,
        ...value,
        accuracy: Math.round((value.correct / value.total) * 100),
      }))
      .sort((a, b) => a.accuracy - b.accuracy);
  }, [attempt, test]);

  if (!loaded) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-white/60">
        Loading result...
      </div>
    );
  }

  if (!attempt || !test) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8">
        <CircleAlert className="size-10 text-amber-200" />
        <h1 className="mt-4 text-3xl font-semibold text-white">Result not found</h1>
        <p className="mt-3 max-w-2xl text-white/55">
          This mock-test attempt is stored locally in the browser where it was submitted. Start a new test to generate a fresh result.
        </p>
        <Link
          href="/test-series"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950"
        >
          Open test series
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  const metrics = [
    { label: "Score", value: `${attempt.score}/${attempt.maxScore}` },
    { label: "Accuracy", value: `${attempt.percentage}%` },
    { label: "Correct", value: attempt.correct.toString() },
    { label: "Wrong", value: attempt.wrong.toString() },
    { label: "Skipped", value: attempt.skipped.toString() },
    { label: "Time used", value: formatDuration(attempt.durationSeconds) },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/70">Result analysis</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-white sm:text-6xl">
              {attempt.percentage >= 70 ? "Strong attempt." : attempt.percentage >= 45 ? "Good base, tighten accuracy." : "Review first, retake next."}
            </h1>
            <p className="mt-4 text-white/55">{attempt.testTitle}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/test-series/${test.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <RotateCcw className="size-4" />
              Retake
            </Link>
            <Link
              href="/test-series"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              More tests
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-lg border border-white/10 bg-slate-950/45 p-4"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-white/35">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-semibold text-white">Topic performance</h2>
          <div className="mt-5 space-y-4">
            {topicStats.map((topic) => (
              <div key={topic.topic}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/75">{topic.topic}</span>
                  <span className="font-semibold text-white">{topic.accuracy}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-rose-300 via-amber-300 to-emerald-300"
                    style={{ width: `${topic.accuracy}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-white/35">
                  {topic.correct}/{topic.total} correct
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-semibold text-white">Answer review</h2>
          <div className="mt-5 space-y-4">
            {test.questions.map((question, index) => {
              const selected = attempt.answers[question.id];
              const correct = selected === question.correctAnswer;
              return (
                <article key={question.id} className="rounded-lg border border-white/10 bg-slate-950/45 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                      Q{index + 1}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                      {question.topic}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                        correct
                          ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                          : selected
                            ? "border-rose-300/20 bg-rose-300/10 text-rose-100"
                            : "border-amber-300/20 bg-amber-300/10 text-amber-100"
                      }`}
                    >
                      {correct ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                      {correct ? "Correct" : selected ? "Wrong" : "Skipped"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-7 text-white">{question.question}</h3>
                  <div className="mt-4 grid gap-2">
                    {question.options.map((option) => {
                      const isCorrectOption = option.label === question.correctAnswer;
                      const isSelected = option.label === selected;
                      return (
                        <div
                          key={option.label}
                          className={`rounded-lg border p-3 text-sm ${
                            isCorrectOption
                              ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-50"
                              : isSelected
                                ? "border-rose-300/30 bg-rose-300/10 text-rose-50"
                                : "border-white/10 bg-white/[0.03] text-white/55"
                          }`}
                        >
                          <strong>{option.label}.</strong> {option.text}
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50/80">
                    {question.explanation}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

