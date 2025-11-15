import { Hero } from "@/components/home/hero";
import { FeaturesGrid } from "@/components/home/features-grid";
import { Testimonials } from "@/components/home/testimonials";
import { CTA } from "@/components/home/cta";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturesGrid />
      <Testimonials />
      <CTA />
    </div>
  );
}
