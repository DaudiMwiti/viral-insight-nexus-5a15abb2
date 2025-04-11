
import { useState } from 'react';
import { ComparisonData, ComparisonOption } from '@/types/comparison';
import { useQuery } from '@tanstack/react-query';

// Mock data for demonstration purposes
const generateMockComparisonData = (targetA: string, targetB: string): ComparisonData => {
  // Get random percentage between -30 and +50
  const getRandomChange = () => Math.floor(Math.random() * 80) - 30;
  
  const sentimentChange = getRandomChange();
  const volumeChange = getRandomChange();
  const engagementChange = getRandomChange();
  
  return {
    sentiment: {
      current: 65,
      previous: 52,
      percentChange: sentimentChange,
      isPositive: sentimentChange > 0
    },
    volume: {
      current: 1245,
      previous: 980,
      percentChange: volumeChange,
      isPositive: volumeChange > 0
    },
    engagement: {
      current: 3450,
      previous: 2800,
      percentChange: engagementChange,
      isPositive: engagementChange > 0
    },
    topTopics: {
      targetA: [
        { topic: 'Product Launch', volume: 120, sentiment: 'positive' },
        { topic: 'Customer Support', volume: 85, sentiment: 'negative' },
        { topic: 'User Interface', volume: 75, sentiment: 'positive' },
        { topic: 'Mobile App', volume: 60, sentiment: 'neutral' }
      ],
      targetB: [
        { topic: 'Product Features', volume: 110, sentiment: 'positive' },
        { topic: 'Pricing', volume: 90, sentiment: 'negative' },
        { topic: 'Performance', volume: 70, sentiment: 'neutral' },
        { topic: 'Documentation', volume: 55, sentiment: 'positive' }
      ]
    },
    trendData: {
      targetA: [
        { date: '2023-01-01', positive: 45, neutral: 30, negative: 25 },
        { date: '2023-01-02', positive: 50, neutral: 25, negative: 25 },
        { date: '2023-01-03', positive: 55, neutral: 25, negative: 20 },
        { date: '2023-01-04', positive: 60, neutral: 20, negative: 20 },
        { date: '2023-01-05', positive: 65, neutral: 20, negative: 15 },
        { date: '2023-01-06', positive: 70, neutral: 15, negative: 15 },
        { date: '2023-01-07', positive: 75, neutral: 15, negative: 10 }
      ],
      targetB: [
        { date: '2023-01-01', positive: 40, neutral: 35, negative: 25 },
        { date: '2023-01-02', positive: 45, neutral: 30, negative: 25 },
        { date: '2023-01-03', positive: 45, neutral: 30, negative: 25 },
        { date: '2023-01-04', positive: 50, neutral: 30, negative: 20 },
        { date: '2023-01-05', positive: 55, neutral: 25, negative: 20 },
        { date: '2023-01-06', positive: 60, neutral: 25, negative: 15 },
        { date: '2023-01-07', positive: 65, neutral: 20, negative: 15 }
      ]
    }
  };
};

// Mock comparison options
export const platformOptions: ComparisonOption[] = [
  { id: 'twitter', name: 'X (Twitter)', type: 'platform', platformId: 'twitter' },
  { id: 'reddit', name: 'Reddit', type: 'platform', platformId: 'reddit' },
  { id: 'linkedin', name: 'LinkedIn', type: 'platform', platformId: 'linkedin' },
  { id: 'instagram', name: 'Instagram', type: 'platform', platformId: 'instagram' },
  { id: 'youtube', name: 'YouTube', type: 'platform', platformId: 'youtube' },
  { id: 'web', name: 'Web Articles', type: 'platform', platformId: 'web' }
] as ComparisonOption[];

export const timeOptions: ComparisonOption[] = [
  { id: 'current-week', name: 'Current Week', type: 'time', startDate: '2023-01-01', endDate: '2023-01-07' },
  { id: 'last-week', name: 'Last Week', type: 'time', startDate: '2022-12-25', endDate: '2022-12-31' },
  { id: 'two-weeks-ago', name: 'Two Weeks Ago', type: 'time', startDate: '2022-12-18', endDate: '2022-12-24' },
  { id: 'this-month', name: 'This Month', type: 'time', startDate: '2023-01-01', endDate: '2023-01-31' },
  { id: 'last-month', name: 'Last Month', type: 'time', startDate: '2022-12-01', endDate: '2022-12-31' }
] as ComparisonOption[];

export const useComparisonData = (targetA: string, targetB: string) => {
  const fetchComparisonData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateMockComparisonData(targetA, targetB);
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['comparisonData', targetA, targetB],
    queryFn: fetchComparisonData
  });

  return { data, isLoading, error, refetch };
};
