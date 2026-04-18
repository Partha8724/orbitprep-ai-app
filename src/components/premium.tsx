import Link from "next/link";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "left" | "center";
};

export function PremiumPageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <main className={`relative isolate min-h-screen overflow-hidden bg-[#030303] text-white selection:bg-white selection:text-black ${className}`}>
      <PremiumSectionBackground fixed />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </main>
  );
}

export function PremiumSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`relative mx-auto max-w-7xl px-6 py-24 md:px-12 md:py-32 ${className}`}>
      {children}
    </section>
  );
}

export function PremiumCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-white/[0.1] bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.075),transparent_36%,rgba(125,211,252,0.045))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function PremiumSectionBackground({ fixed = false, className = "" }: { fixed?: boolean; className?: string }) {
  return (
    <div className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 ${fixed ? "z-0" : "-z-10"} overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[#030303]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_10%,rgba(56,189,248,0.13),transparent_32%),radial-gradient(ellipse_at_82%_18%,rgba(129,140,248,0.09),transparent_34%),radial-gradient(ellipse_at_50%_115%,rgba(255,255,255,0.09),transparent_42%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),transparent_18%,transparent_72%,rgba(255,255,255,0.04))]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.42)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_68%,transparent)]" />
    </div>
  );
}

export function SectionGlowLines({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <div className="absolute left-1/2 top-0 h-px w-[72rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-100/20 to-transparent" />
      <div className="absolute -left-24 top-20 h-[32rem] w-[32rem] rounded-full border border-cyan-100/[0.06]" />
      <div className="absolute -right-28 bottom-12 h-[28rem] w-[28rem] rounded-full border border-white/[0.055]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}

export function GradientDivider() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-white/16 to-transparent" />;
}

export function SectionHeading({ eyebrow, title, copy, align = "left" }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-5 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-4xl"}`}>
      <p className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-6xl">
        {title}
      </h2>
      {copy && <p className="max-w-2xl text-base leading-7 text-white/50 md:text-lg md:leading-8">{copy}</p>}
    </div>
  );
}

export function PremiumCTA({
  title,
  copy,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  copy: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <PremiumCard className="overflow-hidden p-8 md:p-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">Next step</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/50">{copy}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={primaryHref} className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90">
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link href={secondaryHref} className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white">
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </PremiumCard>
  );
}
