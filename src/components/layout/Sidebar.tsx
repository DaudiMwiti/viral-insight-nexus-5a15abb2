import React, { useState } from 'react';
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarHeader
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PlatformSelector from '@/components/controls/PlatformSelector';
import AgentPresetSelector from '@/components/controls/AgentPresetSelector';
import ToneSelector from '@/components/controls/ToneSelector';
import DateRangeSelector from '@/components/controls/DateRangeSelector';
import { PlayIcon, RefreshCw } from 'lucide-react';

interface SidebarProps {
  onPlatformsChange?: (platforms: string[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onPlatformsChange }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    'twitter', 
    'reddit', 
    'linkedin', 
    'instagram', 
    'youtube', 
    'web'
  ]);
  
  const handlePlatformsChange = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
    if (onPlatformsChange) {
      onPlatformsChange(platforms);
    }
  };

  const handleRunFlow = () => {
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }
    
    toast.info(`Starting agent flow for ${selectedPlatforms.length} platforms...`);
    // This will be implemented to trigger the API call
  };

  const handleReset = () => {
    const defaultPlatforms = ['twitter', 'reddit', 'linkedin', 'instagram', 'youtube', 'web'];
    setSelectedPlatforms(defaultPlatforms);
    if (onPlatformsChange) {
      onPlatformsChange(defaultPlatforms);
    }
    toast.info('Settings reset to default');
  };

  return (
    <ShadcnSidebar>
      <SidebarHeader className="px-4 py-6 border-b">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-primary">Viral</span>
          <span className="text-accent">Insight</span>
          <span>Nexus</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">AI-powered insight generation</p>
      </SidebarHeader>
      <SidebarContent className="px-4 py-6 space-y-6">
        <PlatformSelector 
          selectedPlatforms={selectedPlatforms}
          onPlatformsChange={handlePlatformsChange}
        />
        <AgentPresetSelector />
        <ToneSelector />
        <DateRangeSelector />
        <div className="flex flex-col space-y-2 mt-8">
          <Button 
            className="w-full" 
            onClick={handleRunFlow}
            size="lg"
          >
            <PlayIcon className="mr-2 h-4 w-4" />
            Run Agent Flow
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4 border-t text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Powered by CrewAI</span>
          <span>Using Groq API</span>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
