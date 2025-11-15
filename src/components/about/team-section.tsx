import Image from "next/image";
import { GlassCard } from "../glass-card";
import placeholderData from "@/lib/placeholder-images.json";

const teamMembers = [
  {
    id: "jane-doe",
    name: "Dr. Jane Doe",
    role: "Founder & CEO",
  },
  {
    id: "john-smith",
    name: "John Smith",
    role: "Chief Technology Officer",
  },
  {
    id: "emily-white",
    name: "Dr. Emily White",
    role: "Chief Medical Officer",
  },
  {
    id: "chris-green",
    name: "Chris Green",
    role: "Head of Product",
  },
];

export function TeamSection() {
  return (
    <section className="mt-24">
      <div className="text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Meet the Team
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          The innovators and experts dedicated to revolutionizing your health.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member) => {
          const imageData = placeholderData.placeholderImages.find(p => p.id === member.id);
          return (
            <GlassCard key={member.name} className="p-6 text-center">
              {imageData && (
                <Image
                  src={imageData.imageUrl}
                  alt={`Photo of ${member.name}`}
                  width={200}
                  height={200}
                  className="mx-auto h-32 w-32 rounded-full object-cover"
                  data-ai-hint={imageData.imageHint}
                />
              )}
              <h3 className="mt-6 text-lg font-semibold text-foreground">
                {member.name}
              </h3>
              <p className="text-sm text-primary">{member.role}</p>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
