
import React from 'react';
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
import { PlayIcon } from 'lucide-react';

const Sidebar = () => {
  const handleRunFlow = () => {
    toast.info('Starting agent flow...');
    // This will be implemented to trigger the API call
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
        <PlatformSelector />
        <AgentPresetSelector />
        <ToneSelector />
        <DateRangeSelector />
        <Button 
          className="w-full mt-8" 
          onClick={handleRunFlow}
          size="lg"
        >
          <PlayIcon className="mr-2 h-4 w-4" />
          Run Agent Flow
        </Button>
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
