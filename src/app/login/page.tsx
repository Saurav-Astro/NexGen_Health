import { GlassCard } from "@/components/glass-card";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/login/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center">
            <Logo />
            <h1 className="mt-4 font-headline text-2xl font-bold text-foreground">
                Welcome Back
            </h1>
            <p className="text-muted-foreground">
                Sign in to access your health dashboard.
            </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
            </Link>
        </p>
      </GlassCard>
    </div>
  );
}
