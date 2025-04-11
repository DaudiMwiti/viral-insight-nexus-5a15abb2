
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VolumeDataPoint {
  name: string;
  value: number;
}

interface VolumeTrendChartProps {
  data: VolumeDataPoint[];
  className?: string;
}

const VolumeTrendChart: React.FC<VolumeTrendChartProps> = ({ data, className }) => {
  const postVolumeTrend = data[data.length - 1].value > data[0].value;
  
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
  
  return (
    <Card className={cn("col-span-1 lg:col-span-3", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            Post Volume Trend
            <div className="ml-2 flex items-center">
              {getTrendIcon(postVolumeTrend)}
              {getTrendText(postVolumeTrend, 12)}
            </div>
          </CardTitle>
          <CardDescription>Daily post volume analysis</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="value" 
              fill="#8B5CF6"
              radius={[4, 4, 0, 0]}
              name="Posts"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VolumeTrendChart;
