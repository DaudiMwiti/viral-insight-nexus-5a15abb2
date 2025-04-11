
import { TrendDataPoint } from './insight';

export type ComparisonTarget = 'platform' | 'time';

export interface ComparisonOption {
  id: string;
  name: string;
  type: ComparisonTarget;
}

export interface PlatformComparisonOption extends ComparisonOption {
  type: 'platform';
  platformId: string;
}

export interface TimeComparisonOption extends ComparisonOption {
  type: 'time';
  startDate: string;
  endDate: string;
}

export interface TopicItem {
  topic: string;
  volume: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface MetricSummary {
  current: number;
  previous: number;
  percentChange: number;
  isPositive: boolean;
}

export interface ComparisonData {
  sentiment: MetricSummary;
  volume: MetricSummary;
  engagement: MetricSummary;
  topTopics: {
    targetA: TopicItem[];
    targetB: TopicItem[];
  };
  trendData: {
    targetA: TrendDataPoint[];
    targetB: TrendDataPoint[];
  };
}

export interface ComparisonViewProps {
  data?: ComparisonData;
  targetOptions: ComparisonOption[];
  onComparisonChange?: (targetA: string, targetB: string) => void;
  isLoading?: boolean;
}
