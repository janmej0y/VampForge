"use client";

import { motion, type Variants } from "framer-motion";
import { MapPin, Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Ankit V.",
    role: "Frontend Engineer",
    location: "Bengaluru",
    quote:
      "VampForge helped me turn scattered projects into a portfolio and resume that finally looked interview-ready.",
    initials: "AV",
  },
  {
    name: "Rohan M.",
    role: "Full-Stack Developer",
    location: "Pune",
    quote:
      "The live preview flow is clean. I updated my resume, fixed weak bullets, and exported a better version in one sitting.",
    initials: "RM",
  },
  {
    name: "Saurabh I.",
    role: "Product Engineer",
    location: "Hyderabad",
    quote:
      "It feels made for developers who care about presentation but do not want to spend the whole weekend fighting design tools.",
    initials: "SI",
  },
  {
    name: "Pranav K.",
    role: "MERN Stack Developer",
    location: "Mumbai",
    quote:
      "The resume builder gave my projects a sharper structure. The export quality felt much more recruiter-friendly.",
    initials: "PK",
  },
  {
    name: "Arjun N.",
    role: "Backend Developer",
    location: "Kochi",
    quote:
      "I liked that the interview prep, resume, and portfolio all stayed in one place. It made the whole career prep process calmer.",
    initials: "AN",
  },
  {
    name: "Kunal D.",
    role: "React Developer",
    location: "Delhi",
    quote:
      "The UI feels premium, but the best part is speed. I could polish my developer profile without opening five different tools.",
    initials: "KD",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-16 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_42%),linear-gradient(90deg,transparent,rgba(139,92,246,0.08),transparent)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
              Indian Developer Reviews
            </div>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Loved by developers building from India for global teams.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Realistic career-workflow feedback from Indian developer profiles across frontend, backend, full-stack, and product engineering paths.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
              From India&apos;s tech hubs
            </div>
            <div className="flex -space-x-3">
              {testimonials.slice(0, 5).map((item, index) => (
                <motion.div
                  key={item.initials}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0A0F1C] bg-[linear-gradient(135deg,#67e8f9,#8b5cf6,#fbbf24)] text-sm font-bold text-slate-950 shadow-[0_14px_34px_rgba(34,211,238,0.18)]"
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                >
                  {item.initials}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mb-6 flex gap-3 overflow-hidden"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <motion.div
            className="flex min-w-max gap-3"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-slate-300 backdrop-blur-xl"
              >
                <MapPin className="h-3.5 w-3.5 text-cyan-200" />
                {testimonial.location}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.name}
              variants={card}
              className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.032))] p-6 shadow-[0_24px_80px_rgba(2,8,23,0.32)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/30 hover:bg-white/[0.065] hover:shadow-[0_34px_110px_rgba(34,211,238,0.12)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(103,232,249,0.14),transparent_36%)] opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-1 text-amber-200">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-cyan-200/70" />
              </div>

              <p className="relative mt-6 min-h-[128px] text-base leading-8 text-slate-200">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="relative mt-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#67e8f9,#8b5cf6,#fbbf24)] text-sm font-bold text-slate-950 shadow-[0_16px_34px_rgba(34,211,238,0.18)]">
                  {testimonial.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-cyan-100/80">
                    <MapPin className="h-3 w-3" />
                    {testimonial.location}
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] opacity-0 transition duration-300 group-hover:opacity-100" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
