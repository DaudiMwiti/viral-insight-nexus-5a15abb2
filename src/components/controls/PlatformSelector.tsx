
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TwitterIcon, RedditIcon, GlobeIcon } from '@/components/icons/PlatformIcons';

const platforms = [
  { id: 'twitter', name: 'X (Twitter)', icon: <TwitterIcon className="h-4 w-4" /> },
  { id: 'reddit', name: 'Reddit', icon: <RedditIcon className="h-4 w-4" /> },
  { id: 'web', name: 'Web Articles', icon: <GlobeIcon className="h-4 w-4" /> }
];

const PlatformSelector = () => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Platform</label>
      <Select defaultValue="twitter">
        <SelectTrigger>
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          {platforms.map(platform => (
            <SelectItem key={platform.id} value={platform.id} className="flex items-center">
              <div className="flex items-center gap-2">
                {platform.icon}
                <span>{platform.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PlatformSelector;
