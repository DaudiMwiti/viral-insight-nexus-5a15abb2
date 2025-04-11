
export interface InsightType {
  id: string;
  title: string;
  description: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
  platform?: string;
}

export interface ThreadType {
  id: string;
  title: string;
  content: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  platform: string;
}

export interface ChartDataType {
  sentiment?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  engagement?: Array<{
    name: string;
    value: number;
  }>;
}

export interface PlatformInsightType {
  post_title: string;
  post_link: string;
  content_lines: string[];
}

export interface TrendDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface PlatformEngagementDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface InsightDataType {
  insights: InsightType[];
  threadOutput: ThreadType[];
  chartData: ChartDataType;
  rawData: any;
  platformData?: Record<string, PlatformInsightType[]>;
  platformChartData?: Record<string, ChartDataType>;
}

export interface InsightParams {
  platforms: string[];
  preset: string;
  tone: string;
  date: string;
}
