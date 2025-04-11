
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InsightType } from '@/types/insight';
import { cn } from '@/lib/utils';
import { EngagementFilter } from './InsightFilters';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface InsightCardProps {
  insight: InsightType;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, className }) => {
  // Function to determine engagement level based on some logic
  // This is a mock implementation since we don't have actual engagement metrics
  const getEngagementLevel = (insight: InsightType): EngagementFilter => {
    // In a real app, this would use actual engagement metrics
    // For demonstration, we'll randomly assign engagement levels based on the insight id
    const id = parseInt(insight.id) || 0;
    if (id % 3 === 0) return 'high';
    if (id % 3 === 1) return 'medium';
    return 'low';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400';
    }
  };

  // Add a data attribute for engagement level to make filtering easier
  return (
    <Card 
      className={cn("overflow-hidden", className)}
      data-engagement={getEngagementLevel(insight)}
      data-sentiment={insight.sentiment}
      data-date={insight.timestamp}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{insight.title}</CardTitle>
          <Badge className={cn(
            "rounded-full text-xs px-2 py-1",
            getSentimentColor(insight.sentiment)
          )}>
            {insight.sentiment.charAt(0).toUpperCase() + insight.sentiment.slice(1)}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {new Date(insight.timestamp).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{insight.description}</p>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
