
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PlatformIcon } from '@/components/icons/PlatformIcons';
import { InsightType } from '@/types/insight';

interface InsightCardsProps {
  insights: InsightType[];
  platform?: string;
}

const InsightCards = ({ insights, platform }: InsightCardsProps) => {
  // If no insights are passed, render demo insights
  const displayInsights = insights.length > 0 ? insights : [
    {
      id: '1',
      title: 'User Engagement Spike',
      description: 'There was a significant increase in engagement around the topic of AI and automation yesterday, with most reactions being positive.',
      sentiment: 'positive',
      timestamp: new Date().toISOString(),
      platform: platform || 'twitter'
    },
    {
      id: '2',
      title: 'New Feature Discussion',
      description: 'Users are actively discussing the new voice note feature with mixed reactions. Privacy concerns are the main point of contention.',
      sentiment: 'neutral',
      timestamp: new Date().toISOString(),
      platform: platform || 'twitter'
    },
    {
      id: '3',
      title: 'Service Outage Feedback',
      description: 'Negative sentiment detected regarding yesterday\'s service outage. Users reported inability to access their accounts for approximately 2 hours.',
      sentiment: 'negative',
      timestamp: new Date().toISOString(),
      platform: platform || 'twitter'
    }
  ];

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-insight-positive" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-insight-negative" />;
      default:
        return <Minus className="h-5 w-5 text-insight-neutral" />;
    }
  };

  return (
    <>
      {displayInsights.map(insight => (
        <Card key={insight.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              {getSentimentIcon(insight.sentiment)}
              <span>{insight.title}</span>
            </CardTitle>
            {platform && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <PlatformIcon platform={insight.platform || platform} size={12} className="mr-1" />
                <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{insight.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default InsightCards;
