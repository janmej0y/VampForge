import { BrainCircuit, Palette, Rocket, TimerReset } from "lucide-react";

const benefits = [
  {
    icon: TimerReset,
    title: "Save Time",
    description: "Move from scattered docs and half-finished profiles to one coherent workflow.",
  },
  {
    icon: Palette,
    title: "Professional Design",
    description: "Use polished layouts built for developers, recruiters, and real-world sharing.",
  },
  {
    icon: BrainCircuit,
    title: "AI Insights",
    description: "Surface resume strengths, weaknesses, and ATS opportunities with mock intelligence.",
  },
  {
    icon: Rocket,
    title: "Instant Deployment",
    description: "Launch your public-facing portfolio with a clean, one-click hosting experience.",
  },
];

export function BenefitsSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Benefits
          </div>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Built to make your identity sharper, faster, and easier to share
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-6 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-primary/20"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-primary/20 bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-5 text-xl font-semibold text-white">
                  {benefit.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
