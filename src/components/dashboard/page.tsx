'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Bot, HeartPulse, Pill, Siren } from 'lucide-react';
import { GlassCard } from '@/components/glass-card';
import Link from 'next/link';
import { HealthTrendsChart } from '@/components/dashboard/health-trends-chart';
import { useUser } from '@/firebase/provider';

export default function DashboardPage() {
  const { userData } = useUser();

  const quickLinks = [
    { title: 'AI Chatbot', icon: Bot, href: '/dashboard/chatbot' },
    { title: 'Prescriptions', icon: Pill, href: '/dashboard/prescriptions' },
    { title: 'Health Trends', icon: BarChart3, href: '/dashboard/trends' },
    { title: 'Smart Alerts', icon: Siren, href: '/dashboard/alerts' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {userData?.displayName || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your health dashboard.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(link => (
          <Link href={link.href} key={link.href}>
             <GlassCard className="p-6 transition-transform duration-300 hover:-translate-y-1">
               <div className="flex items-center justify-between">
                  <p className="font-semibold">{link.title}</p>
                  <link.icon className="h-6 w-6 text-primary" />
                </div>
              </GlassCard>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2 p-6">
            <h2 className="font-headline text-2xl font-bold mb-4">Health Trends</h2>
            <div className="h-[350px]">
                <HealthTrendsChart />
            </div>
        </GlassCard>
        <GlassCard className="p-6">
            <h2 className="font-headline text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">New heart rate data logged.</p>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                    <Pill className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Reminder: Take morning medication.</p>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                    <Siren className="h-5 w-5 text-destructive" />
                    <p className="text-sm text-muted-foreground">Alert: Elevated blood pressure detected.</p>
                </div>
            </div>
        </GlassCard>
      </div>

    </div>
  );
}
