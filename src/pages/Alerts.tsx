
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Bell } from "lucide-react";

const Alerts = () => {
  return (
    <AppLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Alerts</h1>
        
        <Alert variant="default" className="mb-6">
          <Bell className="h-4 w-4 mr-2" />
          <AlertTitle>Alerts Center</AlertTitle>
          <AlertDescription>
            Configure and manage alerts for your social media monitoring.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder for future alerts components */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-lg mb-2">Active Alerts</h3>
            <p className="text-muted-foreground">No active alerts at this time.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="font-medium text-lg mb-2">Alert History</h3>
            <p className="text-muted-foreground">View past alerts and their resolutions.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Alerts;
