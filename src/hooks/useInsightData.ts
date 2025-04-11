
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InsightDataType, InsightParams } from '@/types/insight';
import { runInsightFlow } from '@/api/insightApi';
import { toast } from 'sonner';

// Function to generate a random new insight for simulation
const generateRandomInsight = (): InsightDataType['insights'][0] => {
  const platforms = ['twitter', 'reddit', 'linkedin', 'instagram', 'youtube', 'web'];
  const sentiments: Array<'positive' | 'neutral' | 'negative'> = ['positive', 'neutral', 'negative'];
  const titles = [
    'Trending Topic Discovered',
    'Customer Sentiment Shift',
    'Viral Post Detected',
    'Engagement Pattern Change',
    'User Feedback Cluster'
  ];
  const descriptions = [
    'A new trending topic has emerged around your brand with significant engagement.',
    'There has been a notable shift in customer sentiment regarding your latest feature.',
    'One of your posts is gaining viral traction across social networks.',
    'We\'ve detected an unusual pattern in user engagement with your content.',
    'Multiple users are providing similar feedback about your recent update.'
  ];

  return {
    id: Date.now().toString(),
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    timestamp: new Date().toISOString(),
    platform: platforms[Math.floor(Math.random() * platforms.length)]
  };
};

export const useInsightData = (realtimeEnabled = true, pollingInterval = 30000) => {
  const [hasNewInsights, setHasNewInsights] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Create params for API call
  const params: InsightParams = {
    platforms: ['twitter', 'reddit', 'linkedin', 'instagram', 'youtube', 'web'],
    preset: 'standard',
    tone: 'professional',
    date: '2025-04-01 to 2025-04-11'
  };

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['insightData'],
    queryFn: () => runInsightFlow(params), // Use the actual API call instead of mock data
    refetchInterval: realtimeEnabled ? pollingInterval : false,
    meta: {
      onSuccess: (newData: InsightDataType) => {
        if (data) {
          console.log('Successfully fetched new data from API');
          // In a real implementation, we would compare the new data with the existing data
          // For simulation, we'll just add a new random insight every poll if realtime is enabled
          if (realtimeEnabled) {
            const currentTime = new Date();
            const timeDiff = currentTime.getTime() - lastUpdate.getTime();
            
            // Only show notification if it's not the initial load and enough time has passed
            if (timeDiff > pollingInterval * 0.9) {
              setHasNewInsights(true);
              toast.info("🔄 New insights available", {
                description: "Fresh data has been detected",
                action: {
                  label: "View",
                  onClick: () => setHasNewInsights(false)
                }
              });
              setLastUpdate(currentTime);
            }
          }
        }
      }
    }
  });

  // Function to add a simulated new insight to the current data
  const addSimulatedInsight = () => {
    if (data) {
      const newInsight = generateRandomInsight();
      return {
        ...data,
        insights: [newInsight, ...data.insights]
      };
    }
    return data;
  };

  // This will hold our potentially augmented data (with new insights added)
  const [displayData, setDisplayData] = useState<InsightDataType | null>(data);

  // Update display data when base data changes
  useEffect(() => {
    setDisplayData(data);
  }, [data]);

  // Simulate a new insight when hasNewInsights is true
  useEffect(() => {
    if (hasNewInsights && data) {
      setDisplayData(addSimulatedInsight());
      setHasNewInsights(false);
    }
  }, [hasNewInsights, data]);

  // Set up a callback effect for new data
  useEffect(() => {
    if (data && realtimeEnabled) {
      const currentTime = new Date();
      const timeDiff = currentTime.getTime() - lastUpdate.getTime();
      
      // Only show notification if it's not the initial load and enough time has passed
      if (timeDiff > pollingInterval * 0.9) {
        setHasNewInsights(true);
        toast.info("🔄 New insights available", {
          description: "Fresh data has been detected",
          action: {
            label: "View",
            onClick: () => setHasNewInsights(false)
          }
        });
        setLastUpdate(currentTime);
      }
    }
  }, [data, realtimeEnabled, lastUpdate, pollingInterval]);

  return { 
    data: displayData, 
    isLoading, 
    error, 
    refetch,
    hasNewInsights,
    setRealtimeEnabled: (enabled: boolean) => {
      // This doesn't actually change the query config directly,
      // but the component using this hook can track the state and pass it back
      if (enabled !== realtimeEnabled) {
        refetch();
      }
    }
  };
};
