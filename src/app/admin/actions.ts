"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { generateEducationContent } from "@/lib/ai";
import { requireAdminProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function tags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseOptions(rawOptions: string) {
  return rawOptions
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return {
        label: (label || "").trim(),
        text: rest.join("|").trim(),
      };
    })
    .filter((option) => option.label && option.text);
}

export async function generateAiContentAction(formData: FormData) {
  const admin = await requireAdminProfile();
  const contentType = text(formData, "content_type") as
    | "questions"
    | "current_affairs"
    | "revision_notes"
    | "pdf";
  const title = text(formData, "title");
  const prompt = text(formData, "prompt");
  const isPremium = bool(formData, "is_premium");

  if (!contentType || !title || !prompt) {
    redirect("/admin/content?error=Missing%20AI%20generation%20fields");
  }

  const output = await generateEducationContent({ kind: contentType, prompt });
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ai_generations").insert({
    content_type: contentType,
    title,
    prompt,
    output,
    status: "pending_review",
    is_premium: isPremium,
    created_by: admin.id,
  });

  if (error) {
    redirect(`/admin/content?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/content");
  redirect("/admin/content?message=AI%20content%20generated%20and%20queued%20for%20review");
}

export async function reviewAiGenerationAction(formData: FormData) {
  await requireAdminProfile();
  const generationId = text(formData, "generation_id");
  const decision = text(formData, "decision");
  const status = decision === "approve" ? "approved" : "rejected";

  if (!generationId) {
    redirect("/admin/content?error=Missing%20generation%20id");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("ai_generations")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", generationId);

  if (error) {
    redirect(`/admin/content?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/content");
}

export async function createExamAction(formData: FormData) {
  await requireAdminProfile();
  const name = text(formData, "name");
  const slug = text(formData, "slug");
  const description = text(formData, "description");

  if (!name || !slug) {
    redirect("/admin/question-bank?error=Exam%20name%20and%20slug%20are%20required");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("exams").insert({ name, slug, description });

  if (error) {
    redirect(`/admin/question-bank?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/question-bank");
}

export async function createSubjectAction(formData: FormData) {
  await requireAdminProfile();
  const examId = text(formData, "exam_id");
  const name = text(formData, "name");

  if (!examId || !name) {
    redirect("/admin/question-bank?error=Subject%20requires%20exam%20and%20name");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("subjects").insert({ exam_id: examId, name });

  if (error) {
    redirect(`/admin/question-bank?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/question-bank");
}

export async function createTopicAction(formData: FormData) {
  await requireAdminProfile();
  const subjectId = text(formData, "subject_id");
  const name = text(formData, "name");

  if (!subjectId || !name) {
    redirect("/admin/question-bank?error=Topic%20requires%20subject%20and%20name");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("topics").insert({ subject_id: subjectId, name });

  if (error) {
    redirect(`/admin/question-bank?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/question-bank");
}

export async function createQuestionAction(formData: FormData) {
  const admin = await requireAdminProfile();
  const topicId = text(formData, "topic_id") || null;
  const questionText = text(formData, "question_text");
  const explanation = text(formData, "explanation");
  const correctAnswer = text(formData, "correct_answer");
  const options = parseOptions(text(formData, "options"));

  if (!questionText || options.length < 2 || !correctAnswer) {
    redirect("/admin/question-bank?error=Question,%20options,%20and%20correct%20answer%20are%20required");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("questions").insert({
    topic_id: topicId,
    question_text: questionText,
    options,
    correct_answer: correctAnswer,
    explanation,
    difficulty: text(formData, "difficulty") || "medium",
    tags: tags(text(formData, "tags")),
    source_type: text(formData, "source_type") || "manual",
    status: text(formData, "status") || "approved",
    created_by: admin.id,
  });

  if (error) {
    redirect(`/admin/question-bank?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/question-bank");
}

export async function createMockTestAction(formData: FormData) {
  const admin = await requireAdminProfile();
  const title = text(formData, "title");
  const questionIds = tags(text(formData, "question_ids"));

  if (!title || questionIds.length === 0) {
    redirect("/admin/tests?error=Test%20title%20and%20question%20ids%20are%20required");
  }

  const supabase = await createSupabaseServerClient();
  const { data: test, error } = await supabase
    .from("mock_tests")
    .insert({
      title,
      description: text(formData, "description"),
      duration_minutes: Number(text(formData, "duration_minutes")) || 60,
      is_premium: bool(formData, "is_premium"),
      status: text(formData, "status") || "published",
      created_by: admin.id,
    })
    .select("id")
    .single();

  if (error || !test) {
    redirect(`/admin/tests?error=${encodeURIComponent(error?.message || "Could not create test")}`);
  }

  const assignments = questionIds.map((questionId, index) => ({
    mock_test_id: test.id,
    question_id: questionId,
    position: index + 1,
  }));
  const { error: assignmentError } = await supabase.from("mock_test_questions").insert(assignments);

  if (assignmentError) {
    redirect(`/admin/tests?error=${encodeURIComponent(assignmentError.message)}`);
  }

  revalidatePath("/admin/tests");
  revalidatePath("/test-series");
}

export async function createPdfAction(formData: FormData) {
  const admin = await requireAdminProfile();
  const title = text(formData, "title");
  const fileUrl = text(formData, "file_url");

  if (!title || !fileUrl) {
    redirect("/admin/pdfs?error=PDF%20title%20and%20file%20URL%20are%20required");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("pdfs").insert({
    title,
    description: text(formData, "description"),
    file_url: fileUrl,
    source_type: text(formData, "source_type") || "manual",
    is_premium: bool(formData, "is_premium"),
    status: text(formData, "status") || "approved",
    created_by: admin.id,
  });

  if (error) {
    redirect(`/admin/pdfs?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/pdfs");
  revalidatePath("/dashboard");
}

export async function createCurrentAffairAction(formData: FormData) {
  const admin = await requireAdminProfile();
  const title = text(formData, "title");
  const summary = text(formData, "summary");

  if (!title || !summary) {
    redirect("/admin/current-affairs?error=Title%20and%20summary%20are%20required");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("current_affairs").insert({
    title,
    summary,
    category: text(formData, "category"),
    published_date: text(formData, "published_date") || new Date().toISOString().slice(0, 10),
    tags: tags(text(formData, "tags")),
    quiz_questions: text(formData, "quiz_questions") || null,
    is_premium: bool(formData, "is_premium"),
    status: text(formData, "status") || "pending_review",
    created_by: admin.id,
  });

  if (error) {
    redirect(`/admin/current-affairs?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/current-affairs");
  revalidatePath("/current-affairs");
}

export async function reviewCurrentAffairAction(formData: FormData) {
  await requireAdminProfile();
  const id = text(formData, "current_affair_id");
  const decision = text(formData, "decision");
  const status = decision === "approve" ? "approved" : "rejected";

  if (!id) {
    redirect("/admin/current-affairs?error=Missing%20current%20affair%20id");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("current_affairs").update({ status }).eq("id", id);

  if (error) {
    redirect(`/admin/current-affairs?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/current-affairs");
  revalidatePath("/current-affairs");
}
