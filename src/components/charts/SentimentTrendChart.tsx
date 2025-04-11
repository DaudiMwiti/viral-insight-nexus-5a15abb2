
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SentimentTrendDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentTrendChartProps {
  data: SentimentTrendDataPoint[];
  className?: string;
}

const SentimentTrendChart: React.FC<SentimentTrendChartProps> = ({ data, className }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  // Calculate trend indicators
  const positiveTrend = data[data.length - 1].positive > data[0].positive;
  
  const getTrendIcon = (isPositive: boolean) => {
    return isPositive 
      ? <TrendingUp className="h-5 w-5 text-green-500" />
      : <TrendingDown className="h-5 w-5 text-red-500" />;
  };
  
  const getTrendText = (isPositive: boolean, value: number) => {
    return (
      <span className={cn(
        "text-sm font-medium",
        isPositive ? "text-green-500" : "text-red-500"
      )}>
        {isPositive ? "+" : "-"}{value}%
      </span>
    );
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' 
                ? `${entry.value.toFixed(0)}%` 
                : `${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className={cn("col-span-1 lg:col-span-2", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            Sentiment Trend
            <div className="ml-2 flex items-center">
              {getTrendIcon(positiveTrend)}
              {getTrendText(positiveTrend, 4)}
            </div>
          </CardTitle>
          <CardDescription>Sentiment distribution over time</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={timeRange === '7d' ? 'bg-muted' : ''}
            onClick={() => setTimeRange('7d')}
          >
            7D
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={timeRange === '30d' ? 'bg-muted' : ''}
            onClick={() => setTimeRange('30d')}
          >
            30D
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={timeRange === '90d' ? 'bg-muted' : ''}
            onClick={() => setTimeRange('90d')}
          >
            90D
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="positive" 
              stackId="1" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.8}
              name="Positive"
            />
            <Area 
              type="monotone" 
              dataKey="neutral" 
              stackId="1" 
              stroke="#6b7280" 
              fill="#6b7280" 
              fillOpacity={0.6}
              name="Neutral"
            />
            <Area 
              type="monotone" 
              dataKey="negative" 
              stackId="1" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.6}
              name="Negative"
            />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SentimentTrendChart;
