"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireProfile } from "@/lib/auth";
import { getMockTest, type MockTest, type MockOption, scoreMockAttempt } from "@/lib/mock-tests";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveTestAttemptAction(
  test: MockTest,
  answers: Record<string, MockOption["label"] | "">,
  durationSeconds: number
) {
  const profile = await requireProfile();
  const attempt = scoreMockAttempt(test, answers, durationSeconds);
  const supabase = await createSupabaseServerClient();

  // Calculate topic breakdown
  const topicStats: Record<string, { total: number; correct: number }> = {};
  test.questions.forEach((q) => {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0 };
    }
    topicStats[q.topic].total += 1;
    if (answers[q.id] === q.correctAnswer) {
      topicStats[q.topic].correct += 1;
    }
  });

  const topicBreakdown = Object.entries(topicStats).map(([topic, stats]) => ({
    topic,
    total: stats.total,
    correct: stats.correct,
    percentage: Math.round((stats.correct / stats.total) * 100),
  }));

  // Insert attempt
  const { data: attemptData, error: attemptError } = await supabase
    .from("test_attempts")
    .insert({
      user_id: profile.id,
      mock_test_id: test.id,
      total_questions: attempt.totalQuestions,
      correct_answers: attempt.correct,
      score_percent: attempt.percentage,
      topic_breakdown: topicBreakdown,
    })
    .select()
    .single();

  if (attemptError) {
    throw new Error(`Failed to save attempt: ${attemptError.message}`);
  }

  // Insert answers
  const answersToInsert = test.questions.map((q) => ({
    attempt_id: attemptData.id,
    question_id: q.id,
    selected_answer: answers[q.id] || null,
    is_correct: answers[q.id] === q.correctAnswer,
  }));

  const { error: answersError } = await supabase.from("test_answers").insert(answersToInsert);

  if (answersError) {
    console.error("Failed to save answers:", answersError.message);
    // We don't throw here to at least keep the attempt
  }

  revalidatePath("/dashboard");
  revalidatePath("/test-series");
  
  return attemptData.id;
}

export async function submitMockTestAction(formData: FormData) {
  const testId = String(formData.get("test_id") || "");
  const test = getMockTest(testId);

  if (!test) {
    throw new Error("Mock test not found.");
  }

  const answers = test.questions.reduce<Record<string, MockOption["label"] | "">>((acc, question) => {
    const value = formData.get(`question_${question.id}`);
    acc[question.id] = value === "A" || value === "B" || value === "C" || value === "D" ? value : "";
    return acc;
  }, {});

  const durationSecondsValue = Number(formData.get("duration_seconds"));
  const durationSeconds = Number.isFinite(durationSecondsValue) && durationSecondsValue > 0
    ? durationSecondsValue
    : test.durationMinutes * 60;

  const attemptId = await saveTestAttemptAction(test, answers, durationSeconds);
  redirect(`/test-series/results/${attemptId}`);
}
