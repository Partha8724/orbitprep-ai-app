'use client';

import { useEffect, useMemo, useState } from 'react';

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  subject: string;
  explanation: string;
};

const questionBank: Record<string, Record<string, Question[]>> = {
  UPSC: {
    Polity: [
      {
        id: 1,
        question: 'Which Article of the Indian Constitution guarantees Equality before Law?',
        options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'],
        correctAnswer: 'Article 14',
        subject: 'Polity',
        explanation: 'Article 14 guarantees equality before law and equal protection of the laws.',
      },
      {
        id: 2,
        question: 'Who is the constitutional head of the State in India?',
        options: ['Chief Minister', 'Governor', 'President', 'Chief Justice'],
        correctAnswer: 'Governor',
        subject: 'Polity',
        explanation: 'The Governor is the constitutional head of a state.',
      },
      {
        id: 3,
        question: 'The Preamble of the Indian Constitution begins with:',
        options: ['We, the Parliament of India', 'We, the people of India', 'In the name of God', 'We, the states of India'],
        correctAnswer: 'We, the people of India',
        subject: 'Polity',
        explanation: 'The Preamble begins with “We, the people of India”.',
      },
      {
        id: 4,
        question: 'Which body conducts elections in India?',
        options: ['Supreme Court', 'Finance Commission', 'Election Commission of India', 'NITI Aayog'],
        correctAnswer: 'Election Commission of India',
        subject: 'Polity',
        explanation: 'The Election Commission of India conducts elections to Parliament, State Legislatures, and the offices of President and Vice-President.',
      },
      {
        id: 5,
        question: 'Fundamental Duties were added to the Constitution by which amendment?',
        options: ['42nd Amendment', '44th Amendment', '73rd Amendment', '86th Amendment'],
        correctAnswer: '42nd Amendment',
        subject: 'Polity',
        explanation: 'Fundamental Duties were added by the 42nd Constitutional Amendment in 1976.',
      },
    ],
    History: [
      {
        id: 1,
        question: 'Who founded the Maurya Empire?',
        options: ['Ashoka', 'Chandragupta Maurya', 'Bindusara', 'Harshavardhana'],
        correctAnswer: 'Chandragupta Maurya',
        subject: 'History',
        explanation: 'Chandragupta Maurya founded the Maurya Empire.',
      },
      {
        id: 2,
        question: 'The Battle of Plassey was fought in:',
        options: ['1757', '1764', '1857', '1773'],
        correctAnswer: '1757',
        subject: 'History',
        explanation: 'The Battle of Plassey was fought in 1757.',
      },
      {
        id: 3,
        question: 'Who gave the call “Do or Die”?',
        options: ['Bal Gangadhar Tilak', 'Mahatma Gandhi', 'Jawaharlal Nehru', 'Subhas Chandra Bose'],
        correctAnswer: 'Mahatma Gandhi',
        subject: 'History',
        explanation: 'Mahatma Gandhi gave the “Do or Die” call during the Quit India Movement.',
      },
      {
        id: 4,
        question: 'The Indus Valley Civilization is also known as:',
        options: ['Vedic Civilization', 'Harappan Civilization', 'Mauryan Civilization', 'Gupta Civilization'],
        correctAnswer: 'Harappan Civilization',
        subject: 'History',
        explanation: 'The Indus Valley Civilization is also called the Harappan Civilization.',
      },
      {
        id: 5,
        question: 'Who was known as the Iron Man of India?',
        options: ['B. R. Ambedkar', 'Sardar Vallabhbhai Patel', 'Lal Bahadur Shastri', 'Rajendra Prasad'],
        correctAnswer: 'Sardar Vallabhbhai Patel',
        subject: 'History',
        explanation: 'Sardar Vallabhbhai Patel was known as the Iron Man of India.',
      },
    ],
  },
  APSC: {
    Geography: [
      {
        id: 1,
        question: 'Which river is known as the lifeline of Assam?',
        options: ['Barak', 'Brahmaputra', 'Subansiri', 'Dhansiri'],
        correctAnswer: 'Brahmaputra',
        subject: 'Geography',
        explanation: 'The Brahmaputra is regarded as the lifeline of Assam.',
      },
      {
        id: 2,
        question: 'Kaziranga National Park is famous for:',
        options: ['Asiatic Lion', 'One-Horned Rhinoceros', 'Snow Leopard', 'Red Panda'],
        correctAnswer: 'One-Horned Rhinoceros',
        subject: 'Geography',
        explanation: 'Kaziranga is world-famous for the one-horned rhinoceros.',
      },
      {
        id: 3,
        question: 'Assam is primarily located in which part of India?',
        options: ['Western India', 'Southern India', 'North-Eastern India', 'Central India'],
        correctAnswer: 'North-Eastern India',
        subject: 'Geography',
        explanation: 'Assam is a state in North-Eastern India.',
      },
      {
        id: 4,
        question: 'Which is the largest city in Assam?',
        options: ['Jorhat', 'Silchar', 'Dibrugarh', 'Guwahati'],
        correctAnswer: 'Guwahati',
        subject: 'Geography',
        explanation: 'Guwahati is the largest city in Assam.',
      },
      {
        id: 5,
        question: 'The Barak Valley is mainly located in which region of Assam?',
        options: ['Upper Assam', 'Lower Assam', 'Southern Assam', 'Northern Assam'],
        correctAnswer: 'Southern Assam',
        subject: 'Geography',
        explanation: 'The Barak Valley is in the southern region of Assam.',
      },
    ],
    CurrentAffairs: [
      {
        id: 1,
        question: 'Current affairs preparation is best improved by:',
        options: ['Ignoring newspapers', 'Daily revision and note-making', 'Only watching movies', 'Memorizing random facts'],
        correctAnswer: 'Daily revision and note-making',
        subject: 'CurrentAffairs',
        explanation: 'Daily revision and note-making improve retention and clarity.',
      },
      {
        id: 2,
        question: 'A good current affairs source should be:',
        options: ['Random', 'Exam-relevant and reliable', 'Only social media rumors', 'Old and outdated'],
        correctAnswer: 'Exam-relevant and reliable',
        subject: 'CurrentAffairs',
        explanation: 'Reliable, exam-focused sources are best for preparation.',
      },
      {
        id: 3,
        question: 'Monthly revision helps in:',
        options: ['Reducing memory', 'Building long-term retention', 'Avoiding preparation', 'Skipping practice'],
        correctAnswer: 'Building long-term retention',
        subject: 'CurrentAffairs',
        explanation: 'Revision helps store information better for the exam.',
      },
      {
        id: 4,
        question: 'For government exams, current affairs should be linked with:',
        options: ['Memes only', 'Static GK and concepts', 'Video games', 'Nothing'],
        correctAnswer: 'Static GK and concepts',
        subject: 'CurrentAffairs',
        explanation: 'Linking current affairs with static GK improves understanding.',
      },
      {
        id: 5,
        question: 'The best way to practice current affairs is:',
        options: ['MCQs + revision', 'Ignoring questions', 'Reading once only', 'No notes'],
        correctAnswer: 'MCQs + revision',
        subject: 'CurrentAffairs',
        explanation: 'MCQ practice plus revision is the strongest method.',
      },
    ],
  },
};

