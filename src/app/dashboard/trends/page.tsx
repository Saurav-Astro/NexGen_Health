'use client';
import { HealthTrendsChart } from "@/components/dashboard/health-trends-chart";
import { healthTrendAnalysis } from "@/ai/flows/health-trend-analysis";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WeightTrendChart } from "@/components/dashboard/trends/weight-trends-chart";
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { AddHealthLogForm } from "@/components/dashboard/trends/add-health-log-form";

// Type for a single health log entry from Firestore
export type HealthLog = {
    id: string;
    logDate: { toDate: () => Date };
    heartRate?: number;
    bloodPressure?: string;
    weight?: number;
};

export default function TrendsPage() {
    const { user, firestore } = useFirebase();
    const [analysis, setAnalysis] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const healthLogsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, `users/${user.uid}/healthLogs`), orderBy("logDate", "asc"));
    }, [firestore, user]);

    const { data: healthLogs, isLoading: loadingLogs } = useCollection<HealthLog>(healthLogsQuery);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await healthTrendAnalysis({
                healthData: JSON.stringify(healthLogs),
                userDescription: "Generally healthy, trying to monitor blood pressure and weight."
            });
            setAnalysis(result);
        } catch (error) {
            console.error(error);
            setAnalysis({ error: "Failed to analyze trends. Please try again." });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
                    Health Trends
                </h1>
                <p className="text-muted-foreground">
                    Visualize your health data and get AI-powered insights.
                </p>
            </div>
            <Button onClick={handleAnalyze} disabled={isLoading || !healthLogs || healthLogs.length === 0}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Analyze Trends with AI
            </Button>
        </header>

        <AddHealthLogForm />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Vitals Overview</h2>
                 {loadingLogs ? (
                    <div className="h-[400px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="h-[400px]">
                        <HealthTrendsChart data={healthLogs} />
                    </div>
                )}
            </GlassCard>
            <GlassCard className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Weight Trend</h2>
                {loadingLogs ? (
                     <div className="h-[400px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <div className="h-[400px]">
                        <WeightTrendChart data={healthLogs} />
                    </div>
                )}
            </GlassCard>
        </div>


        {analysis && (
            <GlassCard className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">AI Analysis</h2>
                {analysis.error ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{analysis.error}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                       <Alert>
                            <AlertTitle>Trend Summary</AlertTitle>
                            <AlertDescription>{analysis.trendSummary}</AlertDescription>
                        </Alert>
                       <Alert>
                            <AlertTitle>Anomalies Detected</AlertTitle>
                            <AlertDescription>{analysis.anomalies}</AlertDescription>
                        </Alert>
                        <Alert>
                            <AlertTitle>Recommendations</AlertTitle>
                            <AlertDescription>{analysis.recommendations}</AlertDescription>
                        </Alert>
                    </div>
                )}
            </GlassCard>
        )}
    </div>
  );
}
