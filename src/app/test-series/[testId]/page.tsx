import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { MockTestRunner } from "@/components/mock-test-runner";
import Navbar from "@/components/Navbar";
import { PremiumCard, PremiumPageShell, SectionGlowLines } from "@/components/premium";
import { SiteFooter } from "@/components/site-footer";
import { getMockTest, mockTests } from "@/lib/mock-tests";

export function generateStaticParams() {
  return mockTests.map((test) => ({ testId: test.id }));
}

type PageProps = { params: Promise<{ testId: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { testId } = await params;
  const test = getMockTest(testId);
  return { title: test ? test.title : "Mock Test" };
}

export default async function TestAttemptPage({ params }: PageProps) {
  const { testId } = await params;
  const test = getMockTest(testId);

  if (!test) {
    notFound();
  }

  return (
    <PremiumPageShell>
      <Navbar />
      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-12 md:pt-40">
        <SectionGlowLines />
        <div className="flex flex-col gap-12">
          <Link href="/test-series" className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/42 transition-colors hover:text-white">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to Assessment Center
          </Link>

          <PremiumCard className="flex flex-col gap-10 p-7 md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5">
                <div className="inline-flex w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                  {test.exam} track
                </div>
                <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">{test.title}</h1>
                <p className="max-w-2xl text-lg leading-relaxed text-white/48">{test.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] p-5 text-center">
                  <p className="text-2xl font-semibold tracking-tight">{test.durationMinutes}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28">Minutes</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] p-5 text-center">
                  <p className="text-2xl font-semibold tracking-tight">{test.questions.length}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28">Items</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] p-5 text-center">
                  <p className="text-2xl font-semibold tracking-tight">-{test.negativeMarks}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28">Negative</p>
                </div>
              </div>
            </div>
          </PremiumCard>

          <MockTestRunner test={test} />
        </div>
      </div>
      <SiteFooter />
    </PremiumPageShell>
  );
}
