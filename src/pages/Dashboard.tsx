
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InsightDashboard from "@/components/dashboard/InsightDashboard";
import { Toaster } from "@/components/ui/sonner";
import GroqTester from "@/components/controls/GroqTester";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);

  return (
    <>
      <AppLayout>
        <div className="container mx-auto">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">Insights Dashboard</TabsTrigger>
              <TabsTrigger value="groq">Test Groq Connection</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <InsightDashboard
                realtimeEnabled={realtimeEnabled}
                setRealtimeEnabled={setRealtimeEnabled}
              />
            </TabsContent>
            <TabsContent value="groq">
              <div className="max-w-2xl mx-auto my-8">
                <GroqTester />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
      <Toaster />
    </>
  );
};

export default Dashboard;
