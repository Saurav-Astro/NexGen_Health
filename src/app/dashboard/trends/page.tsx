'use client';
import { HealthTrendsChart } from "@/components/dashboard/health-trends-chart";
import { healthTrendAnalysis } from "@/ai/flows/health-trend-analysis";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { Loader2, Wand2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const mockHealthData = [
    { date: "2023-05-01", heartRate: 72, bloodPressure: 120 },
    { date: "2023-05-02", heartRate: 75, bloodPressure: 122 },
    { date: "2023-05-03", heartRate: 71, bloodPressure: 118 },
    { date: "2023-05-04", heartRate: 78, bloodPressure: 125 },
    { date: "2023-05-05", heartRate: 80, bloodPressure: 128 },
    { date: "2023-05-06", heartRate: 76, bloodPressure: 124 },
    { date: "2023-05-07", heartRate: 74, bloodPressure: 121 },
];

export default function TrendsPage() {
    const [analysis, setAnalysis] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await healthTrendAnalysis({
                healthData: JSON.stringify(mockHealthData),
                userDescription: "Generally healthy, trying to monitor blood pressure."
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
            <Button onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Analyze Trends with AI
            </Button>
        </header>

        <GlassCard className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Vitals Overview</h2>
             <div className="h-[400px]">
                <HealthTrendsChart data={mockHealthData} />
            </div>
        </GlassCard>

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
