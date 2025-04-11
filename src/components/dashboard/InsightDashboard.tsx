
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import InsightCards from './InsightCards';
import InsightCharts from './InsightCharts';
import ThreadOutput from './ThreadOutput';
import { useInsightData } from '@/hooks/useInsightData';

const InsightDashboard = () => {
  const [activeView, setActiveView] = useState('insights');
  const { data, isLoading, error } = useInsightData();

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
        <Button variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">X (Twitter) Insights</h1>
        <p className="text-muted-foreground">
          Generated insights from Twitter data using CrewAI agents
        </p>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
          <TabsTrigger value="insights">Generated Insights</TabsTrigger>
          <TabsTrigger value="threads">Thread Output</TabsTrigger>
        </TabsList>
        <TabsContent value="raw">
          <div className="grid grid-cols-1 gap-6">
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[600px]">
              {JSON.stringify(data?.rawData, null, 2)}
            </pre>
          </div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <InsightCards insights={data?.insights || []} />
          </div>
          <InsightCharts data={data?.chartData || {
            sentiment: [],
            engagement: []
          }} />
        </TabsContent>
        <TabsContent value="threads">
          <ThreadOutput threadData={data?.threadOutput || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightDashboard;
