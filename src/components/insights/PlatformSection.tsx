
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import InsightCard from './InsightCard';
import { InsightType, PlatformInsightType } from '@/types/insight';
import { getPlatformDisplayName } from '@/lib/platformUtils';

interface PlatformSectionProps {
  platform: string;
  insights: InsightType[];
  platformData?: PlatformInsightType[];
  className?: string;
}

const PlatformSection: React.FC<PlatformSectionProps> = ({ 
  platform, 
  insights, 
  platformData,
  className 
}) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {insights.map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
      
      {renderPlatformContent(platform, platformData)}
    </div>
  );
};

const renderPlatformContent = (platform: string, platformData?: PlatformInsightType[]) => {
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

export default PlatformSection;
