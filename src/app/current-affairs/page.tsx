import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentProfile } from "@/lib/auth";
import { getStudentLearningData } from "@/lib/platform";
import { Newspaper, Calendar, Tag, ArrowRight, Globe } from "lucide-react";
export const dynamic = "force-dynamic";
export const metadata = { title: "Current Affairs" };
const categoryColors: Record<string, {
    color: string;
    bg: string;
    border: string;
}> = {
    Politics: { color: "#06b6d4", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)" },
    Economy: { color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
    Science: { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
    Sports: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
    International: { color: "#ec4899", bg: "rgba(236,72,153,0.08)", border: "rgba(236,72,153,0.2)" },
    General: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
};
function getCategoryStyle(category?: string | null) {
    if (category && categoryColors[category])
        return categoryColors[category];
    return categoryColors.General;
}
export default async function CurrentAffairsPage() {
    const profile = await getCurrentProfile();
    const learning = profile
        ? await getStudentLearningData(profile)
        : { currentAffairs: [] as Awaited<ReturnType<typeof getStudentLearningData>>["currentAffairs"] };
    return (<>
      <SiteHeader />
      <main style={{ background: "#050816", color: "white", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ position: "relative", padding: "80px 24px 60px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, right: "10%", width: "60%", height: "100%", background: "radial-gradient(ellipse at top right, rgba(236,72,153,0.07) 0%, transparent 60%)" }}/>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`, backgroundSize: "60px 60px" }}/>
          </div>
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)", fontSize: 12, fontWeight: 500, color: "#f9a8d4", marginBottom: 20 }}>
                  <Globe style={{ width: 12, height: 12 }}/> Exam-ready summaries
                </div>
                <h1 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.1 }}>
                  Current{" "}
                  <span style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Affairs
                  </span>
                </h1>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 560, lineHeight: 1.7 }}>
                  Approved daily current affairs entries and quiz-ready summaries curated for exam revision.
                </p>
              </div>
              {learning.currentAffairs.length > 0 && (<div style={{ padding: "14px 20px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#ec4899" }}>{learning.currentAffairs.length}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Articles available</div>
                </div>)}
            </div>
          </div>
        </section>

        {/* Content */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 100px" }}>
          {learning.currentAffairs.length > 0 ? (<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="grid-cols-1 md:grid-cols-2">
              {learning.currentAffairs.map((entry) => {
                const cat = getCategoryStyle(entry.category);
                return (<article key={entry.id} style={{
                        padding: "24px",
                        borderRadius: 18,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        transition: "all 0.3s ease",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                    {/* Top accent */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${cat.color}, transparent)`, opacity: 0.6 }}/>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                      {entry.category && (<div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, background: cat.bg, border: `1px solid ${cat.border}` }}>
                          <Tag style={{ width: 10, height: 10, color: cat.color }}/>
                          <span style={{ fontSize: 11, fontWeight: 600, color: cat.color }}>{entry.category}</span>
                        </div>)}
                      {entry.published_date && (<div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                          <Calendar style={{ width: 10, height: 10 }}/>
                          {entry.published_date}
                        </div>)}
                    </div>

                    <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4, marginBottom: 12, letterSpacing: "-0.01em" }}>
                      {entry.title}
                    </h2>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: "rgba(255,255,255,0.5)" }}>
                      {entry.summary}
                    </p>

                    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: cat.color }}>
                      Read more <ArrowRight style={{ width: 12, height: 12 }}/>
                    </div>
                  </article>);
            })}
            </div>) : (<div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Newspaper style={{ width: 28, height: 28, color: "#ec4899" }}/>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No current affairs yet</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
                {profile ? "Approved entries will appear here." : "Log in to view current affairs."}
              </p>
              {!profile && (<a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#ec4899", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", textDecoration: "none" }}>
                  Sign in to access <ArrowRight style={{ width: 14, height: 14 }}/>
                </a>)}
            </div>)}
        </section>
      </main>
      <SiteFooter />
    </>);
}
