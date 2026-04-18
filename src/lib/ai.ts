type AiContentKind = "questions" | "current_affairs" | "revision_notes" | "pdf";

export async function generateEducationContent({
  kind,
  prompt,
}: {
  kind: AiContentKind;
  prompt: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required for AI generation.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You create accurate, exam-focused learning material for Indian government exam students. Return concise, review-ready content with clear structure. Do not invent dates, laws, or statistics when uncertain; state what must be verified.",
        },
        {
          role: "user",
          content: `Content type: ${kind}\n\nAdmin request:\n${prompt}`,
        },
      ],
    }),
  });

  const body = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(body.error?.message || "AI generation failed.");
  }

  const output = body.choices?.[0]?.message?.content;

  if (!output) {
    throw new Error("AI provider returned no content.");
  }

  return output;
}
