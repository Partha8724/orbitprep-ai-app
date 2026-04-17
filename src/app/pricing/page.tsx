import Navbar from "@/components/Navbar";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />

      <section className="px-6 pb-20 pt-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
              Pricing
            </p>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Simple pricing for serious exam preparation
            </h1>
            <p className="mt-6 text-base text-white/75 md:text-lg">
              Start free, then unlock unlimited mock tests, AI support, current
              affairs, and deeper performance insights.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                Free
              </p>
              <h2 className="mt-4 text-3xl font-bold">₹0</h2>
              <p className="mt-3 text-white/70">
                Good for getting started.
              </p>

              <ul className="mt-8 space-y-4 text-white/85">
                <li>• Limited mock tests</li>
                <li>• Basic practice access</li>
                <li>• Intro current affairs content</li>
                <li>• Standard question review</li>
              </ul>

              <a
                href="/test-series"
                className="mt-10 inline-flex rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Start Free
              </a>
            </div>

            <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-cyan-400/10 to-white/5 p-8 shadow-[0_20px_80px_rgba(34,211,238,0.12)] backdrop-blur-xl">
              <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Most Popular
              </div>

              <p className="mt-5 text-sm uppercase tracking-[0.25em] text-white/60">
                Premium
              </p>
              <h2 className="mt-4 text-3xl font-bold">₹199/month</h2>
              <p className="mt-3 text-white/70">
                Full preparation experience for ambitious students.
              </p>

              <ul className="mt-8 space-y-4 text-white/90">
                <li>• Unlimited mock tests</li>
                <li>• AI-powered practice support</li>
                <li>• Daily current affairs access</li>
                <li>• Performance analytics</li>
                <li>• Faster exam-focused revision</li>
                <li>• Premium question sets</li>
              </ul>

              <a
                href="/signup"
                className="mt-10 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/90"
              >
                Get Premium
              </a>
            </div>
          </div>

          <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-bold">Why students upgrade</h3>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h4 className="text-lg font-semibold">More practice</h4>
                <p className="mt-2 text-white/70">
                  Take more tests and build stronger exam confidence.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h4 className="text-lg font-semibold">Better analysis</h4>
                <p className="mt-2 text-white/70">
                  Identify weak areas faster and improve smarter.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <h4 className="text-lg font-semibold">Daily focus</h4>
                <p className="mt-2 text-white/70">
                  Stay consistent with current affairs and revision support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}