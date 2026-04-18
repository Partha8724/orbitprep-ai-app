import Link from "next/link";
import { BarChart3, BookOpen, ClipboardCheck, FileText, GraduationCap, Languages, ShieldCheck, Target } from "lucide-react";

import { GradientDivider, PremiumCTA, PremiumCard, PremiumSection, PremiumSectionBackground, SectionGlowLines, SectionHeading } from "@/components/premium";

const stats = [
  { value: "9", label: "Exam language previews" },
  { value: "24/7", label: "Self-paced practice" },
  { value: "0", label: "Setup required for demo translator" },
  { value: "100%", label: "Focused study workspace" },
];

const benefits = [
  {
    icon: ClipboardCheck,
    title: "Assessment-first preparation",
    copy: "Start with diagnostics, review every attempt, and turn each session into a sharper study plan.",
  },
  {
    icon: BarChart3,
    title: "Analytics with direction",
    copy: "Dashboard insights make weak areas visible without burying you in noisy charts.",
  },
  {
    icon: Languages,
    title: "Study material reader",
    copy: "Save notes into a distraction-free reader with language-preview flows ready for real translation.",
  },
];

const examCategories = ["UPSC Foundation", "APSC Track", "Current Affairs", "Polity", "History", "Economy", "Geography", "Science"];

export function PremiumHomeSections() {
  return (
    <div className="relative isolate overflow-hidden bg-[#030303] text-white">
      <PremiumSectionBackground className="opacity-95" />
      <PremiumSection className="border-t border-white/[0.06]">
        <SectionGlowLines />
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            eyebrow="Platform depth"
            title={
              <>
                A premium workspace for serious exam prep.
              </>
            }
            copy="OrbitPrep brings practice, revision, analytics, and study material workflows into one calm learning surface."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((item) => (
              <PremiumCard key={item.label} className="p-6">
                <p className="text-4xl font-semibold tracking-[-0.04em] text-white">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-white/45">{item.label}</p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </PremiumSection>

      <GradientDivider />

      <PremiumSection className="pt-0">
        <SectionGlowLines className="opacity-70" />
        <div className="grid gap-4 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, copy }) => (
            <PremiumCard key={title} className="p-7">
              <div className="flex size-11 items-center justify-center rounded-lg bg-white text-black">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/48">{copy}</p>
            </PremiumCard>
          ))}
        </div>
      </PremiumSection>

      <PremiumSection className="pt-0">
        <SectionGlowLines className="opacity-80" />
        <PremiumCard className="overflow-hidden p-7 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">Exam coverage</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">Built around the subjects aspirants return to daily.</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/50">
                Keep your test practice, revision notes, and performance signals connected across core exam areas.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {examCategories.map((category) => (
                <Link
                  key={category}
                  href="/test-series"
                  className="group flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-4 py-4 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {category}
                  <Target className="size-4 text-white/35 transition-colors group-hover:text-white/70" />
                </Link>
              ))}
            </div>
          </div>
        </PremiumCard>
      </PremiumSection>

      <GradientDivider />

      <PremiumSection className="pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: GraduationCap, title: "Guided progression", copy: "Move from diagnostics to revision with fewer context switches." },
            { icon: FileText, title: "Readable study flow", copy: "Keep original notes and generated reader outputs easy to revisit." },
            { icon: ShieldCheck, title: "Stable by default", copy: "Demo-mode tools keep core study routes usable while premium systems expand." },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="rounded-lg border border-white/[0.08] bg-white/[0.025] p-6">
              <Icon className="size-5 text-white/65" />
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/42">{copy}</p>
            </div>
          ))}
        </div>
      </PremiumSection>

      <PremiumSection className="pt-0">
        <SectionGlowLines className="opacity-70" />
        <PremiumCTA
          title="Prepare inside one focused system."
          copy="Start with a mock test, save your study material, and let the dashboard keep your next step clear."
          primaryHref="/signup"
          primaryLabel="Start free"
          secondaryHref="/test-series"
          secondaryLabel="Explore tests"
        />
      </PremiumSection>
    </div>
  );
}
