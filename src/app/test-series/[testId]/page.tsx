import { notFound } from "next/navigation";
import Link from "next/link";

import { MockTestRunner } from "@/components/mock-test-runner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#05070d] px-6 py-10 text-white sm:py-14">
        <div className="mx-auto max-w-7xl">
          <Link href="/test-series" className="text-sm font-semibold text-cyan-100/80 hover:text-cyan-100">
            Back to tests
          </Link>
          <section className="mb-8 mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  {test.exam} mock test
                </div>
                <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">{test.title}</h1>
                <p className="mt-4 max-w-2xl text-white/55">{test.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold">{test.durationMinutes}</p>
                  <p className="text-white/40">Minutes</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold">{test.questions.length}</p>
                  <p className="text-white/40">Questions</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold">-{test.negativeMarks}</p>
                  <p className="text-white/40">Negative</p>
                </div>
              </div>
            </div>
          </section>
          <MockTestRunner test={test} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
