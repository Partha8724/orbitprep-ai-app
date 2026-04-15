export type ValidationResult<T> = { ok: true; data: T } | { ok: false; errors: string[] };

export const supportedLanguages = ["en", "as", "hi", "bn", "ta", "te", "kn", "ml", "mr", "gu", "pa", "or"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asString(value: unknown, field: string, errors: string[], options: { required?: boolean; max?: number } = {}) {
  if (typeof value !== "string") {
    if (options.required) errors.push(`${field} is required.`);
    return "";
  }
  const trimmed = value.trim();
  if (options.required && !trimmed) errors.push(`${field} is required.`);
  if (options.max && trimmed.length > options.max) errors.push(`${field} must be ${options.max} characters or fewer.`);
  return trimmed;
}

export function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function asLanguage(value: unknown, fallback: SupportedLanguage = "en") {
  return typeof value === "string" && supportedLanguages.includes(value as SupportedLanguage) ? (value as SupportedLanguage) : fallback;
}

export type ContentSourceInput = {
  source_type: "manual" | "url" | "pdf" | "news" | "previous_paper";
  title: string;
  source_url: string | null;
  raw_text: string;
  metadata: Record<string, unknown>;
};

export function validateContentSourceInput(value: unknown): ValidationResult<ContentSourceInput> {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, errors: ["Body must be a JSON object."] };
  const sourceType = asString(value.source_type, "source_type", errors, { required: true }) as ContentSourceInput["source_type"];
  if (!["manual", "url", "pdf", "news", "previous_paper"].includes(sourceType)) errors.push("source_type is invalid.");
  const title = asString(value.title, "title", errors, { required: true, max: 180 });
  const rawText = asString(value.raw_text, "raw_text", errors, { required: true });
  const sourceUrl = typeof value.source_url === "string" && value.source_url.trim() ? value.source_url.trim() : null;
  const metadata = isRecord(value.metadata) ? value.metadata : {};
  return errors.length ? { ok: false, errors } : { ok: true, data: { source_type: sourceType, title, source_url: sourceUrl, raw_text: rawText, metadata } };
}

export type ContentGenerateInput = {
  source_id: string | null;
  content_type: "current_affairs" | "revision_notes" | "pdf" | "article";
  exam_tags: string[];
  state_tags: string[];
  subject_tags: string[];
  language: SupportedLanguage;
  visibility: "free" | "premium";
  prompt: string;
};

export function validateContentGenerateInput(value: unknown): ValidationResult<ContentGenerateInput> {
  const errors: string[] = [];
  if (!isRecord(value)) return { ok: false, errors: ["Body must be a JSON object."] };
  const contentType = asString(value.content_type, "content_type", errors, { required: true }) as ContentGenerateInput["content_type"];
  if (!["current_affairs", "revision_notes", "pdf", "article"].includes(contentType)) errors.push("content_type is invalid.");
  const visibility = (typeof value.visibility === "string" ? value.visibility : "free") as ContentGenerateInput["visibility"];
  if (!["free", "premium"].includes(visibility)) errors.push("visibility is invalid.");
  const prompt = asString(value.prompt, "prompt", errors, { required: true });
  const sourceId = typeof value.source_id === "string" && value.source_id.trim() ? value.source_id.trim() : null;
  return errors.length ? { ok: false, errors } : { ok: true, data: { source_id: sourceId, content_type: contentType, exam_tags: asStringArray(value.exam_tags), state_tags: asStringArray(value.state_tags), subject_tags: asStringArray(value.subject_tags), language: asLanguage(value.language), visibility, prompt } };
}

export type BulkQuestionInput = {
  questions: Array<{
    prompt: string;
    options: Array<{ id: string; text: string }>;
    answer: { option_id: string; explanation?: string };
    exam: string;
    subject: string;
    topic: string;
    subtopic?: string;
    difficulty: "easy" | "medium" | "hard";
    source_type: "manual" | "AI" | "previous_paper";
    year?: number | null;
  }>;
};

export function validateBulkQuestionInput(value: unknown): ValidationResult<BulkQuestionInput> {
  if (!isRecord(value) || !Array.isArray(value.questions)) return { ok: false, errors: ["questions array is required."] };
  const errors: string[] = [];
  const questions = value.questions.map((raw, index) => {
    if (!isRecord(raw)) {
      errors.push(`questions[${index}] must be an object.`);
      return null;
    }
    const prompt = asString(raw.prompt, `questions[${index}].prompt`, errors, { required: true });
    const options = Array.isArray(raw.options) ? raw.options.filter(isRecord).map((option) => ({ id: asString(option.id, "option.id", errors, { required: true }), text: asString(option.text, "option.text", errors, { required: true }) })) : [];
    if (options.length < 2) errors.push(`questions[${index}] needs at least two options.`);
    const answer = isRecord(raw.answer) ? { option_id: asString(raw.answer.option_id, `questions[${index}].answer.option_id`, errors, { required: true }), explanation: typeof raw.answer.explanation === "string" ? raw.answer.explanation : undefined } : { option_id: "" };
    if (!options.some((option) => option.id === answer.option_id)) errors.push(`questions[${index}] answer must match an option id.`);
    const difficulty = (typeof raw.difficulty === "string" ? raw.difficulty : "medium") as "easy" | "medium" | "hard";
    if (!["easy", "medium", "hard"].includes(difficulty)) errors.push(`questions[${index}].difficulty is invalid.`);
    const sourceType = (typeof raw.source_type === "string" ? raw.source_type : "manual") as "manual" | "AI" | "previous_paper";
    if (!["manual", "AI", "previous_paper"].includes(sourceType)) errors.push(`questions[${index}].source_type is invalid.`);
    const normalized: BulkQuestionInput["questions"][number] = { prompt, options, answer, exam: asString(raw.exam, "exam", errors, { required: true }), subject: asString(raw.subject, "subject", errors, { required: true }), topic: asString(raw.topic, "topic", errors, { required: true }), subtopic: typeof raw.subtopic === "string" ? raw.subtopic : undefined, difficulty, source_type: sourceType, year: typeof raw.year === "number" ? raw.year : null };
    return normalized;
  }).filter((item): item is BulkQuestionInput["questions"][number] => item !== null);
  return errors.length ? { ok: false, errors } : { ok: true, data: { questions } };
}
