
import React, { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { useInsightData } from '@/hooks/useInsightData';
import InsightTabs from './InsightTabs';
import DashboardHeader from './DashboardHeader';
import DashboardCharts from './DashboardCharts';
import { toast } from 'sonner';

const InsightDashboard = () => {
  const [selectedView, setSelectedView] = useState('insights');
  const { data, isLoading, error, refetch } = useInsightData();
  const [selectedPlatforms, setSelectedPlatforms] = useState([
    'twitter', 
    'reddit', 
    'linkedin', 
    'instagram', 
    'youtube', 
    'web'
  ]);

  // Create refs for export functionality
  const insightsRef = useRef<HTMLDivElement>(null);
  const chartsRef = useRef<HTMLDivElement>(null);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-medium">Processing insights...</h3>
        <p className="text-muted-foreground">Our AI agents are analyzing the data</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-medium">Error processing insights</h3>
          <p>{error.message}</p>
        </div>
        <Button variant="outline" onClick={handleRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader 
        data={data} 
        isLoading={isLoading} 
        onRefresh={refetch} 
        dateRange={dateRange}
        insightsRef={insightsRef}
        chartsRef={chartsRef}
      />

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="mb-8">
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
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[600px]">
              {JSON.stringify(data?.rawData, null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>

      <div ref={chartsRef} className="mt-6">
        {/* Charts container for export purposes */}
        {data && <DashboardCharts data={data} />}
      </div>
    </div>
  );
};

export default InsightDashboard;
