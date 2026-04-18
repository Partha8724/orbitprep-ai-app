import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ClipboardList, Flame, ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Daily Questions" };

type QuestionRow = {
  id: string;
  question_text: string;
  options: Array<{ label: string; text: string }> | null;
  correct_answer: string;
  explanation: string | null;
  difficulty: string;
  source_type: string;
  topics: Array<{ name: string }> | { name: string } | null;
};

function topicName(topics: QuestionRow["topics"]) {
  if (Array.isArray(topics)) return topics[0]?.name || "";
  return topics?.name || "";
}

const difficultyStyle = (level: string) => {
  if (level === "hard") return { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", label: "Hard" };
  if (level === "medium") return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", label: "Medium" };
  return { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", label: "Easy" };
};

const optionLabels = ["A", "B", "C", "D"];

export default async function DailyQuestionsPage() {
  await requireProfile();
  const supabase = await createSupabaseServerClient();

  const today = new Date().toISOString().slice(0, 10);
  const { data: dailyRows, error: dailyError } = await supabase
    .from("daily_questions")
    .select("id, display_date, sort_order, questions(id, question_text, options, correct_answer, explanation, difficulty, source_type, topics(name))")
    .eq("status", "published")
    .lte("display_date", today)
    .order("display_date", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(10);

  const scheduledQuestions = dailyError
    ? []
    : ((dailyRows || []) as any[])
        .map((row) => (Array.isArray(row.questions) ? row.questions[0] : row.questions))
        .filter(Boolean);

  const fallbackQuery = scheduledQuestions.length === 0
    ? await supabase
    .from("questions")
    .select("id, question_text, options, correct_answer, explanation, difficulty, source_type, topics(name)")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
        .limit(10)
    : { data: [], error: null };

  const questions = (scheduledQuestions.length > 0 ? scheduledQuestions : fallbackQuery.data || []) as QuestionRow[];
  const loadMessage = dailyError || fallbackQuery.error
    ? "Daily practice is still being prepared. Approved questions will appear here when the database is ready."
    : null;

  return (
    <>
      <SiteHeader />
      <main style={{ background: "#050816", color: "white", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ position: "relative", padding: "80px 24px 60px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: "20%", width: "60%", height: "100%", background: "radial-gradient(ellipse at top center, rgba(16,185,129,0.07) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
          </div>
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 12, fontWeight: 500, color: "#6ee7b7", marginBottom: 20 }}>
              <Flame style={{ width: 12, height: 12 }} /> Free daily practice
            </div>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.1 }}>
              Daily{" "}
              <span style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Questions
              </span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 560, lineHeight: 1.7, margin: "0 auto" }}>
              Practice the newest approved MCQs from the AI and admin content pipeline. Answers are hidden until you reveal them.
            </p>
            {questions.length > 0 && (
              <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                <ClipboardList style={{ width: 12, height: 12 }} /> {questions.length} questions today
              </div>
            )}
            {loadMessage && (
              <div style={{ margin: "18px auto 0", maxWidth: 620, borderRadius: 12, border: "1px solid rgba(16,185,129,0.18)", background: "rgba(16,185,129,0.07)", padding: "12px 16px", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.62)" }}>
                {loadMessage}
              </div>
            )}
          </div>
        </section>

        {/* Questions */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 100px" }}>
          {questions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {questions.map((question, index) => {
                const topic = topicName(question.topics);
                const diff = difficultyStyle(question.difficulty);
                return (
                  <article
                    key={question.id}
                    style={{
                      borderRadius: 18,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Question header */}
                    <div style={{ padding: "24px 24px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>Q{index + 1}</span>
                        <div style={{ padding: "3px 10px", borderRadius: 100, background: diff.bg, border: `1px solid ${diff.border}`, fontSize: 11, fontWeight: 600, color: diff.color }}>{diff.label}</div>
                        <div style={{ padding: "3px 10px", borderRadius: 100, background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.18)", fontSize: 11, fontWeight: 500, color: "#67e8f9" }}>{question.source_type}</div>
                        {topic && (
                          <div style={{ padding: "3px 10px", borderRadius: 100, background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.18)", fontSize: 11, fontWeight: 500, color: "#c4b5fd" }}>{topic}</div>
                        )}
                      </div>
                      <h2 style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.6, marginBottom: 20, color: "rgba(255,255,255,0.92)" }}>
                        {question.question_text}
                      </h2>
                    </div>

                    {/* Options */}
                    <div style={{ padding: "0 24px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="grid-cols-1 md:grid-cols-2">
                      {(question.options || []).map((option, optIdx) => (
                        <div
                          key={option.label}
                          style={{
                            padding: "12px 16px",
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            fontSize: 14,
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                            lineHeight: 1.5,
                          }}
                        >
                          <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 6, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#67e8f9" }}>
                            {option.label || optionLabels[optIdx]}
                          </span>
                          <span style={{ color: "rgba(255,255,255,0.75)" }}>{option.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Answer reveal */}
                    <details style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <summary
                        style={{
                          padding: "14px 24px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#10b981",
                          listStyle: "none",
                          userSelect: "none",
                        }}
                      >
                        <ChevronDown style={{ width: 14, height: 14 }} />
                        Show answer &amp; explanation
                      </summary>
                      <div style={{ padding: "16px 24px 24px", background: "rgba(16,185,129,0.04)", borderTop: "1px solid rgba(16,185,129,0.12)" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", fontSize: 13, fontWeight: 700, color: "#6ee7b7", marginBottom: 12 }}>
                          ✓ Correct answer: {question.correct_answer}
                        </div>
                        {question.explanation && (
                          <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    </details>
                  </article>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <ClipboardList style={{ width: 28, height: 28, color: "#10b981" }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No questions yet</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Approved questions will appear here daily.</p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
