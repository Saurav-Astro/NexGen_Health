import Link from "next/link";
import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="container relative z-10 text-center">
        <div 
          style={{"--delay": "0.2s"} as React.CSSProperties}
          className="animate-fade-in opacity-0"
        >
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">NexGen Health</span>
            <span className="block text-primary">Connected Health Management</span>
          </h1>
        </div>
        <div 
          style={{"--delay": "0.4s"} as React.CSSProperties}
          className="animate-fade-in opacity-0"
        >
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Empowering Smarter, Connected Health Management
          </p>
        </div>
        <div 
          style={{"--delay": "0.6s"} as React.CSSProperties}
          className="animate-fade-in opacity-0"
        >
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-grid-white/[0.05]"></div>
    </section>
  );
}
