import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { MockTestResults } from "@/components/mock-test-results";
import { PremiumPageShell, SectionGlowLines } from "@/components/premium";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Mock Test Result" };

type PageProps = { params: Promise<{ attemptId: string }> };

export default async function TestResultPage({ params }: PageProps) {
  const { attemptId } = await params;

  return (
    <PremiumPageShell>
      <SiteHeader />
      <main className="px-6 py-32 text-white sm:py-36">
        <div className="relative mx-auto max-w-7xl">
          <SectionGlowLines />
          <Link href="/test-series" className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/42 transition-colors hover:text-white">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to tests
          </Link>
          <div className="mt-6">
            <MockTestResults attemptId={attemptId} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </PremiumPageShell>
  );
}
