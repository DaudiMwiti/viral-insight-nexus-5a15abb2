
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChartDataType, InsightDataType } from '@/types/insight';

interface DashboardChartsProps {
  data: InsightDataType | null;
  platform?: string;
}

const DashboardCharts = ({ data, platform }: DashboardChartsProps) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  if (!data) return null;
  
  // Extract chart data for the selected platform or use default
  const chartData = platform && data.platformChartData?.[platform] 
    ? data.platformChartData[platform] 
    : data.chartData;
  
  // Generate sentiment trend data (mock data for demonstration)
  const sentimentTrendData = [
    { date: '04/05', positive: 65, neutral: 25, negative: 10 },
    { date: '04/06', positive: 68, neutral: 22, negative: 10 },
    { date: '04/07', positive: 70, neutral: 20, negative: 10 },
    { date: '04/08', positive: 65, neutral: 22, negative: 13 },
    { date: '04/09', positive: 60, neutral: 25, negative: 15 },
    { date: '04/10', positive: 63, neutral: 27, negative: 10 },
    { date: '04/11', positive: 68, neutral: 22, negative: 10 },
  ];
  
  // Generate platform engagement data
  const platformEngagementData = [
    { name: 'Twitter', value: 35, color: '#1DA1F2' },
    { name: 'Reddit', value: 20, color: '#FF4500' },
    { name: 'LinkedIn', value: 18, color: '#0A66C2' },
    { name: 'Instagram', value: 15, color: '#E1306C' },
    { name: 'YouTube', value: 12, color: '#FF0000' },
  ];
  
  // Generate post volume data
  const postVolumeData = chartData.engagement || [
    { name: 'Mon', value: 240 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 320 },
    { name: 'Thu', value: 280 },
    { name: 'Fri', value: 450 },
    { name: 'Sat', value: 380 },
    { name: 'Sun', value: 290 },
  ];
  
  // Calculate trend indicators
  const positiveTrend = sentimentTrendData[sentimentTrendData.length - 1].positive > 
    sentimentTrendData[0].positive;
  
  const postVolumeTrend = postVolumeData[postVolumeData.length - 1].value > 
    postVolumeData[0].value;
  
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
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
    >
      {/* Sentiment Trend Chart */}
      <Card className="col-span-1 lg:col-span-2">
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
            <AreaChart data={sentimentTrendData}>
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
      
      {/* Platform Engagement Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Platform Engagement</CardTitle>
          <CardDescription>Distribution across platforms</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={platformEngagementData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {platformEngagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Post Volume Trend */}
      <Card className="col-span-1 lg:col-span-3">
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
            <BarChart data={postVolumeData}>
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
      
      {/* Additional Sparkline Chart (Optional) */}
      <motion.div 
        className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {['Mentions', 'Clicks', 'Shares'].map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{metric}</span>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription className="flex items-center justify-between">
                <span>Last 7 days</span>
                {getTrendText(index !== 1, index === 1 ? 3 : 8)}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={postVolumeData.map(d => ({...d, value: d.value * (0.5 + Math.random() * 0.8)}))}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={index === 1 ? "#ef4444" : "#8B5CF6"} 
                    strokeWidth={2} 
                    dot={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm text-xs">
                            <span>{payload[0].value?.toFixed(0)}</span>
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
        ))}
      </motion.div>
    </motion.div>
  );
};

export default DashboardCharts;
