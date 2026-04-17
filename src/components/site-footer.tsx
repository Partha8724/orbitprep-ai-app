import { Code2, Mail, MessageCircle, Video } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Platform: [
    { href: "/exams", label: "Exam Hubs" },
    { href: "/test-series", label: "Mock Tests" },
    { href: "/daily-questions", label: "Question Bank" },
    { href: "/pdfs", label: "PDF Library" },
  ],
  Resources: [
    { href: "/current-affairs", label: "Current Affairs" },
    { href: "/previous-papers", label: "Previous Papers" },
    { href: "/ai-mentor", label: "AI Mentor" },
    { href: "/subjects", label: "Subject Sections" },
  ],
  Account: [
    { href: "/login", label: "Log In" },
    { href: "/signup", label: "Sign Up Free" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/pricing", label: "Pricing" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#05070d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-white text-sm font-black text-slate-950">
                O
              </span>
              <span className="text-lg font-semibold tracking-[-0.02em]">OrbitPrep AI</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/45">
              AI-powered learning platform for Indian government exam preparation. Study smarter, test calmly, and review deeply.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: MessageCircle, href: "/contact", label: "Twitter" },
                { icon: Video, href: "/contact", label: "YouTube" },
                { icon: Code2, href: "/contact", label: "GitHub" },
                { icon: Mail, href: "/contact", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/55 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">{section}</h2>
              <div className="mt-5 grid gap-3">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-white/45 transition hover:text-cyan-100">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 OrbitPrep AI. Built for Indian government exam aspirants.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-white/70">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white/70">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

