export type MockOption = {
  label: "A" | "B" | "C" | "D";
  text: string;
};

export type MockQuestion = {
  id: string;
  question: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  options: MockOption[];
  correctAnswer: MockOption["label"];
  explanation: string;
};

export type MockTest = {
  id: string;
  title: string;
  exam: "UPSC" | "APSC" | "SSC";
  description: string;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarks: number;
  questions: MockQuestion[];
};

export type StoredAttempt = {
  id: string;
  testId: string;
  testTitle: string;
  submittedAt: string;
  durationSeconds: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  score: number;
  maxScore: number;
  percentage: number;
  answers: Record<string, MockOption["label"] | "">;
};

export const mockTests: MockTest[] = [
  {
    id: "upsc-polity-foundation",
    title: "UPSC Polity Foundation Sprint",
    exam: "UPSC",
    description:
      "Constitutional basics, Parliament, fundamental rights, and institutions for Prelims-style accuracy.",
    durationMinutes: 12,
    marksPerQuestion: 2,
    negativeMarks: 0.66,
    questions: [
      {
        id: "upsc-polity-q1",
        question: "Which part of the Constitution of India contains the Fundamental Rights?",
        topic: "Constitution",
        difficulty: "Easy",
        options: [
          { label: "A", text: "Part II" },
          { label: "B", text: "Part III" },
          { label: "C", text: "Part IV" },
          { label: "D", text: "Part IVA" },
        ],
        correctAnswer: "B",
        explanation:
          "Part III of the Constitution contains Fundamental Rights, while Part IV contains Directive Principles.",
      },
      {
        id: "upsc-polity-q2",
        question: "The idea of Directive Principles of State Policy was borrowed from which Constitution?",
        topic: "DPSP",
        difficulty: "Medium",
        options: [
          { label: "A", text: "Irish Constitution" },
          { label: "B", text: "Canadian Constitution" },
          { label: "C", text: "Australian Constitution" },
          { label: "D", text: "French Constitution" },
        ],
        correctAnswer: "A",
        explanation:
          "The Directive Principles were inspired by the Irish Constitution and guide state policy making.",
      },
      {
        id: "upsc-polity-q3",
        question: "Who presides over a joint sitting of both Houses of Parliament?",
        topic: "Parliament",
        difficulty: "Easy",
        options: [
          { label: "A", text: "President of India" },
          { label: "B", text: "Vice President of India" },
          { label: "C", text: "Speaker of the Lok Sabha" },
          { label: "D", text: "Prime Minister of India" },
        ],
        correctAnswer: "C",
        explanation:
          "A joint sitting is presided over by the Speaker of the Lok Sabha, or in their absence, the Deputy Speaker.",
      },
      {
        id: "upsc-polity-q4",
        question: "Which writ is issued to prevent a lower court from exceeding its jurisdiction?",
        topic: "Judiciary",
        difficulty: "Hard",
        options: [
          { label: "A", text: "Habeas Corpus" },
          { label: "B", text: "Mandamus" },
          { label: "C", text: "Prohibition" },
          { label: "D", text: "Certiorari" },
        ],
        correctAnswer: "C",
        explanation:
          "Prohibition is issued by a higher court to stop a lower court or tribunal from acting beyond jurisdiction.",
      },
      {
        id: "upsc-polity-q5",
        question: "The Finance Commission of India is constituted under which Article?",
        topic: "Constitutional Bodies",
        difficulty: "Medium",
        options: [
          { label: "A", text: "Article 280" },
          { label: "B", text: "Article 324" },
          { label: "C", text: "Article 356" },
          { label: "D", text: "Article 368" },
        ],
        correctAnswer: "A",
        explanation:
          "Article 280 provides for the Finance Commission, which recommends tax devolution and grants-in-aid.",
      },
    ],
  },
  {
    id: "apsc-assam-gk-readiness",
    title: "APSC Assam GK Readiness Test",
    exam: "APSC",
    description:
      "Assam history, geography, culture, biodiversity, and state institutions for APSC CCE preparation.",
    durationMinutes: 10,
    marksPerQuestion: 2,
    negativeMarks: 0.5,
    questions: [
      {
        id: "apsc-gk-q1",
        question: "The Ahom kingdom was founded by whom in the 13th century?",
        topic: "Assam History",
        difficulty: "Easy",
        options: [
          { label: "A", text: "Sukapha" },
          { label: "B", text: "Lachit Borphukan" },
          { label: "C", text: "Rudra Singha" },
          { label: "D", text: "Gadadhar Singha" },
        ],
        correctAnswer: "A",
        explanation:
          "Sukapha founded the Ahom kingdom in 1228, shaping Assam's medieval political history.",
      },
      {
        id: "apsc-gk-q2",
        question: "Kaziranga National Park is best known for conserving which species?",
        topic: "Environment",
        difficulty: "Easy",
        options: [
          { label: "A", text: "Asiatic lion" },
          { label: "B", text: "One-horned rhinoceros" },
          { label: "C", text: "Snow leopard" },
          { label: "D", text: "Nilgiri tahr" },
        ],
        correctAnswer: "B",
        explanation:
          "Kaziranga is a UNESCO World Heritage Site and a major stronghold of the one-horned rhinoceros.",
      },
      {
        id: "apsc-gk-q3",
        question: "Which river island in Assam is widely recognized as one of the world's largest river islands?",
        topic: "Geography",
        difficulty: "Medium",
        options: [
          { label: "A", text: "Umananda" },
          { label: "B", text: "Majuli" },
          { label: "C", text: "Peacock Island" },
          { label: "D", text: "Dibru-Saikhowa" },
        ],
        correctAnswer: "B",
        explanation:
          "Majuli, located on the Brahmaputra, is known for its satras, culture, and riverine ecology.",
      },
      {
        id: "apsc-gk-q4",
        question: "Lachit Borphukan is associated with which historic battle?",
        topic: "Assam History",
        difficulty: "Medium",
        options: [
          { label: "A", text: "Battle of Saraighat" },
          { label: "B", text: "Battle of Plassey" },
          { label: "C", text: "Battle of Itakhuli" },
          { label: "D", text: "Battle of Panipat" },
        ],
        correctAnswer: "A",
        explanation:
          "Lachit Borphukan led Ahom forces in the Battle of Saraighat against Mughal forces in 1671.",
      },
      {
        id: "apsc-gk-q5",
        question: "Bihu is primarily associated with which aspect of Assamese life?",
        topic: "Culture",
        difficulty: "Easy",
        options: [
          { label: "A", text: "Court ceremony" },
          { label: "B", text: "Agrarian seasons and community celebration" },
          { label: "C", text: "Military recruitment" },
          { label: "D", text: "Only religious fasting" },
        ],
        correctAnswer: "B",
        explanation:
          "Bihu reflects Assam's agrarian rhythm through Rongali, Kongali, and Bhogali celebrations.",
      },
    ],
  },
  {
    id: "ssc-cgl-quick-accuracy",
    title: "SSC CGL Quick Accuracy Drill",
    exam: "SSC",
    description:
      "Reasoning, quantitative aptitude, English, and general awareness in a fast sectional format.",
    durationMinutes: 8,
    marksPerQuestion: 2,
    negativeMarks: 0.5,
    questions: [
      {
        id: "ssc-q1",
        question: "If 18 workers finish a task in 20 days, how many workers are needed to finish it in 12 days?",
        topic: "Quantitative Aptitude",
        difficulty: "Medium",
        options: [
          { label: "A", text: "24" },
          { label: "B", text: "28" },
          { label: "C", text: "30" },
          { label: "D", text: "36" },
        ],
        correctAnswer: "C",
        explanation:
          "Work is constant: 18 x 20 = 360 worker-days. 360 divided by 12 equals 30 workers.",
      },
      {
        id: "ssc-q2",
        question: "Choose the correctly spelled word.",
        topic: "English",
        difficulty: "Easy",
        options: [
          { label: "A", text: "Accomodate" },
          { label: "B", text: "Acommodate" },
          { label: "C", text: "Accommodate" },
          { label: "D", text: "Acomodate" },
        ],
        correctAnswer: "C",
        explanation:
          "The correct spelling is Accommodate, with double c and double m.",
      },
      {
        id: "ssc-q3",
        question: "Find the missing number: 3, 8, 15, 24, 35, ?",
        topic: "Reasoning",
        difficulty: "Medium",
        options: [
          { label: "A", text: "46" },
          { label: "B", text: "48" },
          { label: "C", text: "50" },
          { label: "D", text: "52" },
        ],
        correctAnswer: "B",
        explanation:
          "The differences are 5, 7, 9, 11, then 13. So 35 + 13 = 48.",
      },
      {
        id: "ssc-q4",
        question: "The headquarters of the Reserve Bank of India is located in which city?",
        topic: "General Awareness",
        difficulty: "Easy",
        options: [
          { label: "A", text: "New Delhi" },
          { label: "B", text: "Mumbai" },
          { label: "C", text: "Kolkata" },
          { label: "D", text: "Chennai" },
        ],
        correctAnswer: "B",
        explanation:
          "The Reserve Bank of India is headquartered in Mumbai, Maharashtra.",
      },
      {
        id: "ssc-q5",
        question: "A shopkeeper marks an item 25% above cost and gives a 10% discount. What is the profit percent?",
        topic: "Quantitative Aptitude",
        difficulty: "Hard",
        options: [
          { label: "A", text: "10%" },
          { label: "B", text: "12.5%" },
          { label: "C", text: "15%" },
          { label: "D", text: "20%" },
        ],
        correctAnswer: "B",
        explanation:
          "Marked price is 125 if cost is 100. After 10% discount, selling price is 112.5, so profit is 12.5%.",
      },
    ],
  },
];

export function getMockTest(testId: string) {
  return mockTests.find((test) => test.id === testId);
}

export function scoreMockAttempt(
  test: MockTest,
  answers: Record<string, MockOption["label"] | "">,
  durationSeconds: number
): StoredAttempt {
  const correct = test.questions.filter((question) => answers[question.id] === question.correctAnswer).length;
  const attempted = test.questions.filter((question) => Boolean(answers[question.id])).length;
  const wrong = attempted - correct;
  const skipped = test.questions.length - attempted;
  const maxScore = test.questions.length * test.marksPerQuestion;
  const score = Math.max(0, correct * test.marksPerQuestion - wrong * test.negativeMarks);
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return {
    id: `attempt-${Date.now()}`,
    testId: test.id,
    testTitle: test.title,
    submittedAt: new Date().toISOString(),
    durationSeconds,
    totalQuestions: test.questions.length,
    attempted,
    correct,
    wrong,
    skipped,
    score: Number(score.toFixed(2)),
    maxScore,
    percentage,
    answers,
  };
}
