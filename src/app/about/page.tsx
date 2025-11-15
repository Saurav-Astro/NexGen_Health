import Image from "next/image";
import { TeamSection } from "@/components/about/team-section";
import { GlassCard } from "@/components/glass-card";
import { CheckCircle2 } from "lucide-react";
import placeholderImage from "@/lib/placeholder-images.json";

export default function AboutPage() {
  const missionImage = placeholderImage.placeholderImages.find(p => p.id === "mission-vision");

  return (
    <div className="container py-16 md:py-24">
      <header className="text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          About <span className="text-primary">NexGen Health</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
          We are dedicated to building the future of personalized and proactive
          healthcare through technology.
        </p>
      </header>

      <section className="mt-20 grid gap-12 md:grid-cols-2 lg:gap-16 items-center">
        <div className="space-y-8">
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground">
              Our Mission
            </h2>
            <p className="mt-4 text-muted-foreground">
              To empower individuals with intelligent tools to manage their
              health, prevent disease, and live longer, healthier lives. We
              believe that by making health data accessible, understandable,
              and actionable, we can transform healthcare from reactive
              treatment to proactive wellness.
            </p>
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground">
              Our Vision
            </h2>
            <p className="mt-4 text-muted-foreground">
              To create a world where everyone has a personalized, AI-powered
              health co-pilot. A future where healthcare is a continuous,
              collaborative journey between individuals and their care
              providers, supported by seamless technology.
            </p>
          </div>
        </div>
        <div>
          <GlassCard>
            {missionImage && (
              <Image
                src={missionImage.imageUrl}
                alt={missionImage.description}
                width={600}
                height={600}
                className="rounded-lg object-cover aspect-square"
                data-ai-hint={missionImage.imageHint}
              />
            )}
          </GlassCard>
        </div>
      </section>

      <section className="mt-24 text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Our Core Values
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "User-Centric", description: "Our users' health and privacy are our top priorities. We design with empathy and purpose." },
            { title: "Innovation", description: "We relentlessly pursue technological advancements to solve real-world health problems." },
            { title: "Integrity", description: "We are committed to the highest standards of security, ethics, and transparency in everything we do." },
          ].map((value) => (
            <GlassCard key={value.title} className="p-8">
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
              <p className="mt-2 text-muted-foreground">{value.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <TeamSection />
    </div>
  );
}
