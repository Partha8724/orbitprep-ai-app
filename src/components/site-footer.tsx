import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/60">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold">OrbitPrep AI</h3>
          <p className="mt-2 text-sm text-slate-300">
            AI-powered learning support for government exam students.
          </p>
        </div>

        <div>
          <h4 className="font-medium">Quick Links</h4>
          <div className="mt-2 flex flex-col gap-2 text-sm text-slate-300">
            <Link href="/exams">Exams</Link>
            <Link href="/previous-papers">Previous Papers</Link>
            <Link href="/current-affairs">Current Affairs</Link>
          </div>
        </div>

        <div>
          <h4 className="font-medium">More</h4>
          <div className="mt-2 flex flex-col gap-2 text-sm text-slate-300">
            <Link href="/test-series">Test Series</Link>
            <Link href="/ai-mentor">AI Mentor</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}