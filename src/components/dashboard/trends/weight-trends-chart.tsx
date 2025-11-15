
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

interface WeightTrendChartProps {
  data?: HealthLog[] | null;
}

const defaultData = [
    { date: 'Nov 10 2025', weight: 70.5 },
    { date: 'Nov 11 2025', weight: 70.2 },
    { date: 'Nov 12 2025', weight: 70.8 },
    { date: 'Nov 13 2025', weight: 70.6 },
    { date: 'Nov 14 2025', weight: 70.3 },
];

export function WeightTrendChart({ data }: WeightTrendChartProps) {
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return defaultData;

    return data
        .filter(log => log.weight)
        .map(log => ({
            date: log.logDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            weight: log.weight,
        }));
  }, [data]);
  
  const chartData = processedData.length > 0 ? processedData : defaultData;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
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
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={['dataMin - 2', 'dataMax + 2']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
        />
        <Legend wrapperStyle={{ fontSize: '14px' }} />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          name="Weight (kg)"
          dot={{ fill: 'hsl(var(--chart-3))', r: 4 }}
          activeDot={{ r: 6 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
