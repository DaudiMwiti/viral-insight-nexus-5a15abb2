
import { InsightParams, InsightDataType } from '@/types/insight';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const runInsightFlow = async (params: InsightParams): Promise<InsightDataType> => {
  try {
    const response = await fetch(`${API_BASE_URL}/run-flow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platforms: params.platforms || ['twitter'],
        preset: params.preset || 'standard',
        tone: params.tone || 'professional',
        dateRange: params.dateRange || '2025-04-01 to 2025-04-11'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to run insight flow');
    }

    const responseData = await response.json();
    
    // Transform the FastAPI response format to match the frontend's expected format
    return transformResponseToFrontendFormat(responseData);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Transform the FastAPI response to match the frontend's expected InsightDataType format
 */
const transformResponseToFrontendFormat = (response: any): InsightDataType => {
  const insights = [];
  const platformData: Record<string, any> = {};
  const platformChartData: Record<string, any> = {};
  
  // Process each platform's data
  for (const [platform, data] of Object.entries(response.platforms)) {
    const platformInsights = data.insights.map((insight: any) => ({
      id: Math.random().toString(36).substring(2, 11),
      title: insight.title,
      description: insight.summary,
      sentiment: insight.sentiment.toLowerCase(),
      timestamp: new Date(insight.date).toISOString(),
      platform: platform
    }));
    
    // Add to combined insights array
    insights.push(...platformInsights);
    
    // Process platform-specific data
    platformData[platform] = {
      post_title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Insights`,
      post_link: `https://${platform}.com/insights`,
      content_lines: platformInsights.map(i => i.description)
    };
    
    // Process chart data
    platformChartData[platform] = {
      sentiment: [
        { name: 'Positive', value: data.charts.sentimentTrend[0].positive, color: '#10b981' },
        { name: 'Neutral', value: data.charts.sentimentTrend[0].neutral, color: '#6b7280' },
        { name: 'Negative', value: data.charts.sentimentTrend[0].negative, color: '#ef4444' },
      ],
      engagement: data.charts.engagement.map((item: any) => ({
        name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3),
        value: item.value
      }))
    };
  }
  
  // Create the combined chart data
  const chartData = {
    sentiment: [
      { name: 'Positive', value: response.summary.dominantSentiment === 'Positive' ? 65 : 35, color: '#10b981' },
      { name: 'Neutral', value: response.summary.dominantSentiment === 'Neutral' ? 65 : 25, color: '#6b7280' },
      { name: 'Negative', value: response.summary.dominantSentiment === 'Negative' ? 65 : 10, color: '#ef4444' },
    ],
    engagement: platformChartData[Object.keys(platformChartData)[0]]?.engagement || []
  };
  
  // Create thread output
  const threadOutput = [{
    id: '1',
    title: 'Platform Analysis',
    content: [
      `🧵 Analysis of ${response.summary.totalPosts} posts across ${Object.keys(response.platforms).length} platforms (1/5):`,
      `The dominant sentiment is ${response.summary.dominantSentiment} with ${response.summary.topPlatform} showing the most activity. (2/5)`,
      `Key trends show engagement patterns correlating with content type and timing. (3/5)`,
      `User discussions are centered around product features and industry developments. (4/5)`,
      `Recommendation: Focus content strategy on ${response.summary.topPlatform} with ${response.summary.dominantSentiment.toLowerCase()} messaging. (5/5)`
    ],
    sentiment: response.summary.dominantSentiment.toLowerCase(),
    platform: Object.keys(response.platforms)[0]
  }];
  
  return {
    insights,
    threadOutput,
    chartData,
    rawData: {
      platform: Object.keys(response.platforms)[0],
      query: "Analysis",
      results: insights.map(i => ({ id: i.id, text: i.description, sentiment: i.sentiment }))
    },
    platformData,
    platformChartData
  };
};
