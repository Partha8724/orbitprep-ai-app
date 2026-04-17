"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, Send, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { type MockOption, type MockTest, scoreMockAttempt } from "@/lib/mock-tests";

const storageKey = "orbitprep_mock_attempts";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function saveAttempt(attempt: ReturnType<typeof scoreMockAttempt>) {
  const existing = JSON.parse(window.localStorage.getItem(storageKey) || "[]") as unknown[];
  window.localStorage.setItem(storageKey, JSON.stringify([attempt, ...existing].slice(0, 25)));
}

export function MockTestRunner({ test }: { test: MockTest }) {
  const router = useRouter();
  const totalSeconds = Math.max(1, test.durationMinutes) * 60;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [answers, setAnswers] = useState<Record<string, MockOption["label"] | "">>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentQuestion = test.questions[currentIndex];

  const answeredCount = useMemo(
    () => test.questions.filter((question) => Boolean(answers[question.id])).length,
    [answers, test.questions]
  );
  const progress = Math.round((answeredCount / test.questions.length) * 100);

  const submitAttempt = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const attempt = scoreMockAttempt(test, answers, totalSeconds - secondsLeft);
    saveAttempt(attempt);
    router.push(`/test-series/results/${attempt.id}`);
  };

  useEffect(() => {
    if (isSubmitting) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isSubmitting]);

  useEffect(() => {
    if (secondsLeft === 0 && !isSubmitting) {
      submitAttempt();
    }
    // submitAttempt intentionally reads the latest state when the timer expires.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isSubmitting]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="min-w-0">
        <div className="sticky top-20 z-30 mb-5 rounded-lg border border-white/10 bg-[#0b1020]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-rose-300/20 bg-rose-300/10 text-rose-100">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Time left</p>
                <p className="text-2xl font-semibold text-white">{formatTime(secondsLeft)}</p>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between text-xs text-white/45">
                <span>{answeredCount} answered</span>
                <span>{progress}% complete</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={submitAttempt}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            >
              <Send className="size-4" />
              Submit
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                Question {currentIndex + 1} of {test.questions.length}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                {currentQuestion.topic}
              </span>
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
                {currentQuestion.difficulty}
              </span>
            </div>

            <h1 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-3xl">
              {currentQuestion.question}
            </h1>

            <div className="mt-8 grid gap-3">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.id] === option.label;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() =>
                      setAnswers((value) => ({
                        ...value,
                        [currentQuestion.id]: option.label,
                      }))
                    }
                    className={`flex min-h-16 items-start gap-4 rounded-lg border p-4 text-left transition ${
                      selected
                        ? "border-cyan-300/60 bg-cyan-300/12 text-white shadow-lg shadow-cyan-950/40"
                        : "border-white/10 bg-slate-950/50 text-white/75 hover:border-white/25 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-md border text-sm font-semibold ${
                        selected ? "border-cyan-200 bg-cyan-200 text-slate-950" : "border-white/15 bg-white/5 text-white"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="pt-1 text-sm leading-6 sm:text-base">{option.text}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setAnswers((value) => ({ ...value, [currentQuestion.id]: "" }))}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10"
              >
                <XCircle className="size-4" />
                Clear answer
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="size-4" />
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentIndex === test.questions.length - 1}
                  onClick={() => setCurrentIndex((value) => Math.min(test.questions.length - 1, value + 1))}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </section>

      <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-24 lg:h-fit">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Flag className="size-4 text-amber-200" />
          Question palette
        </div>
        <div className="mt-5 grid grid-cols-5 gap-2">
          {test.questions.map((question, index) => {
            const answered = Boolean(answers[question.id]);
            const active = index === currentIndex;
            return (
              <button
                key={question.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`flex aspect-square items-center justify-center rounded-lg border text-sm font-semibold transition ${
                  active
                    ? "border-white bg-white text-slate-950"
                    : answered
                      ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-100"
                      : "border-white/10 bg-slate-950/60 text-white/55 hover:border-white/25"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-6 space-y-3 text-sm text-white/55">
          <div className="flex items-center justify-between">
            <span>Attempted</span>
            <span className="font-semibold text-white">{answeredCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Skipped</span>
            <span className="font-semibold text-white">{test.questions.length - answeredCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Negative marking</span>
            <span className="font-semibold text-white">-{test.negativeMarks}</span>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-emerald-300/15 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50/80">
          <CheckCircle2 className="mb-2 size-5 text-emerald-200" />
          You can jump between questions freely. The test submits automatically when the timer ends.
        </div>
      </aside>
    </div>
  );
}
