import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export const Logo = ({ className, showText = true }: { className?: string; showText?: boolean }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Activity className="h-7 w-7 text-primary" />
      {showText && (
          <span className="text-xl font-headline font-bold text-foreground">
            NexGen Health
          </span>
      )}
    </div>
  );
};
