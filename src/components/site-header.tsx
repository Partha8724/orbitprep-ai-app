"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, Sparkles, X } from "lucide-react";

const links = [
  { href: "/exams", label: "Exams" },
  { href: "/daily-questions", label: "Questions" },
  { href: "/pdfs", label: "PDFs" },
  { href: "/current-affairs", label: "Current Affairs" },
  { href: "/test-series", label: "Tests" },
  { href: "/ai-mentor", label: "AI Mentor" },
  { href: "/translator", label: "Translator" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "all 0.4s ease",
        background: scrolled
          ? "rgba(5, 8, 22, 0.85)"
          : "rgba(5, 8, 22, 0.4)",
        backdropFilter: scrolled ? "blur(30px)" : "blur(10px)",
        WebkitBackdropFilter: scrolled ? "blur(30px)" : "blur(10px)",
        borderBottom: scrolled
          ? "1px solid rgba(6, 182, 212, 0.15)"
          : "1px solid rgba(255,255,255,0.05)",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            style={{
              position: "relative",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Orbit ring */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1.5px solid rgba(6,182,212,0.4)",
                animation: "spin-slow 8s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 4,
                borderRadius: "50%",
                border: "1px solid rgba(139,92,246,0.3)",
                animation: "spin-slow 12s linear infinite reverse",
              }}
            />
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                boxShadow: "0 0 16px rgba(6,182,212,0.6)",
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              OrbitPrep AI
            </div>
            <div style={{ fontSize: 11, color: "rgba(6,182,212,0.8)", letterSpacing: "0.05em", marginTop: -1 }}>
              GOV EXAM PLATFORM
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  color: active ? "#06b6d4" : "rgba(255,255,255,0.7)",
                  background: active ? "rgba(6,182,212,0.1)" : "transparent",
                  border: active ? "1px solid rgba(6,182,212,0.2)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.target as HTMLAnchorElement).style.color = "white";
                    (e.target as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
                    (e.target as HTMLAnchorElement).style.background = "transparent";
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            style={{
              padding: "9px 18px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              color: "rgba(255,255,255,0.75)",
              transition: "all 0.2s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)"; }}
          >
            Log in
          </Link>
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "9px 18px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(6,182,212,0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 30px rgba(6,182,212,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(6,182,212,0.3)";
            }}
          >
            <Sparkles style={{ width: 14, height: 14 }} />
            Dashboard
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            cursor: "pointer",
          }}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(5, 8, 22, 0.97)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
          }}
          className="lg:hidden"
        >
          <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  background: pathname === link.href ? "rgba(6,182,212,0.1)" : "transparent",
                  border: pathname === link.href ? "1px solid rgba(6,182,212,0.2)" : "1px solid transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 10,
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "white",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                }}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 10,
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "white",
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                  textDecoration: "none",
                }}
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

