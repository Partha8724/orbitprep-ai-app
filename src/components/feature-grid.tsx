const features = [
  "AI Exam Mentor",
  "Daily Current Affairs PDFs",
  "Previous Year Analysis",
  "Mock Tests & Score Tracking",
  "Pattern Detection",
  "Topic-wise Practice",
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <h3 className="text-xl font-semibold">{feature}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Premium support and guided preparation built for serious exam students.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}