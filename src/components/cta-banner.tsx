import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <div className="rounded-[36px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl md:p-12">
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Start preparing smarter today
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Get current affairs, AI guidance, exam patterns, and structured practice in one platform.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/pricing" className="rounded-2xl bg-white px-7 py-3 font-medium text-slate-950">
            Get Full Access
          </Link>
          <Link href="/ai-mentor" className="rounded-2xl border border-white/10 bg-white/5 px-7 py-3 font-medium text-white">
            Ask AI Mentor
          </Link>
        </div>
      </div>
    </section>
  );
}