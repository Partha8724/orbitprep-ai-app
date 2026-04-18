import { askAiMentorAction } from "@/app/ai-mentor/actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Bot, User, Send, Sparkles, Lightbulb, BookOpen, Target, TrendingUp } from "lucide-react";
export const dynamic = "force-dynamic";
export const metadata = { title: "AI Mentor" };
type PageProps = {
    searchParams: Promise<{
        error?: string;
    }>;
};
const suggestions = [
    { icon: Target, label: "Create a study plan for UPSC prelims in 3 months", color: "#06b6d4" },
    { icon: TrendingUp, label: "Explain Indian economy topics for SSC CGL", color: "#8b5cf6" },
    { icon: BookOpen, label: "Summarize today's current affairs for exam", color: "#10b981" },
    { icon: Lightbulb, label: "Identify my weak areas based on polity", color: "#f59e0b" },
];
export default async function AiMentorPage({ searchParams }: PageProps) {
    const profile = await requireProfile();
    const params = await searchParams;
    const supabase = await createSupabaseServerClient();
    const { data: chats, error } = await supabase
        .from("ai_chats")
        .select("id, message, response, created_at")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(20);
    const chatLoadMessage = error
        ? error.code === "42P01" || error.message.toLowerCase().includes("ai_chats")
            ? "AI Mentor chat history is being set up. You can still use the mentor after the database table is installed."
            : "AI Mentor chat history could not load right now. You can still ask a new question."
        : "";
    const chatHistory = (chats || []).reverse();
    return (<>
      <SiteHeader />
      <main style={{ background: "#050816", color: "white", minHeight: "100vh" }}>

        {/* Hero */}
        <section style={{ position: "relative", padding: "72px 24px 52px", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "70%", height: "100%", background: "radial-gradient(ellipse at top, rgba(6,182,212,0.08) 0%, rgba(139,92,246,0.05) 50%, transparent 70%)" }}/>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`, backgroundSize: "60px 60px" }}/>
          </div>
          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
            {/* Animated AI orb */}
            <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(6,182,212,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative" }}>
              <div style={{ position: "absolute", inset: -4, borderRadius: 24, border: "1px solid rgba(6,182,212,0.15)", animation: "pulse-ring 2s ease-out infinite" }}/>
              <Bot style={{ width: 32, height: 32, color: "#06b6d4" }}/>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", fontSize: 12, fontWeight: 500, color: "#67e8f9", marginBottom: 20 }}>
              <Sparkles style={{ width: 12, height: 12 }}/> Powered by OpenAI
            </div>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 14, lineHeight: 1.1 }}>
              Your{" "}
              <span style={{ background: "linear-gradient(135deg, #06b6d4, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                AI Mentor
              </span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 520, lineHeight: 1.7, margin: "0 auto" }}>
              Ask for exam strategy, weak-topic explanations, current affairs revision, previous-paper patterns, and a personalised daily study plan.
            </p>
          </div>
        </section>

        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 100px" }}>

          {/* Error */}
          {params.error && (<div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 13, color: "#fca5a5", marginBottom: 20 }}>
              {params.error}
            </div>)}

          {chatLoadMessage && (<div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.18)", fontSize: 13, color: "#a5f3fc", marginBottom: 20, lineHeight: 1.6 }}>
              {chatLoadMessage}
            </div>)}

          {/* Chat history */}
          {chatHistory.length > 0 && (<div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 16 }}>
              {chatHistory.map((chat) => (<div key={chat.id}>
                  {/* User message */}
                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginBottom: 12 }}>
                    <div style={{ maxWidth: "75%", padding: "14px 18px", borderRadius: "18px 18px 4px 18px", background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(6,182,212,0.2)", fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.9)" }}>
                      {chat.message}
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User style={{ width: 16, height: 16, color: "rgba(255,255,255,0.6)" }}/>
                    </div>
                  </div>
                  {/* AI response */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(139,92,246,0.2))", border: "1px solid rgba(6,182,212,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Bot style={{ width: 16, height: 16, color: "#06b6d4" }}/>
                    </div>
                    <div style={{ maxWidth: "80%", padding: "16px 20px", borderRadius: "4px 18px 18px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.75)", whiteSpace: "pre-wrap" }}>
                      {chat.response}
                    </div>
                  </div>
                </div>))}
            </div>)}

          {/* Suggestion chips (only when no chat history) */}
          {chatHistory.length === 0 && (<div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 14, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Suggested questions</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="grid-cols-1 md:grid-cols-2">
                {suggestions.map(({ icon: Icon, label, color }) => (<form key={label} action={askAiMentorAction}>
                    <input type="hidden" name="message" value={label}/>
                    <button type="submit" style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 13,
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    transition: "all 0.2s ease",
                    lineHeight: 1.5,
                }}>
                      <Icon style={{ width: 16, height: 16, color, flexShrink: 0, marginTop: 1 }}/>
                      {label}
                    </button>
                  </form>))}
              </div>
            </div>)}

          {/* Ask form */}
          <form action={askAiMentorAction}>
            <div style={{
            borderRadius: 16,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            transition: "border-color 0.2s ease",
        }}>
              <textarea id="ai-mentor-input" name="message" required rows={4} placeholder="Ask about strategy, revision plans, current affairs, previous papers, or any weak topic…" style={{
            width: "100%",
            background: "transparent",
            border: "none",
            padding: "18px 20px",
            color: "white",
            fontSize: 15,
            outline: "none",
            resize: "none",
            lineHeight: 1.6,
            boxSizing: "border-box",
        }}/>
              <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Powered by OpenAI · Responses in seconds</span>
                <button id="ai-mentor-submit" type="submit" style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 20px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            color: "white",
            background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(6,182,212,0.25)",
            transition: "all 0.2s ease",
        }}>
                  <Send style={{ width: 14, height: 14 }}/> Ask AI Mentor
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>);
}
