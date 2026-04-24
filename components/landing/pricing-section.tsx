import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting your developer presence live fast.",
    features: ["1 Portfolio", "Resume Generator", "Live Interview", "Resume Analyzer"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "Built for ambitious developers who want more polish and control.",
    features: [
      "Unlimited Portfolios",
      "Custom Domain",
      "Advanced Templates",
      "Priority Deployment History",
    ],
    cta: "Upgrade to Pro",
    featured: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Pricing
          </div>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Start free, upgrade when your brand needs more reach
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-300">
            Simple plans for solo developers, job-seekers, and builders ready to present their best work.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-[2rem] border p-8 shadow-panel ${
                tier.featured
                  ? "border-primary/25 bg-[linear-gradient(180deg,rgba(99,102,241,0.16),rgba(255,255,255,0.05))]"
                  : "border-white/10 bg-white/[0.045]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                    {tier.name} Plan
                  </div>
                  <div className="mt-3 text-4xl font-semibold text-white">
                    {tier.price}
                    {tier.name === "Pro" ? (
                      <span className="ml-2 text-base font-normal text-muted-foreground">
                        / month
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                    {tier.description}
                  </p>
                </div>
                {tier.featured ? (
                  <div className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Most Popular
                  </div>
                ) : null}
              </div>

              <div className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-slate-200">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <Button className="mt-8 w-full" variant={tier.featured ? "default" : "secondary"}>
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
