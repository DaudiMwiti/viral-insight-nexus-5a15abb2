
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { PlatformIcon } from '@/components/icons/PlatformIcons';

const platforms = [
  { id: 'twitter', name: 'X (Twitter)' },
  { id: 'reddit', name: 'Reddit' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'web', name: 'Web Articles' }
];

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ 
  selectedPlatforms, 
  onPlatformsChange 
}) => {
  const handlePlatformToggle = (platformId: string) => {
    const newSelection = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    
    onPlatformsChange(newSelection);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Platforms</label>
      <div className="space-y-2">
        {platforms.map(platform => (
          <div key={platform.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`platform-${platform.id}`} 
              checked={selectedPlatforms.includes(platform.id)}
              onCheckedChange={() => handlePlatformToggle(platform.id)}
            />
            <label 
              htmlFor={`platform-${platform.id}`}
              className="flex items-center space-x-2 text-sm cursor-pointer"
            >
              <PlatformIcon platform={platform.id} size={16} />
              <span>{platform.name}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;
