
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart2, TrendingUp, Award } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { InsightDataType } from '@/types/insight';
import { getPlatformDisplayName } from '@/lib/platformUtils';
import ExportDropdown from './ExportDropdown';

interface DashboardHeaderProps {
  data: InsightDataType | null;
  isLoading: boolean;
  onRefresh: () => void;
  insightsRef: React.RefObject<HTMLDivElement>;
  chartsRef: React.RefObject<HTMLDivElement>;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  data,
  isLoading,
  onRefresh,
  insightsRef,
  chartsRef,
  dateRange = {
    start: new Date(),
    end: new Date()
  }
}) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate total posts
  const totalPosts = data?.insights?.length || 0;
  
  // Calculate dominant sentiment
  const getSentimentCounts = () => {
    if (!data?.insights) return { positive: 0, neutral: 0, negative: 0 };
    
    return data.insights.reduce((acc, insight) => {
      acc[insight.sentiment] = (acc[insight.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };
  
  const sentimentCounts = getSentimentCounts();
  const dominantSentiment = Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  
  // Calculate top platform
  const getPlatformCounts = () => {
    if (!data?.insights) return {};
    
    return data.insights.reduce((acc, insight) => {
      if (insight.platform) {
        acc[insight.platform] = (acc[insight.platform] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  };
  
  const platformCounts = getPlatformCounts();
  const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'twitter';
  
  // Format date range for display
  const formattedDateRange = dateRange 
    ? `${format(dateRange.start, 'MMM d')} – ${format(dateRange.end, 'MMM d, yyyy')}`
    : 'Current Period';

  // Handle refresh click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Format the sentiment for display
  const formatSentiment = (sentiment: string) => {
    return sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
  };

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Insights Dashboard</h1>
          <p className="text-muted-foreground mt-1">{formattedDateRange}</p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <p className="text-sm text-muted-foreground">
            Last updated: {format(lastUpdated, 'MMM d, h:mm a')}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            aria-label={isRefreshing ? "Refreshing data..." : "Refresh data"}
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="mr-2"
              aria-hidden="true"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            Refresh
          </Button>
          
          <ExportDropdown insightsRef={insightsRef} chartsRef={chartsRef} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="region" aria-label="Dashboard metrics">
        {/* Total Posts Card */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium leading-none tracking-tight text-muted-foreground" id="total-posts-heading">
                Total Posts Analyzed
              </h3>
              <BarChart2 className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="text-3xl font-bold mt-2" aria-labelledby="total-posts-heading">{totalPosts}</div>
          </CardContent>
        </Card>

        {/* Dominant Sentiment Card */}
        <Card className={cn(
          "overflow-hidden hover:shadow-md transition-shadow",
          dominantSentiment === 'positive' && "border-l-4 border-l-green-500",
          dominantSentiment === 'negative' && "border-l-4 border-l-red-500",
          dominantSentiment === 'neutral' && "border-l-4 border-l-blue-500"
        )}>
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium leading-none tracking-tight text-muted-foreground" id="dominant-sentiment-heading">
                Dominant Sentiment
              </h3>
              <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="text-3xl font-bold mt-2" aria-labelledby="dominant-sentiment-heading">
              {formatSentiment(dominantSentiment)}
            </div>
          </CardContent>
        </Card>

        {/* Top Platform Card */}
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium leading-none tracking-tight text-muted-foreground" id="top-platform-heading">
                Top Platform
              </h3>
              <Award className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="text-3xl font-bold mt-2" aria-labelledby="top-platform-heading">
              {getPlatformDisplayName(topPlatform)}
            </div>
          </CardContent>
        </Card>
      </div>
    </header>
  );
};

export default DashboardHeader;
