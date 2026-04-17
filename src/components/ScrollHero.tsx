'use client';

export default function ScrollHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* VIDEO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/55" />

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-screen items-center px-6 pt-28 md:px-12 md:pt-32">
        <div className="max-w-3xl">

          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/70">
            OrbitPrep AI
          </p>

          <h1 className="text-4xl font-bold leading-tight md:text-7xl">
            Crack UPSC, APSC & Govt Exams with AI
          </h1>

          <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Premium mock tests, current affairs, and smart performance tracking.
          </p>

          {/* 🔥 PREMIUM BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">

            <a
              href="/test-series"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(255,255,255,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-white/90"
            >
              Start Free Test
            </a>

            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/15"
            >
              Explore Premium
            </a>

          </div>

        </div>
      </div>

    </section>
  );
}