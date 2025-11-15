import Link from 'next/link';
import { Button } from '../ui/button';

export function CTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to Take Control?
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
          Join NexGen Health today and start your journey towards a smarter,
          more connected health future. It's free to get started.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/signup">Sign Up for Free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
