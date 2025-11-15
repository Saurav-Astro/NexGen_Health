import { GlassCard } from "@/components/glass-card";
import { Logo } from "@/components/logo";
import { SignupForm } from "@/components/signup/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center">
            <Logo />
            <h1 className="mt-4 font-headline text-2xl font-bold text-foreground">
                Create Your Account
            </h1>
            <p className="text-muted-foreground">
                Start your journey to better health today.
            </p>
        </div>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
            </Link>
        </p>
      </GlassCard>
    </div>
  );
}
