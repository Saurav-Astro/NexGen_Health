import Image from 'next/image';
import { features } from '@/lib/data';
import placeholderData from '@/lib/placeholder-images.json';
import { GlassCard } from '@/components/glass-card';

const featureDetails = [
  {
    id: "ai-chatbot",
    title: "AI Chatbot",
    description: "Our conversational assistant provides instant, empathetic responses to your health-related queries. Log symptoms, ask questions, and get reliable information 24/7. It's like having a health encyclopedia that talks back.",
    imageId: "ai-chatbot-feature"
  },
  {
    id: "prescription-tracker",
    title: "Prescription Tracker",
    description: "Never miss a dose again. Our intelligent tracker helps you log medications, schedule reminders, and monitor your adherence over time. Gain insights into your treatment patterns and share progress with your doctor.",
    imageId: "prescription-feature"
  },
  {
    id: "health-trends",
    title: "Health Trends",
    description: "Leveraging state-of-the-art machine learning, our platform analyzes your health data to detect anomalies and identify long-term patterns. Understand your body's signals and get proactive insights into your health trajectory.",
    imageId: "trends-feature"
  },
  {
    id: "agora-ai",
    title: "Agora AI",
    description: "Experience the next generation of remote care. Agora AI enables seamless teleconsultation with advanced features like real-time voice input and emotional-sentiment understanding, fostering a more empathetic doctor-patient connection.",
    imageId: "agora-feature"
  },
  {
    id: "smart-alerts",
    title: "Smart Alerts",
    description: "Our system acts as your personal health guardian. It analyzes incoming data for risk signals and sends proactive notifications to you and, with your permission, your doctors. Early warnings can lead to better outcomes.",
    imageId: "alerts-feature"
  },
  {
    id: "cloud-sync",
    title: "Cloud Sync",
    description: "Your health data, unified and secure. Cloud Sync ensures real-time, encrypted synchronization of all your information across every device. Access your complete health picture, anytime, anywhere.",
    imageId: "sync-feature"
  }
];

export default function FeaturesPage() {
  return (
    <div className="container py-16 md:py-24">
      <header className="text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Platform <span className="text-primary">Features</span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
          Discover the powerful tools integrated into NexGen Health, designed
          to give you complete control over your well-being.
        </p>
      </header>

      <div className="mt-20 space-y-24">
        {featureDetails.map((feature, index) => {
          const imageData = placeholderData.placeholderImages.find(p => p.id === feature.imageId);
          const isReversed = index % 2 !== 0;
          return (
            <section
              key={feature.id}
              id={feature.id}
              className="grid items-center gap-12 md:grid-cols-2 lg:gap-16"
            >
              <div className={`space-y-4 ${isReversed ? 'md:order-last' : ''}`}>
                <span className="text-sm font-bold uppercase tracking-wider text-primary">
                  {feature.title}
                </span>
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground">
                  {feature.title}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {feature.description}
                </p>
              </div>
              <GlassCard>
                {imageData && (
                    <Image
                      src={imageData.imageUrl}
                      alt={imageData.description}
                      width={500}
                      height={500}
                      className="rounded-lg object-cover aspect-square"
                      data-ai-hint={imageData.imageHint}
                    />
                )}
              </GlassCard>
            </section>
          );
        })}
      </div>
    </div>
  );
}
