
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SparklineDataPoint {
  name: string;
  value: number;
}

interface VolumeTrendSparklineProps {
  data: SparklineDataPoint[];
  title: string;
  isPositive?: boolean;
  trendValue?: number;
  color?: string;
  className?: string;
}

const VolumeTrendSparkline: React.FC<VolumeTrendSparklineProps> = ({ 
  data, 
  title, 
  isPositive = true, 
  trendValue = 8,
  color = "#8B5CF6",
  className 
}) => {
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
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Last 7 days</span>
          {getTrendText(isPositive, trendValue)}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[80px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={!isPositive ? "#ef4444" : color} 
              strokeWidth={2} 
              dot={false}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border rounded shadow-sm text-xs">
                      <span>{typeof payload[0].value === 'number' 
                        ? payload[0].value.toFixed(0) 
                        : parseInt(String(payload[0].value))}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VolumeTrendSparkline;
