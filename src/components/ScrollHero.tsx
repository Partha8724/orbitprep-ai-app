'use client';

import { motion } from 'framer-motion';

export default function ScrollHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#000] text-white">
      {/* Background Video with fixed path and optimization */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/file.svg" 
          className="h-full w-full object-cover opacity-60 scale-[1.05]"
          style={{ filter: 'brightness(0.7) contrast(1.1)' }}
        >
          <source src="/hero-video.mp4.mp4" type="video/mp4" />
        </video>
        {/* Apple-style gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-center px-6 pt-20 md:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-6 text-sm font-medium uppercase tracking-[0.4em] text-white/60">
                OrbitPrep AI &middot; The Future of Learning
              </p>

              <h1 className="text-5xl font-bold leading-[1.1] tracking-[-0.04em] sm:text-7xl md:text-8xl">
                Master exams with <br />
                <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                  unrivaled precision.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-white/70 md:text-xl">
                Experience the first AI-driven preparation engine designed for UPSC, APSC, and competitive government exams. Minimalist, focused, and powerful.
              </p>

              <div className="mt-12 flex flex-wrap gap-5">
                <a
                  href="/signup"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 -translate-x-full bg-slate-100 transition-transform duration-300 group-hover:translate-x-0" />
                </a>

                <a
                  href="/test-series"
                  className="group inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/40 hover:bg-white/10"
                >
                  Explore Test Series
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="h-12 w-[1px] bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
      </motion.div>
    </section>
  );
}