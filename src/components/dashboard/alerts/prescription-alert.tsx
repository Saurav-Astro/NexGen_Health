
'use client';

import { useEffect, useRef, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { addHours, differenceInSeconds } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell } from 'lucide-react';

type Prescription = {
  id: string;
  name: string;
  frequency: number;
  lastTaken?: Timestamp;
};

interface PrescriptionAlertProps {
  prescriptions: Prescription[];
}

export function PrescriptionAlert({ prescriptions }: PrescriptionAlertProps) {
  const [duePrescriptions, setDuePrescriptions] = useState<Prescription[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playedAlerts = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
    }
  }, []);

  useEffect(() => {
    const checkPrescriptions = () => {
      const now = new Date();
      const due = prescriptions.filter(p => {
        if (!p.lastTaken) return false;
        const nextDoseTime = addHours(p.lastTaken.toDate(), p.frequency);
        return differenceInSeconds(nextDoseTime, now) <= 0;
      });
      
      setDuePrescriptions(due);

      due.forEach(p => {
        if (!playedAlerts.current.has(p.id)) {
            audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
            playedAlerts.current.add(p.id);
        }
      });
    };

    const interval = setInterval(checkPrescriptions, 1000);
    return () => clearInterval(interval);
  }, [prescriptions]);

  if (duePrescriptions.length === 0) {
    return null;
  }

  return (
    <>
      {duePrescriptions.map(p => (
        <Alert key={p.id} variant="destructive">
          <Bell className="h-5 w-5" />
          <AlertTitle className="flex justify-between items-center">
            <span>Medication Due: {p.name}</span>
            <span className="text-xs font-normal">Just now</span>
          </AlertTitle>
          <AlertDescription>
            It's time to take your dose of {p.name}.
          </AlertDescription>
        </Alert>
      ))}
    </>
  );
}
