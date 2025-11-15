
'use client';
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Loader2, Video, Calendar } from "lucide-react";
import { useState } from "react";
import { agoraAITeleconsultation } from "@/ai/flows/agora-ai-teleconsultation";
import Link from "next/link";


export default function TeleconsultationPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLaunch = () => {
        setIsLoading(true);
        
        const meetingUrl = "https://fb6e95e412e6da613128-3wuppwwjc-azreals-projects.vercel.app/d4d42e0c-fe6d-4510-aebe-80b3cfc53307";

        // Non-blocking AI call for analytics/setup
        agoraAITeleconsultation({
            userContext: 'Joining external call',
            voiceInput: meetingUrl
        }).catch(error => {
            console.error("Non-blocking AI teleconsultation call failed:", error);
        });

        // Open the URL in a new tab
        window.open(meetingUrl, '_blank');
        
        // We might want to stop loading after a short delay, as we're opening a new tab.
        setTimeout(() => setIsLoading(false), 1000);
    }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          AI Teleconsultation
        </h1>
        <p className="text-muted-foreground">
          Connect with healthcare professionals through our AI-powered video platform.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 text-center flex flex-col justify-between">
          <div>
            <Video className="mx-auto h-16 w-16 text-primary mb-6" />
            <h2 className="text-2xl font-bold text-foreground">Start an Instant Session</h2>
            <p className="mt-2 max-w-md mx-auto text-muted-foreground">
              Click the button below to launch the teleconsultation client and connect with a doctor immediately.
            </p>
          </div>
          <div className="mt-8">
            <Button size="lg" onClick={handleLaunch} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isLoading ? 'Starting...' : 'Launch Video Call'}
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="p-8 text-center flex flex-col justify-between">
            <div>
                <Calendar className="mx-auto h-16 w-16 text-primary mb-6" />
                <h2 className="text-2xl font-bold text-foreground">Schedule a Future Meeting</h2>
                <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                    Book a time that works for you and your doctor for a detailed consultation.
                </p>
            </div>
            <div className="mt-8">
                <Button size="lg" asChild>
                    <Link href="https://cal.com/saurav-kumar-uyq5iq" target="_blank">
                        Schedule a Meeting
                    </Link>
                </Button>
            </div>
        </GlassCard>
      </div>

       <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">How it works</h2>
          <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">Launch or Schedule:</span> Choose to start an instant session or schedule one for a later time.
            </li>
            <li>
              <span className="font-semibold text-foreground">Join the Room:</span> You will be automatically placed in a virtual waiting room for your instant call.
            </li>
            <li>
              <span className="font-semibold text-foreground">Consult with AI Assistance:</span> Your consultation will feature real-time voice transcription and sentiment analysis to help your doctor better understand your needs.
            </li>
            <li>
              <span className="font-semibold text-foreground">Review Your Summary:</span> After the call, a summary and any recommendations will be available in your dashboard.
            </li>
          </ol>
      </GlassCard>
    </div>
  );
}
