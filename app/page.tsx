import { CTASection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/footer";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingNavbar } from "@/components/landing/navbar";
import { PreviewSection } from "@/components/landing/preview-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";

export default function Home() {
  return (
    <div className="premium-landing relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid bg-[size:72px_72px] opacity-[0.08]" />
      <div className="pointer-events-none fixed inset-0 z-0 premium-noise opacity-[0.14]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[620px] bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.2),transparent_42%),linear-gradient(115deg,rgba(59,130,246,0.12),transparent_30%,rgba(186,230,253,0.32)_70%,transparent)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,transparent_0%,rgba(7,11,21,0.42)_48%,#0A0F1C_100%)]" />

      <div className="relative z-10">
        <LandingNavbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <PreviewSection />
          <HowItWorks />
          <TestimonialsSection />
          <CTASection />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
