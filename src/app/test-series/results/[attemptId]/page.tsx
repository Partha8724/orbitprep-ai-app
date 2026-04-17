import Link from "next/link";

import { MockTestResults } from "@/components/mock-test-results";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Mock Test Result" };

type PageProps = { params: Promise<{ attemptId: string }> };

export default async function TestResultPage({ params }: PageProps) {
  const { attemptId } = await params;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#05070d] px-6 py-10 text-white sm:py-14">
        <div className="mx-auto max-w-7xl">
          <Link href="/test-series" className="text-sm font-semibold text-cyan-100/80 hover:text-cyan-100">
            Back to tests
          </Link>
          <div className="mt-6">
            <MockTestResults attemptId={attemptId} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
