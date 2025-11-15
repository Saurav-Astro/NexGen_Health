
'use client';
import type { HealthLog } from '@/app/dashboard/trends/page';
import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface HealthTrendsChartProps {
    data?: HealthLog[] | null;
}

const defaultData = [
  { date: 'Nov 10 2025', heartRate: 70, bloodPressure: 118 },
  { date: 'Nov 11 2025', heartRate: 72, bloodPressure: 121 },
  { date: 'Nov 12 2025', heartRate: 68, bloodPressure: 115 },
  { date: 'Nov 13 2025', heartRate: 75, bloodPressure: 124 },
  { date: 'Nov 14 2025', heartRate: 73, bloodPressure: 122 },
];

export function HealthTrendsChart({ data }: HealthTrendsChartProps) {
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return defaultData;

    return data.map(log => ({
        date: log.logDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        heartRate: log.heartRate,
        bloodPressure: log.bloodPressure ? parseInt(log.bloodPressure.split('/')[0]) : undefined,
    }));
  }, [data]);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={processedData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
        />
        <YAxis
            yAxisId="left"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 5', 'dataMax + 5']}
        />
        <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 10', 'dataMax + 10']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
        />
        <Legend wrapperStyle={{fontSize: "14px"}} />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="heartRate"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Heart Rate (bpm)"
          dot={{ fill: 'hsl(var(--primary))', r: 4 }}
          activeDot={{ r: 6 }}
          connectNulls
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="bloodPressure"
          stroke="hsl(var(--accent))"
          strokeWidth={2}
          name="Blood Pressure (mmHg)"
          dot={{ fill: 'hsl(var(--accent))', r: 4 }}
          activeDot={{ r: 6 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
