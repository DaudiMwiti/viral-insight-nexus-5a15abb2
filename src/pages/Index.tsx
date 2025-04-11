
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  // Option 1: Auto-redirect after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/insights');
    }, 3000); // 3 second delay

    return () => clearTimeout(timer);
  }, [navigate]);

  // Option 2: Provide a CTA for manual navigation
  const handleGoToDashboard = () => {
    navigate('/insights');
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30">
      <motion.div 
        className="text-center p-8 rounded-lg shadow-lg bg-background/90 backdrop-blur-sm border border-border max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6">Viral Insight Nexus</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Welcome to your comprehensive social media analytics platform.
          Redirecting to your dashboard...
        </p>
        <div className="space-y-4">
          <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="absolute h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
            />
          </div>
          <Button 
            size="lg" 
            onClick={handleGoToDashboard}
            className="font-medium"
          >
            Go to Dashboard Now
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
