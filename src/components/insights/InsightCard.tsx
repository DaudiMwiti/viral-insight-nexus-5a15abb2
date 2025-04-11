
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InsightType } from '@/types/insight';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: InsightType;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, className }) => {
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

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{insight.title}</CardTitle>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full",
            getSentimentColor(insight.sentiment)
          )}>
            {insight.sentiment.charAt(0).toUpperCase() + insight.sentiment.slice(1)}
          </span>
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
