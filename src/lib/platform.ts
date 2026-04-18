import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export type PublishedPdf = {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  is_premium: boolean;
  source_type: string;
  created_at: string;
};

export type PublishedCurrentAffair = {
  id: string;
  title: string;
  summary: string;
  category: string | null;
  published_date: string;
  tags: string[] | null;
  is_premium: boolean;
};

export type PublishedMockTest = {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  is_premium: boolean;
  created_at: string;
};

export type StudentAttempt = {
  id: string;
  mock_test_id: string;
  total_questions: number;
  correct_answers: number;
  score_percent: number;
  topic_breakdown: Record<string, { total: number; correct: number }>;
  created_at: string;
  mock_tests: Array<{ title: string }> | { title: string } | null;
};

function logPlatformQueryError(scope: string, message: string) {
  console.warn(`[platform:${scope}] ${message}`);
}

export async function getStudentLearningData(profile: Profile) {
  const supabase = await createSupabaseServerClient();

  const pdfQuery = supabase
    .from("pdfs")
    .select("id, title, description, file_url, is_premium, source_type, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(6);

  const testQuery = supabase
    .from("mock_tests")
    .select("id, title, description, duration_minutes, is_premium, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6);

  const currentAffairsQuery = supabase
    .from("current_affairs")
    .select("id, title, summary, category, published_date, tags, is_premium")
    .eq("status", "approved")
    .order("published_date", { ascending: false })
    .limit(6);

  const attemptsQuery = supabase
    .from("test_attempts")
    .select("id, mock_test_id, total_questions, correct_answers, score_percent, topic_breakdown, created_at, mock_tests(title)")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const [pdfs, tests, currentAffairs, attempts] = await Promise.all([
    pdfQuery,
    testQuery,
    currentAffairsQuery,
    attemptsQuery,
  ]);

  if (pdfs.error) logPlatformQueryError("pdfs", pdfs.error.message);
  if (tests.error) logPlatformQueryError("mock_tests", tests.error.message);
  if (currentAffairs.error) logPlatformQueryError("current_affairs", currentAffairs.error.message);
  if (attempts.error) logPlatformQueryError("test_attempts", attempts.error.message);

  const safeAttempts = attempts.error ? [] : (attempts.data || []);
  const weakTopics = (safeAttempts as unknown as StudentAttempt[])
    .flatMap((attempt) =>
      Object.entries(attempt.topic_breakdown || {}).map(([topicId, stats]) => ({
        topicId,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        total: stats.total,
      }))
    )
    .filter((topic) => topic.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  return {
    pdfs: (pdfs.error ? [] : pdfs.data || []) as PublishedPdf[],
    tests: (tests.error ? [] : tests.data || []) as PublishedMockTest[],
    currentAffairs: (currentAffairs.error ? [] : currentAffairs.data || []) as PublishedCurrentAffair[],
    attempts: safeAttempts as StudentAttempt[],
    weakTopics,
  };
}

export async function getAdminAnalytics() {
  const supabase = await createSupabaseServerClient();
  const queries = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_premium", true),
    supabase.from("pdfs").select("id", { count: "exact", head: true }),
    supabase.from("questions").select("id", { count: "exact", head: true }),
    supabase.from("test_attempts").select("id", { count: "exact", head: true }),
    supabase.from("ai_generations").select("id", { count: "exact", head: true }),
    supabase.from("ai_generations").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
    supabase.from("current_affairs").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
  ]);

  const [users, premiumUsers, pdfs, questions, attempts, aiLogs, aiQueue, currentAffairsQueue] = queries;

  queries.forEach((query, index) => {
    if (query.error) logPlatformQueryError(`admin_analytics_${index}`, query.error.message);
  });

  return {
    users: users.count || 0,
    premiumUsers: premiumUsers.count || 0,
    pdfs: pdfs.count || 0,
    questions: questions.count || 0,
    attempts: attempts.count || 0,
    aiLogs: aiLogs.count || 0,
    approvalQueue: (aiQueue.count || 0) + (currentAffairsQueue.count || 0),
  };
}

export async function getAdminQueues() {
  const supabase = await createSupabaseServerClient();
  const [aiGenerations, currentAffairs] = await Promise.all([
    supabase.from("ai_generations").select("id, content_type, title, prompt, output, status, created_at").order("created_at", { ascending: false }).limit(20),
    supabase.from("current_affairs").select("id, title, summary, category, status, published_date, created_at").order("created_at", { ascending: false }).limit(20),
  ]);

  if (aiGenerations.error) logPlatformQueryError("ai_generations_queue", aiGenerations.error.message);
  if (currentAffairs.error) logPlatformQueryError("current_affairs_queue", currentAffairs.error.message);

  return {
    aiGenerations: aiGenerations.error ? [] : aiGenerations.data || [],
    currentAffairs: currentAffairs.error ? [] : currentAffairs.data || [],
  };
}

export async function getQuestionBankAdminData() {
  const supabase = await createSupabaseServerClient();
  const [exams, subjects, topics, questions] = await Promise.all([
    supabase.from("exams").select("id, name, slug, is_active").order("name"),
    supabase.from("subjects").select("id, name, exam_id").order("name"),
    supabase.from("topics").select("id, name, subject_id").order("name"),
    supabase.from("questions").select("id, question_text, difficulty, source_type, status, created_at").order("created_at", { ascending: false }).limit(25),
  ]);

  if (exams.error) logPlatformQueryError("question_bank_exams", exams.error.message);
  if (subjects.error) logPlatformQueryError("question_bank_subjects", subjects.error.message);
  if (topics.error) logPlatformQueryError("question_bank_topics", topics.error.message);
  if (questions.error) logPlatformQueryError("question_bank_questions", questions.error.message);

  return {
    exams: exams.error ? [] : exams.data || [],
    subjects: subjects.error ? [] : subjects.data || [],
    topics: topics.error ? [] : topics.data || [],
    questions: questions.error ? [] : questions.data || [],
  };
}

export async function getMockTestAdminData() {
  const supabase = await createSupabaseServerClient();
  const [tests, questions] = await Promise.all([
    supabase.from("mock_tests").select("id, title, status, is_premium, duration_minutes, created_at").order("created_at", { ascending: false }).limit(25),
    supabase.from("questions").select("id, question_text, difficulty, status").eq("status", "approved").order("created_at", { ascending: false }).limit(50),
  ]);

  if (tests.error) logPlatformQueryError("admin_mock_tests", tests.error.message);
  if (questions.error) logPlatformQueryError("admin_mock_questions", questions.error.message);

  return { tests: tests.error ? [] : tests.data || [], questions: questions.error ? [] : questions.data || [] };
}

export async function getPublishedMockTests(_profile: Profile) {
  void _profile;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("mock_tests")
    .select("id, title, description, duration_minutes, is_premium, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    logPlatformQueryError("published_mock_tests", error.message);
    return [];
  }
  return (data || []) as PublishedMockTest[];
}
