
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import InsightDashboard from "@/components/dashboard/InsightDashboard";
import { Toaster } from "@/components/ui/sonner";

const Insights = () => {
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

export default Insights;
