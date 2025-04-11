
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { PlatformIcon } from '@/components/icons/PlatformIcons';
import InsightCards from './InsightCards';
import InsightCharts from './InsightCharts';
import { InsightDataType, PlatformInsightType } from '@/types/insight';

interface InsightTabsProps {
  data: InsightDataType | null;
  selectedPlatforms: string[];
}

const InsightTabs: React.FC<InsightTabsProps> = ({ data, selectedPlatforms }) => {
  // If no platforms selected, default to twitter
  const platforms = selectedPlatforms.length > 0 ? selectedPlatforms : ['twitter'];
  
  return (
    <Tabs defaultValue={platforms[0]} className="w-full">
      <TabsList className="mb-8 flex flex-wrap">
        {platforms.map(platform => (
          <TabsTrigger key={platform} value={platform} className="flex items-center gap-2">
            <PlatformIcon platform={platform} size={16} />
            <span className="capitalize">{getPlatformDisplayName(platform)}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {platforms.map(platform => (
        <TabsContent key={platform} value={platform}>
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
        </TabsContent>
      ))}
    </Tabs>
  );
};

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
