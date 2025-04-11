
import { useState, useEffect } from 'react';
import { InsightDataType } from '@/types/insight';

// Mock API call for demonstration purposes
const fetchInsightData = async (): Promise<InsightDataType> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    insights: [
      {
        id: '1',
        title: 'User Engagement Spike',
        description: 'There was a significant increase in engagement around the topic of AI and automation yesterday, with most reactions being positive.',
        sentiment: 'positive',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'New Feature Discussion',
        description: 'Users are actively discussing the new voice note feature with mixed reactions. Privacy concerns are the main point of contention.',
        sentiment: 'neutral',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Service Outage Feedback',
        description: 'Negative sentiment detected regarding yesterday\'s service outage. Users reported inability to access their accounts for approximately 2 hours.',
        sentiment: 'negative',
        timestamp: new Date().toISOString(),
      }
    ],
    threadOutput: [
      {
        id: '1',
        title: 'AI Impact Analysis',
        content: [
          "🧵 Just analyzed the latest AI trends and here's what's happening (1/5):",
          "The rise of AI in creative fields is accelerating. Artists and writers are finding ways to collaborate with AI rather than compete. This is creating a new paradigm for creative production. (2/5)",
          "Key insight: Companies integrating AI thoughtfully see 3x productivity gains compared to those rushing implementation without proper training. (3/5)",
          "The most successful AI implementations focus on augmentation, not replacement. Teams working alongside AI report higher job satisfaction and better outcomes. (4/5)",
          "Prediction: Within 18 months, we'll see AI-human collaborative tools become the standard across creative industries, with new job categories emerging specifically for this partnership. (5/5)"
        ],
        sentiment: 'positive',
        platform: 'twitter'
      }
    ],
    chartData: {
      sentiment: [
        { name: 'Positive', value: 65, color: '#10b981' },
        { name: 'Neutral', value: 25, color: '#6b7280' },
        { name: 'Negative', value: 10, color: '#ef4444' },
      ],
      engagement: [
        { name: 'Mon', value: 240 },
        { name: 'Tue', value: 300 },
        { name: 'Wed', value: 320 },
        { name: 'Thu', value: 280 },
        { name: 'Fri', value: 450 },
        { name: 'Sat', value: 380 },
        { name: 'Sun', value: 290 },
      ]
    },
    rawData: {
      platform: "twitter",
      query: "AI technology",
      results: [
        { id: "tweet1", text: "Just saw the latest AI demo and it's mind-blowing! #AI #Technology", sentiment: "positive" },
        { id: "tweet2", text: "AI will revolutionize how we work, but we need proper regulations.", sentiment: "neutral" },
        { id: "tweet3", text: "Worried about AI taking over jobs in my industry. Not looking good.", sentiment: "negative" },
      ]
    }
  };
};

export const useInsightData = () => {
  const [data, setData] = useState<InsightDataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchInsightData();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, isLoading, error };
};
