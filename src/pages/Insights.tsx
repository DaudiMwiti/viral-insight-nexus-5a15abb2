
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Insights = () => {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Insights</h1>
        
        <Alert variant="default" className="mb-6">
          <Info className="h-4 w-4 mr-2" />
          <AlertTitle>Insights Dashboard</AlertTitle>
          <AlertDescription>
            View key insights and trends from your social media platforms.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for future insights components */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-lg mb-2">Top Trending Topics</h3>
            <p className="text-muted-foreground">View the most discussed topics across your platforms.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-lg mb-2">Sentiment Analysis</h3>
            <p className="text-muted-foreground">Track sentiment trends over time.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-lg mb-2">Engagement Metrics</h3>
            <p className="text-muted-foreground">Monitor user engagement across platforms.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Insights;
