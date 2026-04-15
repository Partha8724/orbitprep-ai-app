import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200">
          India-focused AI exam platform
        </div>

        <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
          Crack government exams with{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
            OrbitPrep AI
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Previous year paper analysis, current affairs PDFs, test series, AI mentor,
          and guided preparation for UPSC, APSC, SSC, Banking, Railway and more.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/exams" className="rounded-2xl bg-white px-7 py-3 font-medium text-slate-950">
            Explore Exams
          </Link>
          <Link href="/pricing" className="rounded-2xl border border-white/15 bg-white/5 px-7 py-3 font-medium text-white">
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}