const TEST_DURATION_SECONDS = 10 * 60;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function TestPage() {
  const examOptions = Object.keys(questionBank);
  const [selectedExam, setSelectedExam] = useState('UPSC');
  const [selectedSubject, setSelectedSubject] = useState('Polity');
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const subjectOptions = useMemo(() => {
    return Object.keys(questionBank[selectedExam] || {});
  }, [selectedExam]);

  const questions = useMemo(() => {
    return questionBank[selectedExam]?.[selectedSubject] || [];
  }, [selectedExam, selectedSubject]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const score = questions.reduce((acc, question) => {
    return answers[question.id] === question.correctAnswer ? acc + 1 : acc;
  }, 0);

  const skippedCount = questions.filter((q) => !answers[q.id]).length;
  const wrongCount = totalQuestions - score - skippedCount;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  useEffect(() => {
    if (!started || submitted) return;

    if (timeLeft <= 0) {
      setTimeUp(true);
      setSubmitted(true);
      setStarted(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  function handleExamChange(exam: string) {
    setSelectedExam(exam);
    const firstSubject = Object.keys(questionBank[exam])[0];
    setSelectedSubject(firstSubject);
    setStarted(false);
    setSubmitted(false);
    setTimeUp(false);
    setTimeLeft(TEST_DURATION_SECONDS);
    setCurrentIndex(0);
    setAnswers({});
  }

  function handleSubjectChange(subject: string) {
    setSelectedSubject(subject);
    setStarted(false);
    setSubmitted(false);
    setTimeUp(false);
    setTimeLeft(TEST_DURATION_SECONDS);
    setCurrentIndex(0);
    setAnswers({});
  }

  function startTest() {
    setStarted(true);
    setSubmitted(false);
    setTimeUp(false);
    setTimeLeft(TEST_DURATION_SECONDS);
    setCurrentIndex(0);
    setAnswers({});
  }

  function selectAnswer(option: string) {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  }

  function goNext() {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function submitTest() {
    setSubmitted(true);
    setStarted(false);
  }

  function resetTest() {
    setStarted(false);
    setSubmitted(false);
    setTimeUp(false);
    setTimeLeft(TEST_DURATION_SECONDS);
    setCurrentIndex(0);
    setAnswers({});
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/60">
            OrbitPrep AI
          </p>
          <h1 className="text-3xl font-bold md:text-5xl">Mock Test System</h1>
          <p className="mt-3 max-w-2xl text-white/70">
            Choose your exam and subject, start the test, answer questions, and view your score instantly.
          </p>
        </div>

        {!started && !submitted && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold">Start a Test</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-white/70">Select Exam</label>
                <select
                  value={selectedExam}
                  onChange={(e) => handleExamChange(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                >
                  {examOptions.map((exam) => (
                    <option key={exam} value={exam} className="text-black">
                      {exam}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Select Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                >
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject} className="text-black">
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
              <h3 className="text-xl font-semibold">Selected Test</h3>
              <p className="mt-2 text-white/70">
                Exam: <span className="font-medium text-white">{selectedExam}</span>
              </p>
              <p className="mt-1 text-white/70">
                Subject: <span className="font-medium text-white">{selectedSubject}</span>
              </p>
              <p className="mt-1 text-white/70">
                Questions: <span className="font-medium text-white">{questions.length}</span>
              </p>
              <p className="mt-1 text-white/70">
                Duration: <span className="font-medium text-white">10 minutes</span>
              </p>
            </div>

            <button
              onClick={startTest}
              className="mt-8 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Start Test
            </button>
          </section>
        )}

        {started && currentQuestion && (
          <section className="grid gap-6 md:grid-cols-[1fr_280px]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/60">{selectedExam}</p>
                  <h2 className="mt-1 text-2xl font-semibold">{selectedSubject} Test</h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/80">
                    Question {currentIndex + 1} / {totalQuestions}
                  </div>
                  <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                    Time Left: {formatTime(timeLeft)}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-lg font-medium leading-8">{currentQuestion.question}</p>
              </div>

              <div className="mt-6 space-y-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = answers[currentQuestion.id] === option;

                  return (
                    <button
                      key={option}
                      onClick={() => selectAnswer(option)}
                      className={`block w-full rounded-2xl border px-4 py-4 text-left transition ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-400/15 text-white'
                          : 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="rounded-full border border-white/15 px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    onClick={goNext}
                    className="rounded-full bg-white px-5 py-3 font-semibold text-black"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={submitTest}
                    className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-black"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <h3 className="text-xl font-semibold">Question Navigator</h3>
              <div className="mt-5 grid grid-cols-5 gap-3">
                {questions.map((q, index) => {
                  const isActive = index === currentIndex;
                  const isAnswered = Boolean(answers[q.id]);

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(index)}
                      className={`rounded-xl px-3 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-white text-black'
                          : isAnswered
                          ? 'bg-cyan-400/20 text-cyan-200'
                          : 'bg-black/30 text-white/70'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 space-y-2 text-sm text-white/70">
                <p>Answered: {totalQuestions - skippedCount}</p>
                <p>Remaining: {skippedCount}</p>
                <p>Timer: {formatTime(timeLeft)}</p>
              </div>
            </div>
          </section>
        )}

        {submitted && (
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <h2 className="text-3xl font-bold">Test Result</h2>

              {timeUp && (
                <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-red-200">
                  Time is over. Your test was auto-submitted.
                </div>
              )}

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/60">Score</p>
                  <p className="mt-2 text-3xl font-bold">{score} / {totalQuestions}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/60">Percentage</p>
                  <p className="mt-2 text-3xl font-bold">{percentage}%</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/60">Wrong</p>
                  <p className="mt-2 text-3xl font-bold">{wrongCount}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/60">Skipped</p>
                  <p className="mt-2 text-3xl font-bold">{skippedCount}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={resetTest}
                  className="rounded-full bg-white px-6 py-3 font-semibold text-black"
                >
                  Take Another Test
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
              <h3 className="text-2xl font-semibold">Answer Review</h3>

              <div className="mt-6 space-y-5">
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;

                  return (
                    <div
                      key={question.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <p className="text-sm text-white/50">Question {index + 1}</p>
                      <h4 className="mt-2 text-lg font-medium">{question.question}</h4>

                      <div className="mt-4 space-y-2 text-sm">
                        <p>
                          Your Answer:{' '}
                          <span className={isCorrect ? 'text-green-300' : 'text-red-300'}>
                            {userAnswer || 'Not Answered'}
                          </span>
                        </p>
                        <p>
                          Correct Answer:{' '}
                          <span className="text-cyan-300">{question.correctAnswer}</span>
                        </p>
                        <p className="text-white/70">
                          Explanation: {question.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}