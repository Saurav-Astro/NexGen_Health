'use client';

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
    data?: { date: string; heartRate: number; bloodPressure: number }[];
}

const defaultData = [
  { date: 'May 01', heartRate: 72, bloodPressure: 120 },
  { date: 'May 02', heartRate: 75, bloodPressure: 122 },
  { date: 'May 03', heartRate: 71, bloodPressure: 118 },
  { date: 'May 04', heartRate: 78, bloodPressure: 125 },
  { date: 'May 05', heartRate: 80, bloodPressure: 128 },
  { date: 'May 06', heartRate: 76, bloodPressure: 124 },
  { date: 'May 07', heartRate: 74, bloodPressure: 121 },
];

export function HealthTrendsChart({ data = defaultData }: HealthTrendsChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
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
        />
        <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
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
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
