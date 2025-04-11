
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useInsightData } from '@/hooks/useInsightData';
import InsightTabs from './InsightTabs';
import DashboardHeader from './DashboardHeader';
import DashboardCharts from './DashboardCharts';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface InsightDashboardProps {
  selectedPlatforms?: string[];
  realtimeEnabled?: boolean;
  setRealtimeEnabled?: (enabled: boolean) => void;
}

const InsightDashboard: React.FC<InsightDashboardProps> = ({
  selectedPlatforms = [
    'twitter', 
    'reddit', 
    'linkedin', 
    'instagram', 
    'youtube', 
    'web'
  ],
  realtimeEnabled = true,
  setRealtimeEnabled = () => {}
}) => {
  const [localRealtimeEnabled, setLocalRealtimeEnabled] = useState(realtimeEnabled);
  const { 
    data, 
    isLoading, 
    error, 
    refetch, 
    hasNewInsights,
    setRealtimeEnabled: setHookRealtimeEnabled 
  } = useInsightData(localRealtimeEnabled);
  
  const [selectedView, setSelectedView] = useState('insights');
  
  // Create refs for export functionality
  const insightsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When component mounts, check connection to backend
    const checkBackendConnection = async () => {
      try {
        console.log('Checking backend connection...');
        const response = await fetch('http://localhost:8000/');
        if (response.ok) {
          toast.success('Connected to backend server');
          console.log('Backend connection successful');
        } else {
          toast.error('Backend server is running but returned an error');
          console.error('Backend error:', await response.text());
        }
      } catch (error) {
        console.error('Backend connection failed:', error);
        toast.error('Could not connect to backend server. Check console for details.');
      }
    };
    
    checkBackendConnection();
  }, []);

  // Connect the local state to the parent state
  useEffect(() => {
    setLocalRealtimeEnabled(realtimeEnabled);
  }, [realtimeEnabled]);

  // Connect the local toggle to both the hook and parent state
  const handleRealtimeToggle = (enabled: boolean) => {
    setLocalRealtimeEnabled(enabled);
    setHookRealtimeEnabled(enabled);
    setRealtimeEnabled(enabled);
  };

  const handleRetry = () => {
    toast.info("Retrying data fetch...");
    refetch();
  };

  // Set date range for the last week (for demonstration)
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  
  const dateRange = {
    start: lastWeek,
    end: today
  };

  if (isLoading && !data) {
    return (
      <section className="flex flex-col items-center justify-center h-[80vh]" aria-label="Loading State">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" aria-hidden="true" />
        <h2 className="text-xl font-medium">Processing insights...</h2>
        <p className="text-muted-foreground" role="status">Our AI agents are analyzing the data</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center justify-center h-[80vh]" aria-label="Error State">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-300 p-4 rounded-lg mb-4" role="alert">
          <h2 className="text-xl font-medium">Error processing insights</h2>
          <p>{(error as Error).message}</p>
        </div>
        <Button variant="outline" onClick={handleRetry}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Try Again
        </Button>
      </section>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.section 
        aria-label="Insights Dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DashboardHeader 
          data={data} 
          isLoading={isLoading} 
          onRefresh={refetch} 
          dateRange={dateRange}
          insightsRef={insightsRef}
          chartsRef={chartsRef}
          realtimeEnabled={localRealtimeEnabled}
          setRealtimeEnabled={handleRealtimeToggle}
          hasNewInsights={hasNewInsights}
        />

        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="mb-8" aria-label="View options">
            <TabsTrigger value="insights">Generated Insights</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights">
            <div ref={insightsRef}>
              <InsightTabs 
                data={data} 
                selectedPlatforms={selectedPlatforms}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="raw">
            <div className="grid grid-cols-1 gap-6">
              <section aria-label="Raw JSON Data">
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-[600px]" tabIndex={0}>
                  {JSON.stringify(data?.rawData, null, 2)}
                </pre>
              </section>
            </div>
          </TabsContent>
        </Tabs>

        <div ref={chartsRef} className="mt-6">
          {/* Charts container for export purposes */}
          {data && <DashboardCharts data={data} />}
        </div>
      </motion.section>
    </AnimatePresence>
  );
};

export default InsightDashboard;
