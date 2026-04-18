import Link from "next/link";
import { ArrowRight, Clock, FileCheck2, History, ShieldCheck } from "lucide-react";

import Navbar from "@/components/Navbar";
import { GradientDivider, PremiumCard, PremiumCTA, PremiumPageShell, PremiumSection, SectionGlowLines } from "@/components/premium";
import { SiteFooter } from "@/components/site-footer";
import { requireProfile } from "@/lib/auth";
import { mockTests } from "@/lib/mock-tests";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function TestCenterPage() {
  const profile = await requireProfile();
  const supabase = await createSupabaseServerClient();

  const { data: attempts, error: attemptsError } = await supabase
    .from("test_attempts")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });
  const safeAttempts = attemptsError ? [] : attempts || [];

  return (
    <PremiumPageShell>
      <Navbar />

      <PremiumSection className="pb-20 pt-32 md:pt-40">
        <SectionGlowLines />
        <div className="flex flex-col gap-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                Assessment Center
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
                The standard for exam preparation.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/52">
                Select a diagnostic track to begin. Every session is tracked, analyzed, and added to your learning profile.
              </p>
            </div>
            <PremiumCard className="p-6">
              <ShieldCheck className="size-6 text-white/70" />
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">Structured practice loop</h2>
              <p className="mt-3 text-sm leading-6 text-white/45">
                Time-bound attempts, topic review, and saved history keep preparation measurable.
              </p>
            </PremiumCard>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTests.map((test) => (
              <Link
                key={test.id}
                href={`/test-series/${test.id}`}
                className="group flex min-h-80 flex-col justify-between rounded-lg border border-white/[0.08] bg-white/[0.035] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.3)] transition-colors hover:border-white/[0.16] hover:bg-white/[0.06]"
              >
                <div>
                  <div className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                    {test.exam}
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white">{test.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/45">{test.description}</p>
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                  <div className="flex gap-5">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Time</p>
                      <p className="mt-1 text-sm font-semibold text-white/70">{test.durationMinutes}m</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Questions</p>
                      <p className="mt-1 text-sm font-semibold text-white/70">{test.questions.length}</p>
                    </div>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-white text-black transition-transform group-hover:translate-x-1">
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Clock, title: "Timed sessions", copy: "Practice inside exam-like time pressure." },
              { icon: FileCheck2, title: "Topic scoring", copy: "Review strengths and weak areas after every attempt." },
              { icon: History, title: "Attempt history", copy: "Return to previous scores and compare progress." },
            ].map(({ icon: Icon, title, copy }) => (
              <PremiumCard key={title} className="p-6">
                <Icon className="size-5 text-white/65" />
                <h2 className="mt-5 text-lg font-semibold text-white">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/42">{copy}</p>
              </PremiumCard>
            ))}
          </div>

          <GradientDivider />

          {safeAttempts.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="h-px w-full bg-white/10" />
              <div className="flex flex-col gap-6">
                <h2 className="text-3xl font-semibold tracking-[-0.035em]">Your performance history</h2>
                <div className="grid gap-3">
                  {safeAttempts.slice(0, 5).map((attempt) => {
                    const test = mockTests.find((item) => item.id === attempt.mock_test_id);
                    return (
                      <Link
                        key={attempt.id}
                        href={`/test-series/results/${attempt.id}`}
                        className="group flex items-center justify-between gap-5 rounded-lg border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.055]"
                      >
                        <div>
                          <h3 className="text-sm font-semibold text-white/85">{test?.title || "Practice session"}</h3>
                          <p className="mt-1 text-xs text-white/35">
                            {new Date(attempt.created_at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <div className="flex items-center gap-5">
                          <div className="text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">Accuracy</p>
                            <p className="mt-1 text-sm font-semibold text-white/75">{attempt.score_percent}%</p>
                          </div>
                          <ArrowRight className="size-4 text-white/35 transition-transform group-hover:translate-x-1 group-hover:text-white/70" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <PremiumCTA
            title="Turn every attempt into a sharper next session."
            copy="Use diagnostics, review, and dashboard insights together to keep your study day focused."
            primaryHref="/dashboard"
            primaryLabel="Open dashboard"
            secondaryHref="/translator"
            secondaryLabel="Save study notes"
          />
        </div>
      </PremiumSection>

      <SiteFooter />
    </PremiumPageShell>
  );
}
