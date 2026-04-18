'use client';

import { motion } from 'framer-motion';

export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Assessment",
      desc: "Practice with a dynamic engine that understands your learning curve and adapts to your needs.",
    },
    {
      title: "Curation Engine",
      desc: "Daily current affairs filtered specifically for UPSC and APSC relevance. No noise, just essentials.",
    },
    {
      title: "Legacy Integration",
      desc: "Past decade of previous papers, analyzed and categorized by exam trends and difficulty.",
    },
    {
      title: "Strategic Analytics",
      desc: "Granular insights into your performance. Identify weak links before they become failure points.",
    },
    {
      title: "Personalized Mentor",
      desc: "Your dedicated AI guide for strategy, revision scheduling, and real-time concept clarification.",
    },
    {
      title: "The Premium Loop",
      desc: "An end-to-end ecosystem. From first study session to final mock test, experience total focus.",
    },
  ];

  return (
    <section className="bg-[#000] px-6 py-32 text-white md:px-12 md:py-48">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-[0.4em] text-white/40"
          >
            Ecosystem
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl text-5xl font-bold leading-[1.1] tracking-[-0.04em] sm:text-7xl"
          >
            Engineered for <br />
            <span className="text-white/40">uncompromising results.</span>
          </motion.h2>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="group relative bg-[#000] p-10 transition-colors hover:bg-white/[0.02]"
            >
              <div className="mb-8 flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-bold transition-transform duration-500 group-hover:scale-110">
                ✦
              </div>
              <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
              <p className="mt-4 text-lg leading-relaxed text-white/40 transition-colors group-hover:text-white/60">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
