
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export interface PlatformEngagementDataPoint {
  name: string;
  value: number;
  color: string;
}

interface PlatformEngagementChartProps {
  data: PlatformEngagementDataPoint[];
  className?: string;
}

const PlatformEngagementChart: React.FC<PlatformEngagementChartProps> = ({ data, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Platform Engagement</CardTitle>
        <CardDescription>Distribution across platforms</CardDescription>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => {
                const percentValue = typeof percent === 'number' 
                  ? (percent * 100).toFixed(0) 
                  : parseInt(String(percent * 100));
                return `${name} ${percentValue}%`;
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PlatformEngagementChart;
