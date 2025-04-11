
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Loader2 } from 'lucide-react';
import { PlatformIcon } from '@/components/icons/PlatformIcons';
import InsightCards from './InsightCards';
import InsightCharts from './InsightCharts';
import { InsightDataType, PlatformInsightType } from '@/types/insight';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface InsightTabsProps {
  data: InsightDataType | null;
  selectedPlatforms: string[];
}

const InsightTabs: React.FC<InsightTabsProps> = ({ data, selectedPlatforms }) => {
  // States
  const [activeTab, setActiveTab] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // If no platforms selected, default to twitter
  const platforms = selectedPlatforms.length > 0 ? selectedPlatforms : ['twitter'];
  
  // Set initial active tab if not set yet
  React.useEffect(() => {
    if (!activeTab && platforms.length > 0) {
      setActiveTab(platforms[0]);
    }
  }, [platforms, activeTab]);
  
  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  const showPromptPreview = () => {
    // For development purposes only - show what would be sent to the backend
    const previewData = {
      platforms: selectedPlatforms,
      timeRange: "7d",
      tones: ["professional", "concise"],
      agentPreset: "standard"
    };
    
    toast.info("Agent Prompt Preview", {
      description: <pre className="text-xs mt-2 p-2 bg-gray-100 rounded">
        {JSON.stringify(previewData, null, 2)}
      </pre>,
      duration: 10000,
    });
  };
  
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="relative">
        <ScrollArea className="w-full pb-4">
          <TabsList className="mb-8 flex w-max">
            {platforms.map(platform => (
              <TabsTrigger key={platform} value={platform} className="flex items-center gap-2">
                <PlatformIcon platform={platform} size={16} />
                <span className="capitalize">{getPlatformDisplayName(platform)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
        
        {/* Development mode preview button */}
        <div className="absolute right-0 top-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={showPromptPreview}
            className="text-xs text-muted-foreground"
          >
            View Prompt →
          </Button>
        </div>
      </div>
      
      {platforms.map(platform => (
        <TabsContent key={platform} value={platform}>
          {isLoading ? (
            <LoadingState />
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <InsightCards 
                  insights={getPlatformInsights(data, platform)} 
                  platform={platform}
                />
              </div>
              
              <InsightCharts 
                data={getPlatformChartData(data, platform)} 
              />
              
              {renderPlatformContent(data, platform)}
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

// Loading state component
const LoadingState = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {[1, 2, 3].map(i => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>
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

// Helper function to get platform display name
const getPlatformDisplayName = (platform: string): string => {
  const displayNames: Record<string, string> = {
    twitter: 'X (Twitter)',
    reddit: 'Reddit',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    youtube: 'YouTube',
    web: 'Web Articles'
  };
  
  return displayNames[platform] || platform;
};

// Helper function to get platform-specific insights
const getPlatformInsights = (data: InsightDataType | null, platform: string) => {
  if (!data || !data.insights) return [];
  return data.insights.filter(insight => insight.platform === platform);
};

// Helper function to get platform-specific chart data
const getPlatformChartData = (data: InsightDataType | null, platform: string) => {
  if (!data || !data.chartData) {
    return { sentiment: [], engagement: [] };
  }
  
  // Get platform-specific chart data if available
  const platformCharts = data.platformChartData?.[platform];
  if (platformCharts) {
    return platformCharts;
  }
  
  // Fall back to global chart data
  return data.chartData;
};

// Render platform-specific post content
const renderPlatformContent = (data: InsightDataType | null, platform: string) => {
  if (!data) return null;
  
  const platformData = data.platformData?.[platform];
  if (!platformData || platformData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No {getPlatformDisplayName(platform)} Data</CardTitle>
          <CardDescription>No posts or articles found for this platform.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Top Posts & Content</h3>
      {platformData.map((item, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{item.post_title || 'Untitled Post'}</span>
              {item.post_link && (
                <a 
                  href={item.post_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  <ExternalLink size={16} className="ml-1" />
                </a>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {item.content_lines.map((line, lineIndex) => (
                <p key={lineIndex} className="text-sm text-muted-foreground">
                  {line}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InsightTabs;
