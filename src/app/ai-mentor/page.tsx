import { askAiMentorAction } from "@/app/ai-mentor/actions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ error?: string }> };

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

  if (error) throw new Error(error.message);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
          <div className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100">Free launch access</div>
          <h1 className="mt-5 text-5xl font-semibold">AI Mentor</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">Ask for exam strategy, weak-topic explanations, current affairs revision, previous-paper patterns, and a practical daily study plan.</p>
        </div>
        {params.error ? <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{params.error}</div> : null}

        <form action={askAiMentorAction} className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-6">
          <textarea name="message" required rows={5} placeholder="Ask about strategy, revision, current affairs, previous papers, or a weak topic." className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none focus:border-cyan-300/60" />
          <button className="mt-4 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">Ask AI mentor</button>
        </form>

        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">Chat history</h2>
          {(chats || []).map((chat) => <article key={chat.id} className="rounded-[28px] border border-white/10 bg-white/5 p-6"><div className="text-sm text-cyan-200">Student</div><p className="mt-2 whitespace-pre-wrap text-slate-200">{chat.message}</p><div className="mt-5 text-sm text-emerald-200">AI Mentor</div><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300">{chat.response}</p></article>)}
          {(chats || []).length === 0 ? <p className="text-slate-400">No AI mentor chats yet.</p> : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}