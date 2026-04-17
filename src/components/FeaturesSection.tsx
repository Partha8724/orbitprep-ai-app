export default function FeaturesSection() {
  const features = [
    {
      title: "AI Mock Tests",
      desc: "Practice exam-style questions with a cleaner and smarter test experience.",
    },
    {
      title: "Daily Current Affairs",
      desc: "Stay updated with important topics relevant for UPSC, APSC, and govt exams.",
    },
    {
      title: "Previous Papers",
      desc: "Revise question patterns and understand exam trends from past papers.",
    },
    {
      title: "Performance Analytics",
      desc: "Track strengths, weak areas, and your overall preparation progress.",
    },
    {
      title: "AI Mentor",
      desc: "Get guided support, better revision flow, and smarter preparation help.",
    },
    {
      title: "Premium Access",
      desc: "Unlock deeper practice, advanced insights, and a stronger exam workflow.",
    },
  ];

  return (
    <section className="bg-white px-6 py-24 text-black md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gray-500">
            Features
          </p>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Everything you need to prepare with confidence
          </h2>
          <p className="mt-5 text-base text-gray-600 md:text-lg">
            OrbitPrep AI combines practice, guidance, analytics, and premium learning tools
            in one focused platform for exam preparation.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-black/10 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-4 h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center text-lg font-bold">
                ✦
              </div>
              <h3 className="text-2xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-gray-600 leading-7">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}