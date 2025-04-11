
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import InsightDashboard from "@/components/dashboard/InsightDashboard";
import { Toaster } from "@/components/ui/sonner";

const Dashboard = () => {
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);

  return (
    <>
      <AppLayout>
        <div className="container mx-auto">
          <InsightDashboard
            realtimeEnabled={realtimeEnabled}
            setRealtimeEnabled={setRealtimeEnabled}
          />
        </div>
      </AppLayout>
      <Toaster />
    </>
  );
};

export default Dashboard;
