
import React from 'react';
import { motion } from 'framer-motion';
import { InsightDataType } from '@/types/insight';
import SentimentTrendChart from '../charts/SentimentTrendChart';
import PlatformEngagementChart from '../charts/PlatformEngagementChart';
import VolumeTrendChart from '../charts/VolumeTrendChart';
import VolumeTrendSparkline from '../charts/VolumeTrendSparkline';

interface DashboardChartsProps {
  data: InsightDataType | null;
  platform?: string;
}

const DashboardCharts = ({ data, platform }: DashboardChartsProps) => {
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

  // Generate sparkline metrics
  const getSparklineData = (baseData: any[]) => {
    return baseData.map(d => ({...d, value: d.value * (0.5 + Math.random() * 0.8)}));
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
    >
      {/* Sentiment Trend Chart */}
      <SentimentTrendChart data={sentimentTrendData} />
      
      {/* Platform Engagement Chart */}
      <PlatformEngagementChart data={platformEngagementData} />
      
      {/* Post Volume Trend */}
      <VolumeTrendChart data={postVolumeData} />
      
      {/* Additional Sparkline Charts */}
      <motion.div 
        className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <VolumeTrendSparkline 
          data={getSparklineData(postVolumeData)} 
          title="Mentions" 
          isPositive={true} 
          trendValue={8}
        />
        <VolumeTrendSparkline 
          data={getSparklineData(postVolumeData)} 
          title="Clicks" 
          isPositive={false} 
          trendValue={3}
          color="#ef4444"
        />
        <VolumeTrendSparkline 
          data={getSparklineData(postVolumeData)} 
          title="Shares" 
          isPositive={true} 
          trendValue={8}
        />
      </motion.div>
    </motion.div>
  );
};

export default DashboardCharts;
