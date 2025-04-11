
export interface InsightType {
  id: string;
  title: string;
  description: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
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

export interface InsightDataType {
  insights: InsightType[];
  threadOutput: ThreadType[];
  chartData: ChartDataType;
  rawData: any;
}

export interface InsightParams {
  platform: string;
  preset: string;
  tone: string;
  date: string;
}
