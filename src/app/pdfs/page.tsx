import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireProfile } from "@/lib/auth";
import { getStudentLearningData } from "@/lib/platform";
import { FileText, Download, ExternalLink, BookOpen, Zap, ArrowRight } from "lucide-react";
export const dynamic = "force-dynamic";
export const metadata = { title: "PDF Library" };
const sourceColors: Record<string, {
    color: string;
    bg: string;
    border: string;
}> = {
    admin: { color: "#06b6d4", bg: "rgba(6,182,212,0.08)", border: "rgba(6,182,212,0.2)" },
    ai: { color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.2)" },
    upload: { color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
};
function getSourceStyle(source: string) {
    return sourceColors[source] ?? sourceColors.admin;
}
export default async function PdfLibraryPage() {
    const profile = await requireProfile();
    const learning = await getStudentLearningData(profile);
    return (<>
      <SiteHeader />
      <main style={{ background: "#050816", color: "white", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ position: "relative", padding: "80px 24px 60px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", width: "60%", height: "100%", background: "radial-gradient(ellipse at top left, rgba(16,185,129,0.07) 0%, transparent 60%)" }}/>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`, backgroundSize: "60px 60px" }}/>
          </div>
          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 12, fontWeight: 500, color: "#6ee7b7", marginBottom: 20 }}>
                  <Zap style={{ width: 12, height: 12 }}/> Free access
                </div>
                <h1 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.1 }}>
                  PDF{" "}
                  <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Library
                  </span>
                </h1>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 560, lineHeight: 1.7 }}>
                  Approved study PDFs, revision notes, current affairs digests, and AI-generated materials — all free for every student.
                </p>
              </div>
              {learning.pdfs.length > 0 && (<div style={{ padding: "14px 20px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>{learning.pdfs.length}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>PDFs available</div>
                </div>)}
            </div>
          </div>
        </section>

        {/* PDF Grid */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 100px" }}>
          {learning.pdfs.length > 0 ? (<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="grid-cols-1 md:grid-cols-2">
              {learning.pdfs.map((pdf) => {
                const src = getSourceStyle(pdf.source_type);
                return (<a key={pdf.id} href={pdf.file_url} target="_blank" rel="noopener noreferrer" style={{
                        display: "block",
                        padding: "24px",
                        borderRadius: 18,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        textDecoration: "none",
                        color: "white",
                        transition: "all 0.3s ease",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                    {/* Accent line */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${src.color}, transparent)`, opacity: 0.6 }}/>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      {/* PDF icon */}
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: src.bg, border: `1px solid ${src.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FileText style={{ width: 24, height: 24, color: src.color }}/>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                          <div style={{ padding: "3px 10px", borderRadius: 100, background: src.bg, border: `1px solid ${src.border}`, fontSize: 11, fontWeight: 600, color: src.color }}>
                            {pdf.source_type}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#10b981", fontWeight: 500 }}>
                            <Download style={{ width: 10, height: 10 }}/> Free download
                          </div>
                        </div>
                        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, lineHeight: 1.4, letterSpacing: "-0.01em" }}>
                          {pdf.title}
                        </h2>
                        <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.45)" }}>
                          {(pdf as Record<string, unknown>).description as string || "Approved study material from the OrbitPrep AI content workflow."}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Click to open PDF</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600, color: src.color }}>
                        Open <ExternalLink style={{ width: 12, height: 12 }}/>
                      </div>
                    </div>
                  </a>);
            })}
            </div>) : (<div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <BookOpen style={{ width: 28, height: 28, color: "#10b981" }}/>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No PDFs available yet</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>
                Study materials will appear here once approved by the admin team.
              </p>
              <a href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", textDecoration: "none" }}>
                Back to dashboard <ArrowRight style={{ width: 14, height: 14 }}/>
              </a>
            </div>)}
        </section>
      </main>
      <SiteFooter />
    </>);
}
