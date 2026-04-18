"use client";

import { motion } from "framer-motion";
import { Check, ShieldCheck, Sparkles, Target } from "lucide-react";

import { GradientDivider, PremiumCard, PremiumCTA, PremiumPageShell, PremiumSection, SectionGlowLines } from "@/components/premium";
import { SiteHeader } from "@/components/site-header";

const freeFeatures = ["10 mock tests per month", "Standard test review", "Daily current affairs feed", "Standard dashboard"];
const premiumFeatures = [
  "Unlimited mock tests",
  "Real-time AI performance mentor",
  "Advanced topic-wise breakdown",
  "Priority access to new content",
  "Premium PDF notes vault",
  "Error analytics engine",
];

export default function PricingPage() {
  return (
    <PremiumPageShell>
      <SiteHeader />

      <PremiumSection className="pb-20 pt-32 md:pt-48">
        <SectionGlowLines />
        <div className="flex flex-col gap-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45 lg:mx-0"
              >
                Membership
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-7xl md:text-8xl"
              >
                Focus on results. <br />
                <span className="text-white/42">Not costs.</span>
              </motion.h1>
              <p className="mx-auto max-w-2xl text-lg leading-8 text-white/52 lg:mx-0">
                Start free, then upgrade when you want deeper analytics, higher practice volume, and a tighter feedback loop.
              </p>
            </div>

            <PremiumCard className="p-6">
              <ShieldCheck className="size-6 text-white/70" />
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">Transparent plans</h2>
              <p className="mt-3 text-sm leading-6 text-white/45">
                Keep the core learning routes available and unlock premium support when the workload increases.
              </p>
            </PremiumCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <PremiumCard className="flex h-full flex-col p-8 md:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">Basic</p>
                <h2 className="mt-4 text-4xl font-semibold">Free</h2>
                <p className="mt-4 text-base leading-7 text-white/50">Start your journey with essential practice tools and basic diagnostics.</p>
                <div className="my-8 h-px w-full bg-white/10" />
                <ul className="flex flex-col gap-4 text-sm font-medium text-white/70">
                  {freeFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="size-4 text-white/45" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="/signup" className="mt-auto inline-flex items-center justify-center rounded-lg border border-white/20 px-10 py-4 text-sm font-semibold transition-colors hover:bg-white/[0.06]">
                  Join for Free
                </a>
              </PremiumCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <PremiumCard className="relative flex h-full flex-col border-white/[0.16] bg-white/[0.055] p-8 shadow-[0_40px_120px_rgba(255,255,255,0.06)] md:p-10">
                <div className="absolute right-6 top-6 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
                  Recommended
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Ultimate</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <h2 className="text-5xl font-semibold tracking-tight">Rs 199</h2>
                  <span className="text-lg font-medium text-white/40">/ month</span>
                </div>
                <p className="mt-4 text-base leading-7 text-white/65">The complete high-performance engine for serious aspirants.</p>
                <div className="my-8 h-px w-full bg-white/10" />
                <ul className="flex flex-col gap-4 text-sm font-semibold text-white/88">
                  {premiumFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="size-4 text-white" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="/signup" className="mt-auto inline-flex items-center justify-center rounded-lg bg-white px-10 py-4 text-sm font-semibold text-black transition-colors hover:bg-white/90">
                  Go Premium
                </a>
              </PremiumCard>
            </motion.div>
          </div>

          <GradientDivider />

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Target, title: "Sharper routines", copy: "Practice and review in a tighter daily loop." },
              { icon: Sparkles, title: "Premium tools", copy: "Unlock more capacity when your schedule gets serious." },
              { icon: ShieldCheck, title: "Stable workspace", copy: "Core learning routes stay clean and dependable." },
            ].map(({ icon: Icon, title, copy }) => (
              <PremiumCard key={title} className="p-6">
                <Icon className="size-5 text-white/65" />
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/42">{copy}</p>
              </PremiumCard>
            ))}
          </div>

          <PremiumCTA
            title="Upgrade when your preparation needs more signal."
            copy="Premium adds depth around the study loop without changing the clean OrbitPrep experience."
            primaryHref="/signup"
            primaryLabel="Create account"
            secondaryHref="/test-series"
            secondaryLabel="Try a test"
          />
        </div>
      </PremiumSection>
    </PremiumPageShell>
  );
}
