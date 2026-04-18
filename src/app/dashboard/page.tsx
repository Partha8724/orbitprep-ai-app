import Link from "next/link";
import { ArrowRight, BookOpen, Languages, Target, TrendingUp } from "lucide-react";

import Navbar from "@/components/Navbar";
import { GradientDivider, PremiumCard, PremiumPageShell, PremiumSection, SectionGlowLines } from "@/components/premium";
import { requireProfile } from "@/lib/auth";
import { mockTests } from "@/lib/mock-tests";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getLanguageLabel } from "@/lib/translator/languages";

function getTestName(testId: string) {
  const test = mockTests.find((item) => item.id === testId);
  return test ? test.title : "Practice Test";
}

function calculateStreak(attempts: any[]) {
  if (!attempts || attempts.length === 0) return 0;
  const dates = attempts.map((attempt) => new Date(attempt.created_at).toDateString());
  const uniqueDates = Array.from(new Set(dates));
  let streak = 0;
  const today = new Date();
  for (let index = 0; index < uniqueDates.length; index += 1) {
    const checkDate = new Date();
    checkDate.setDate(today.getDate() - index);
    if (uniqueDates.includes(checkDate.toDateString())) streak += 1;
    else break;
  }
  return streak;
}

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = await createSupabaseServerClient();

  const { data: attempts, error: attemptsError } = await supabase
    .from("test_attempts")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  const { data: translationJobs, error: translationJobsError } = await supabase
    .from("translation_jobs")
    .select("id, title, target_language, status, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(4);

  const safeAttempts = attemptsError ? [] : attempts || [];
  const safeTranslationJobs = translationJobsError ? [] : translationJobs || [];

  const totalTests = safeAttempts.length;
  const avgScore = totalTests > 0 ? Math.round(safeAttempts.reduce((acc, curr) => acc + (curr.score_percent || 0), 0) / totalTests) : 0;
  const streak = calculateStreak(safeAttempts);

  const recentTests = safeAttempts.slice(0, 5).map((attempt) => ({
    id: attempt.id,
    name: getTestName(attempt.mock_test_id),
    score: `${attempt.score_percent}%`,
    date: new Date(attempt.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" }),
  }));

  const topicScores: Record<string, { total: number; correct: number }> = {};
  safeAttempts.forEach((attempt) => {
    const rawBreakdown = attempt.topic_breakdown as any;
    const breakdown = Array.isArray(rawBreakdown)
      ? rawBreakdown
      : Object.entries(rawBreakdown || {}).map(([topic, stats]) => ({ topic, ...(stats as Record<string, number>) }));
    breakdown.forEach((topic) => {
      if (!topicScores[topic.topic]) topicScores[topic.topic] = { total: 0, correct: 0 };
      topicScores[topic.topic].total += topic.total || 0;
      topicScores[topic.topic].correct += topic.correct || 0;
    });
  });

  const weakAreas = Object.entries(topicScores)
    .filter(([, stats]) => stats.total > 0 && stats.correct / stats.total < 0.6)
    .map(([topic]) => topic)
    .slice(0, 3);

  const stats = [
    { title: "Total Tests", value: totalTests.toString(), icon: BookOpen },
    { title: "Avg. Accuracy", value: `${avgScore}%`, icon: TrendingUp },
    { title: "Daily Streak", value: `${streak} days`, icon: Target },
    { title: "Account Tier", value: profile.is_premium ? "Premium" : "Free", icon: Languages },
  ];

  return (
    <PremiumPageShell>
      <Navbar />

      <PremiumSection className="pb-20 pt-32 md:pt-40">
        <SectionGlowLines />
        <div className="flex flex-col gap-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                Learning Analytics
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
                Hello, {profile.full_name.split(" ")[0]}.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/52">
                Your preparation is evolving. Keep tests, translations, and weak-area signals in one focused workspace.
              </p>
            </div>
            <PremiumCard className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">Today</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">Choose the next useful action.</h2>
              <div className="mt-6 grid gap-3">
                <Link href="/test-series" className="rounded-lg bg-white px-5 py-3 text-center text-sm font-semibold text-black transition-colors hover:bg-white/90">
                  Start test
                </Link>
                <Link href="/translator" className="rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-center text-sm font-semibold text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white">
                  Save notes
                </Link>
              </div>
            </PremiumCard>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map(({ title, value, icon: Icon }) => (
              <PremiumCard key={title} className="p-5 md:p-6">
                <Icon className="size-5 text-white/55" />
                <p className="mt-6 text-xs font-medium text-white/40">{title}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{value}</h2>
              </PremiumCard>
            ))}
          </div>

          <GradientDivider />

          <div className="grid gap-6 lg:grid-cols-3">
            <PremiumCard className="p-6 lg:col-span-2 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Recent sessions</h3>
                <Link href="/test-series" className="rounded-lg bg-white px-5 py-3 text-xs font-semibold text-black transition-colors hover:bg-white/90">
                  Start new test
                </Link>
              </div>

              <div className="mt-6 grid gap-3">
                {recentTests.length > 0 ? recentTests.map((test) => (
                  <Link key={test.id} href={`/test-series/results/${test.id}`} className="group flex items-center justify-between rounded-lg border border-white/10 bg-black/25 p-4 transition-colors hover:bg-white/[0.055]">
                    <div>
                      <h4 className="text-sm font-semibold text-white/90">{test.name}</h4>
                      <p className="mt-1 text-xs text-white/35">{test.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-white/[0.07] px-3 py-2 text-sm font-semibold text-white/80">{test.score}</span>
                      <ArrowRight className="size-4 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white/70" />
                    </div>
                  </Link>
                )) : (
                  <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.12] text-center text-white/35">
                    <p className="text-sm font-medium">Your activity history will appear here.</p>
                  </div>
                )}
              </div>
            </PremiumCard>

            <div className="grid gap-6">
              <PremiumCard className="p-6">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Focus points</h3>
                <div className="mt-5 grid gap-3">
                  {weakAreas.length > 0 ? weakAreas.map((item) => (
                    <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-white/72">
                      {item}
                    </div>
                  )) : (
                    <p className="text-sm italic leading-6 text-white/35">
                      {totalTests === 0 ? "Complete a diagnostic test to unlock focus insights." : "No major focus points identified."}
                    </p>
                  )}
                </div>
              </PremiumCard>

              <PremiumCard className="p-6">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Quick actions</h3>
                <div className="mt-5 grid gap-3">
                  <Link href="/translator" className="rounded-lg border border-white/10 bg-white/[0.04] py-4 text-center text-sm font-semibold text-white/78 transition-colors hover:bg-white/[0.08] hover:text-white">
                    Translate study material
                  </Link>
                  <Link href="/ai-mentor" className="rounded-lg border border-white/10 bg-white/[0.04] py-4 text-center text-sm font-semibold text-white/78 transition-colors hover:bg-white/[0.08] hover:text-white">
                    Ask AI mentor
                  </Link>
                  <Link href="/pricing" className="rounded-lg bg-white py-4 text-center text-sm font-semibold text-black transition-colors hover:bg-white/90">
                    Upgrade to premium
                  </Link>
                </div>
              </PremiumCard>
            </div>

            <PremiumCard className="p-6 lg:col-span-2 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em]">Study Material Translator</h3>
                  <p className="mt-2 text-sm leading-6 text-white/42">Recent saved readers for revision.</p>
                </div>
                <Link href="/translator" className="shrink-0 rounded-lg bg-white px-5 py-3 text-xs font-semibold text-black transition-colors hover:bg-white/90">
                  Translate
                </Link>
              </div>

              <div className="mt-6 grid gap-3">
                {safeTranslationJobs.length > 0 ? safeTranslationJobs.map((job) => (
                  <Link key={job.id} href={`/translator/${job.id}`} className="group flex items-center justify-between rounded-lg border border-white/10 bg-black/25 p-4 transition-colors hover:bg-white/[0.055]">
                    <div>
                      <h4 className="text-sm font-semibold text-white/90">{job.title}</h4>
                      <p className="mt-1 text-xs text-white/35">
                        {getLanguageLabel(job.target_language)} - {new Date(job.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <span className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                      {job.status}
                    </span>
                  </Link>
                )) : (
                  <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.12] text-center text-white/35">
                    <p className="max-w-md text-sm leading-6">Demo mode translation keeps notes available in the reader while real translation is prepared.</p>
                  </div>
                )}
              </div>
            </PremiumCard>
          </div>
        </div>
      </PremiumSection>
    </PremiumPageShell>
  );
}
