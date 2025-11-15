
'use client';

import { GlassCard } from "@/components/glass-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Siren, HeartCrack, Activity } from "lucide-react";
import { useFirebase } from "@/firebase/provider";
import { PrescriptionAlert } from "@/components/dashboard/alerts/prescription-alert";

const staticAlerts = [
  {
    id: 1,
    type: "critical",
    title: "High Blood Pressure Detected",
    description: "Your recent reading of 145/95 mmHg is elevated. Please rest and re-measure in 30 minutes. If it remains high, consider contacting your doctor.",
    timestamp: "2 hours ago",
    icon: Siren,
  },
  {
    id: 2,
    type: "warning",
    title: "Irregular Heart Rate Pattern",
    description: "Our AI detected a brief period of irregular heart rhythm overnight. This can be normal, but we recommend monitoring for any symptoms like dizziness or shortness of breath.",
    timestamp: "8 hours ago",
    icon: HeartCrack,
  },
  {
    id: 3,
    type: "info",
    title: "Decreased Activity Level",
    description: "Your activity level has been lower than your weekly average. Remember to incorporate some light movement into your day to meet your goals.",
    timestamp: "1 day ago",
    icon: Activity,
  },
];

export default function AlertsPage() {
  const { prescriptions } = useFirebase();
  const getVariant = (type: string) => {
    if (type === 'critical') return 'destructive';
    return 'default';
  }
  
  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          Smart Alerts
        </h1>
        <p className="text-muted-foreground">
          Proactive notifications about your health, powered by AI.
        </p>
      </header>

      <GlassCard className="p-6">
        <div className="space-y-6">
          <PrescriptionAlert prescriptions={prescriptions} />

          {staticAlerts.map((alert) => (
            <Alert key={alert.id} variant={getVariant(alert.type)}>
              <alert.icon className="h-5 w-5" />
              <AlertTitle className="flex justify-between items-center">
                <span>{alert.title}</span>
                <span className="text-xs font-normal text-muted-foreground">{alert.timestamp}</span>
              </AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          ))}

          {staticAlerts.length === 0 && prescriptions.length === 0 && (
            <div className="text-center py-12">
              <Siren className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No Alerts</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You have no new health alerts. Keep up the good work!
              </p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
