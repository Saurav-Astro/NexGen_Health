import { PrescriptionManager } from "@/components/dashboard/prescription-manager";

export default function PrescriptionsPage() {
  return (
    <div>
        <header>
            <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
                Prescription Tracker
            </h1>
            <p className="text-muted-foreground">
                Manage your medications, dosages, and schedules all in one place.
            </p>
        </header>
        <div className="mt-8">
            <PrescriptionManager />
        </div>
    </div>
  );
}
