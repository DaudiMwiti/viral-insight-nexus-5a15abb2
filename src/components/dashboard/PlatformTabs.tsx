
import React from 'react';
import { PlatformIcon } from '@/components/icons/PlatformIcons';
import { cn } from '@/lib/utils';
import { getPlatformDisplayName } from '@/lib/platformUtils';
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

  const handleKeyDown = (e: React.KeyboardEvent, platform: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabChange(platform);
    }
  };

  return (
    <div className="relative mb-8" role="tablist" aria-label="Social platforms">
      <ScrollArea className="w-full pb-4">
        <div className="flex w-max gap-2 p-1 bg-muted/80 rounded-full">
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => handleTabClick(platform)}
              onKeyDown={(e) => handleKeyDown(e, platform)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 relative",
                "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                "text-sm font-medium",
                activeTab === platform 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              role="tab"
              aria-selected={activeTab === platform}
              aria-controls={`${platform}-tab-content`}
              id={`${platform}-tab`}
              tabIndex={activeTab === platform ? 0 : -1}
            >
              <PlatformIcon platform={platform} size={16} aria-hidden="true" />
              <span>{getPlatformDisplayName(platform)}</span>
              
              {activeTab === platform && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-background shadow-sm rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
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
