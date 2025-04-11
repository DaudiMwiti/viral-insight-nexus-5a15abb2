
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InsightDataType } from '@/types/insight';
import { runInsightFlow } from '@/api/insightApi';
import { toast } from 'sonner';

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
        platform: 'twitter'
      },
      {
        id: '2',
        title: 'New Feature Discussion',
        description: 'Users are actively discussing the new voice note feature with mixed reactions. Privacy concerns are the main point of contention.',
        sentiment: 'neutral',
        timestamp: new Date().toISOString(),
        platform: 'twitter'
      },
      {
        id: '3',
        title: 'Service Outage Feedback',
        description: 'Negative sentiment detected regarding yesterday\'s service outage. Users reported inability to access their accounts for approximately 2 hours.',
        sentiment: 'negative',
        timestamp: new Date().toISOString(),
        platform: 'twitter'
      },
      {
        id: '4',
        title: 'Viral Reddit Thread',
        description: 'A thread about your product reached the front page of r/technology with mostly positive comments about the user experience.',
        sentiment: 'positive',
        timestamp: new Date().toISOString(),
        platform: 'reddit'
      },
      {
        id: '5',
        title: 'LinkedIn Engagement',
        description: 'Your recent company update is gaining significant traction among industry professionals, with many highlighting your innovation approach.',
        sentiment: 'positive',
        timestamp: new Date().toISOString(),
        platform: 'linkedin'
      },
      {
        id: '6',
        title: 'Instagram Campaign Performance',
        description: 'The latest visual campaign is resonating well with younger demographics, showing 30% higher engagement than previous campaigns.',
        sentiment: 'positive',
        timestamp: new Date().toISOString(),
        platform: 'instagram'
      },
      {
        id: '7',
        title: 'YouTube Tutorial Feedback',
        description: 'Users are requesting more in-depth tutorials on advanced features. Several comments mention confusion about the new interface.',
        sentiment: 'neutral',
        timestamp: new Date().toISOString(),
        platform: 'youtube'
      },
      {
        id: '8',
        title: 'Blog Mention Analysis',
        description: 'Several tech blogs covered your recent product launch, with mixed sentiments about pricing but positive feedback on features.',
        sentiment: 'neutral',
        timestamp: new Date().toISOString(),
        platform: 'web'
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
    },
    platformData: {
      twitter: [
        {
          post_title: "Viral AI Discussion",
          post_link: "https://twitter.com/user/status/123456789",
          content_lines: [
            "Just had my mind blown by the new AI capabilities announced today.",
            "The ability to generate realistic videos from text prompts will change content creation forever.",
            "Curious how this will impact the job market for visual artists and videographers."
          ]
        },
        {
          post_title: "Product Launch Reaction",
          post_link: "https://twitter.com/user/status/987654321",
          content_lines: [
            "The new product launch seems to be getting mostly positive reactions.",
            "Many users are particularly excited about the AI-powered features.",
            "Some concerns about pricing, but overall sentiment is positive."
          ]
        }
      ],
      reddit: [
        {
          post_title: "r/Technology Discussion Thread",
          post_link: "https://reddit.com/r/technology/comments/abc123",
          content_lines: [
            "The most upvoted comments praise the intuitive user interface.",
            "Several users shared how the product solved long-standing problems they had.",
            "There's a growing thread about potential privacy implications that might need addressing."
          ]
        }
      ],
      linkedin: [
        {
          post_title: "Industry Analysis Post",
          post_link: "https://linkedin.com/posts/user_123456",
          content_lines: [
            "Your company is being positioned as an industry leader in the latest market report.",
            "Several industry experts have commented positively on your innovation approach.",
            "Competitors are being compared unfavorably to your technology stack."
          ]
        }
      ],
      instagram: [
        {
          post_title: "Visual Campaign Highlights",
          post_link: "https://instagram.com/p/abc123",
          content_lines: [
            "The latest visual campaign has resonated particularly well with users aged 18-24.",
            "Engagement metrics show 30% higher interaction than previous campaigns.",
            "Color scheme and minimalist design approach received specific praise in comments."
          ]
        }
      ],
      youtube: [
        {
          post_title: "Product Tutorial Response",
          post_link: "https://youtube.com/watch?v=abc123",
          content_lines: [
            "Users are requesting more in-depth tutorials on advanced features.",
            "Several comments mention confusion about the new interface layout.",
            "The tutorial section on AI capabilities received the most positive feedback."
          ]
        }
      ],
      web: [
        {
          post_title: "TechCrunch Article Analysis",
          post_link: "https://techcrunch.com/2023/article-title",
          content_lines: [
            "The article positions your product as a 'game-changer' in the industry.",
            "Comparison with competitors shows favorable performance metrics.",
            "The journalist questioned the sustainability of the pricing model."
          ]
        },
        {
          post_title: "Blog Review Sentiment",
          post_link: "https://techblog.com/review/product",
          content_lines: [
            "The review highlights ease of use as the primary advantage.",
            "Performance benchmarks showed 40% improvement over the industry average.",
            "Some concerns were raised about enterprise scalability."
          ]
        }
      ]
    },
    platformChartData: {
      twitter: {
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
      reddit: {
        sentiment: [
          { name: 'Positive', value: 70, color: '#10b981' },
          { name: 'Neutral', value: 20, color: '#6b7280' },
          { name: 'Negative', value: 10, color: '#ef4444' },
        ],
        engagement: [
          { name: 'Mon', value: 120 },
          { name: 'Tue', value: 150 },
          { name: 'Wed', value: 200 },
          { name: 'Thu', value: 180 },
          { name: 'Fri', value: 250 },
          { name: 'Sat', value: 280 },
          { name: 'Sun', value: 190 },
        ]
      },
      linkedin: {
        sentiment: [
          { name: 'Positive', value: 80, color: '#10b981' },
          { name: 'Neutral', value: 15, color: '#6b7280' },
          { name: 'Negative', value: 5, color: '#ef4444' },
        ],
        engagement: [
          { name: 'Mon', value: 100 },
          { name: 'Tue', value: 120 },
          { name: 'Wed', value: 130 },
          { name: 'Thu', value: 110 },
          { name: 'Fri', value: 150 },
          { name: 'Sat', value: 80 },
          { name: 'Sun', value: 70 },
        ]
      }
    }
  };
};

// Function to generate a random new insight for simulation
const generateRandomInsight = (): InsightDataType['insights'][0] => {
  const platforms = ['twitter', 'reddit', 'linkedin', 'instagram', 'youtube', 'web'];
  const sentiments = ['positive', 'neutral', 'negative'];
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

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['insightData'],
    queryFn: fetchInsightData,
    refetchInterval: realtimeEnabled ? pollingInterval : false,
    onSuccess: (newData) => {
      if (data) {
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
