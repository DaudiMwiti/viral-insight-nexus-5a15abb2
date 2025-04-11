
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TopicItem } from '@/types/comparison';
import { cn } from '@/lib/utils';

interface TopicsComparisonProps {
  titleA: string;
  titleB: string;
  topicsA: TopicItem[];
  topicsB: TopicItem[];
  className?: string;
}

const TopicsComparison: React.FC<TopicsComparisonProps> = ({
  titleA,
  titleB,
  topicsA,
  topicsB,
  className
}) => {
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

  const renderTopicsList = (topics: TopicItem[]) => (
    <div className="space-y-3">
      {topics.map((topic, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{topic.topic}</span>
            <Badge className={cn(
              "text-xs",
              getSentimentColor(topic.sentiment)
            )}>
              {topic.sentiment}
            </Badge>
          </div>
          <span className="text-sm font-medium">{topic.volume}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Top Discussed Topics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-3">{titleA}</h4>
            {renderTopicsList(topicsA)}
          </div>
          <div>
            <h4 className="text-sm font-medium mb-3">{titleB}</h4>
            {renderTopicsList(topicsB)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicsComparison;
