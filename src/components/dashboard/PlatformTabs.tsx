
import React from 'react';
import { PlatformIcon } from '@/components/icons/PlatformIcons';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface PlatformTabsProps {
  platforms: string[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const PlatformTabs: React.FC<PlatformTabsProps> = ({ 
  platforms, 
  activeTab, 
  onTabChange 
}) => {
  const handleTabClick = (platform: string) => {
    onTabChange(platform);
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

  return (
    <div className="relative mb-8">
      <ScrollArea className="w-full pb-4">
        <div className="flex w-max gap-2 p-1 bg-muted/80 rounded-full">
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => handleTabClick(platform)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 relative",
                "outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                "text-sm font-medium",
                activeTab === platform 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <PlatformIcon platform={platform} size={16} />
              <span className="capitalize">{getPlatformDisplayName(platform)}</span>
              
              {activeTab === platform && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-background shadow-sm rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlatformTabs;
