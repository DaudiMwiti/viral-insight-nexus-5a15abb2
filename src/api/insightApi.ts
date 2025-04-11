
import { InsightParams, InsightDataType } from '@/types/insight';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const runInsightFlow = async (params: InsightParams): Promise<InsightDataType> => {
  try {
    console.log('Calling API endpoint:', `${API_BASE_URL}/run-flow`);
    console.log('Request parameters:', params);
    
    const response = await fetch(`${API_BASE_URL}/run-flow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platforms: params.platforms || ['twitter'],
        preset: params.preset || 'standard',
        tone: params.tone || 'professional',
        dateRange: params.date || '2025-04-01 to 2025-04-11'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      throw new Error(errorData.detail || 'Failed to run insight flow');
    }

    const responseData = await response.json();
    console.log('API Response Data:', responseData);
    
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
  console.log('Transforming API response...');
  const insights: Array<any> = [];
  const platformData: Record<string, any> = {};
  const platformChartData: Record<string, any> = {};
  
  // Process each platform's data
  for (const [platform, data] of Object.entries<any>(response.platforms)) {
    if (!data || !data.insights || !Array.isArray(data.insights)) {
      console.warn(`No valid insights data for platform: ${platform}`);
      continue;
    }
    
    const platformInsights = data.insights.map((insight: any) => ({
      id: Math.random().toString(36).substring(2, 11),
      title: insight.title || 'Untitled Insight',
      description: insight.summary || '',
      sentiment: (insight.sentiment || 'neutral').toLowerCase(),
      timestamp: insight.date ? new Date(insight.date).toISOString() : new Date().toISOString(),
      platform: platform
    }));
    
    // Add to combined insights array
    insights.push(...platformInsights);
    
    // Process platform-specific data - ensure it's an array
    platformData[platform] = [{
      post_title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Insights`,
      post_link: `https://${platform}.com/insights`,
      content_lines: platformInsights.map((i: any) => i.description)
    }];
    
    // Process chart data - ensure all required properties exist
    if (data.charts && data.charts.sentimentTrend && Array.isArray(data.charts.sentimentTrend) && data.charts.sentimentTrend.length > 0) {
      platformChartData[platform] = {
        sentiment: [
          { name: 'Positive', value: data.charts.sentimentTrend[0].positive || 0, color: '#10b981' },
          { name: 'Neutral', value: data.charts.sentimentTrend[0].neutral || 0, color: '#6b7280' },
          { name: 'Negative', value: data.charts.sentimentTrend[0].negative || 0, color: '#ef4444' },
        ],
        engagement: Array.isArray(data.charts.engagement) ? data.charts.engagement.map((item: any) => ({
          name: item.date ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3) : 'Day',
          value: item.value || 0
        })) : []
      };
    } else {
      platformChartData[platform] = {
        sentiment: [
          { name: 'Positive', value: 34, color: '#10b981' },
          { name: 'Neutral', value: 33, color: '#6b7280' },
          { name: 'Negative', value: 33, color: '#ef4444' },
        ],
        engagement: []
      };
    }
  }
  
  // Default chart data if no platforms are available
  const defaultChartData = {
    sentiment: [
      { name: 'Positive', value: 34, color: '#10b981' },
      { name: 'Neutral', value: 33, color: '#6b7280' },
      { name: 'Negative', value: 33, color: '#ef4444' },
    ],
    engagement: []
  };
  
  // Use the first platform's chart data or default if none available
  const firstPlatform = Object.keys(platformChartData)[0];
  const chartData = firstPlatform ? platformChartData[firstPlatform] : defaultChartData;
  
  // Create thread output
  const threadOutput = [{
    id: '1',
    title: 'Platform Analysis',
    content: [
      `🧵 Analysis of ${response.summary?.totalPosts || 0} posts across ${Object.keys(response.platforms || {}).length} platforms (1/5):`,
      `The dominant sentiment is ${response.summary?.dominantSentiment || 'Neutral'} with ${response.summary?.topPlatform || 'Twitter'} showing the most activity. (2/5)`,
      `Key trends show engagement patterns correlating with content type and timing. (3/5)`,
      `User discussions are centered around product features and industry developments. (4/5)`,
      `Recommendation: Focus content strategy on ${response.summary?.topPlatform || 'Twitter'} with ${(response.summary?.dominantSentiment || 'neutral').toLowerCase()} messaging. (5/5)`
    ],
    sentiment: (response.summary?.dominantSentiment || 'neutral').toLowerCase(),
    platform: Object.keys(response.platforms || {})[0] || 'twitter'
  }];
  
  console.log('Transformation complete');
  
  return {
    insights,
    threadOutput,
    chartData,
    rawData: {
      platform: Object.keys(response.platforms || {})[0] || 'twitter',
      query: "Analysis",
      results: insights.map((i: any) => ({ id: i.id, text: i.description, sentiment: i.sentiment }))
    },
    platformData,
    platformChartData
  };
};
