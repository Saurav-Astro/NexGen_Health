
'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import agoraConfig from '@/lib/agora-config.json';
import { useUser } from '@/firebase/provider';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    AgoraAppBuilder: any;
  }
}

export default function MeetingPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const meetingId = params.id as string;

  useEffect(() => {
    if (typeof window === 'undefined' || !window.AgoraAppBuilder) {
      console.warn('Agora App Builder SDK not loaded.');
      // You might want to show an error message to the user here
      return;
    }
    
    const agoraAppBuilder = new window.AgoraAppBuilder();

    agoraAppBuilder.create({
      config: {
        ...agoraConfig,
        username: user?.displayName || 'NexGen User',
        channel: meetingId,
        token: '',
      },
      callbacks: {
        EndCall: () => {
            router.push('/dashboard/teleconsultation');
        },
      },
    });

  }, [meetingId, router, user?.displayName]);

  return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Joining teleconsultation room...</p>
      </div>
  );
}
