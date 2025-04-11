
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import PlatformTabs from './PlatformTabs';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlatformDisplayName } from '@/lib/platformUtils';
import PromptPreview from '@/components/controls/PromptPreview';
import { InsightDataType } from '@/types/insight';
import InsightCharts from './InsightCharts';
import DashboardCharts from './DashboardCharts';
import PlatformSection from '../insights/PlatformSection';
import InsightFilters, { 
  SentimentFilter, 
  EngagementFilter, 
  DateRangeFilter 
} from '../insights/InsightFilters';

interface InsightTabsProps {
  data: InsightDataType | null;
  selectedPlatforms: string[];
}

const InsightTabs: React.FC<InsightTabsProps> = ({ data, selectedPlatforms }) => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Filter state
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>('all');
  const [engagementFilter, setEngagementFilter] = useState<EngagementFilter>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>({
    startDate: undefined,
    endDate: undefined
  });
  
  const platforms = selectedPlatforms.length > 0 ? selectedPlatforms : ['twitter'];
  
  useEffect(() => {
    if (!activeTab && platforms.length > 0) {
      setActiveTab(platforms[0]);
    }
  }, [platforms, activeTab]);
  
  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Check if any filters are active
  const isFiltersActive = 
    sentimentFilter !== 'all' || 
    engagementFilter !== 'all' || 
    dateRangeFilter.startDate !== undefined;

  // Function to clear all filters
  const handleClearFilters = () => {
    setSentimentFilter('all');
    setEngagementFilter('all');
    setDateRangeFilter({ startDate: undefined, endDate: undefined });
  };

  // Apply filters to insights
  const getFilteredInsights = (platform: string) => {
    const insights = getPlatformInsights(data, platform);
    
    return insights.filter(insight => {
      // Filter by sentiment
      if (sentimentFilter !== 'all' && insight.sentiment !== sentimentFilter) {
        return false;
      }
      
      // Filter by engagement level (using a mock implementation)
      if (engagementFilter !== 'all') {
        const engagementLevel = getEngagementLevel(insight);
        if (engagementLevel !== engagementFilter) {
          return false;
        }
      }
      
      // Filter by date range
      if (dateRangeFilter.startDate) {
        const insightDate = new Date(insight.timestamp);
        if (dateRangeFilter.endDate) {
          // If both start and end dates are set, check if the insight date is within the range
          return insightDate >= dateRangeFilter.startDate && insightDate <= dateRangeFilter.endDate;
        } else {
          // If only start date is set, check if the insight date is on or after the start date
          return insightDate >= dateRangeFilter.startDate;
        }
      }
      
      return true;
    });
  };

  // Mock function to determine engagement level based on insight id
  const getEngagementLevel = (insight: any): EngagementFilter => {
    const id = parseInt(insight.id) || 0;
    if (id % 3 === 0) return 'high';
    if (id % 3 === 1) return 'medium';
    return 'low';
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="relative">
        <PlatformTabs 
          platforms={platforms}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <div className="mt-4 space-y-4">
          <InsightFilters
            sentimentFilter={sentimentFilter}
            engagementFilter={engagementFilter}
            dateRangeFilter={dateRangeFilter}
            onSentimentChange={setSentimentFilter}
            onEngagementChange={setEngagementFilter}
            onDateRangeChange={setDateRangeFilter}
            onClearFilters={handleClearFilters}
            isFiltersActive={isFiltersActive}
          />
          
          <PromptPreview
            platforms={selectedPlatforms}
            preset="standard"
            tone="professional"
          />
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {platforms.map(platform => (
          activeTab === platform && (
            <motion.div
              key={platform}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value={platform} forceMount>
                {isLoading ? (
                  <LoadingState />
                ) : (
                  <div className="space-y-8">
                    <PlatformSection 
                      platform={platform}
                      insights={getFilteredInsights(platform)}
                      platformData={data?.platformData?.[platform]}
                    />
                    
                    {/* Legacy charts - can be replaced or kept as basic overview */}
                    <InsightCharts 
                      data={getPlatformChartData(data, platform)} 
                    />
                    
                    {/* New enhanced charts */}
                    <DashboardCharts 
                      data={data} 
                      platform={platform}
                    />
                  </div>
                )}
              </TabsContent>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </Tabs>
  );
};

const LoadingState = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="h-[180px] w-full rounded-md" />
      ))}
    </div>
    
    <div className="space-y-4">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 gap-4">
        <Skeleton className="h-[200px] w-full rounded-md" />
        <Skeleton className="h-[200px] w-full rounded-md" />
      </div>
    </div>
  </div>
);

const getPlatformInsights = (data: InsightDataType | null, platform: string) => {
  if (!data || !data.insights) return [];
  return data.insights.filter(insight => insight.platform === platform);
};

const getPlatformChartData = (data: InsightDataType | null, platform: string) => {
  if (!data || !data.chartData) {
    return { sentiment: [], engagement: [] };
  }
  
  const platformCharts = data.platformChartData?.[platform];
  if (platformCharts) {
    return platformCharts;
  }
  
  return data.chartData;
};

export default InsightTabs;
