
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Bookmark } from 'lucide-react';
import { PlatformIcon } from '@/components/icons/PlatformIcons';
import { InsightType } from '@/types/insight';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface InsightCardsProps {
  insights: InsightType[];
  platform?: string;
}

const InsightCards = ({ insights, platform }: InsightCardsProps) => {
  // Local state to track bookmarked insights
  const [bookmarkedInsights, setBookmarkedInsights] = useState<Set<string>>(new Set());
  
  // Toggle bookmark state for an insight
  const toggleBookmark = (id: string) => {
    setBookmarkedInsights(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(id)) {
        newBookmarks.delete(id);
      } else {
        newBookmarks.add(id);
      }
      return newBookmarks;
    });
  };

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
        return <TrendingUp className="h-5 w-5 text-insight-positive" aria-hidden="true" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-insight-negative" aria-hidden="true" />;
      default:
        return <Minus className="h-5 w-5 text-insight-neutral" aria-hidden="true" />;
    }
  };

  const getSentimentClass = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'negative':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'neutral':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };
  
  const getSentimentLabel = (sentiment: string) => {
    return `Sentiment: ${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}`;
  };

  return (
    <>
      {displayInsights.map((insight, index) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.1,
            ease: "easeOut" 
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <article 
                className={cn(
                  `overflow-hidden ${getSentimentClass(insight.sentiment)}`,
                  "relative transition-all duration-200 ease-in-out hover:shadow-lg hover:translate-y-[-2px]"
                )}
                tabIndex={0}
              >
                <Card className="border-0 bg-transparent">
                  <div 
                    className="absolute top-3 right-3 z-10 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(insight.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleBookmark(insight.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-pressed={bookmarkedInsights.has(insight.id)}
                    aria-label={bookmarkedInsights.has(insight.id) ? "Remove bookmark" : "Add bookmark"}
                  >
                    <Bookmark 
                      className={cn(
                        "h-5 w-5 transition-all duration-200",
                        bookmarkedInsights.has(insight.id) 
                          ? "fill-primary text-primary" 
                          : "text-muted-foreground hover:text-primary"
                      )}
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getSentimentIcon(insight.sentiment)}
                      <span>{insight.title}</span>
                      <span className="sr-only">{getSentimentLabel(insight.sentiment)}</span>
                    </CardTitle>
                    {platform && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <PlatformIcon platform={insight.platform || platform} size={12} className="mr-1" aria-hidden="true" />
                        <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              </article>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-3 max-w-xs">
              <div className="space-y-1">
                <p className="font-medium text-sm">
                  Source: {insight.platform || platform}
                </p>
                <p className="text-xs text-muted-foreground">
                  Confidence: {Math.floor(70 + Math.random() * 30)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Generated: {new Date(insight.timestamp).toLocaleString()}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      ))}
    </>
  );
};

export default InsightCards;
