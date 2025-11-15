import Link from 'next/link';
import { features } from '@/lib/data';
import { GlassCard } from '../glass-card';

export function FeaturesGrid() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A New Era of Health Intelligence
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform integrates cutting-edge technology to give you
            unprecedented control over your health journey.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              style={{"--delay": `${0.2 + index * 0.1}s`} as React.CSSProperties}
              className="animate-fade-in opacity-0"
            >
              <Link href={feature.link} className="h-full block">
                <GlassCard className="flex h-full flex-col p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </GlassCard>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
