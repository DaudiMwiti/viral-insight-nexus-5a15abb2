
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ComparisonView from '@/components/comparison/ComparisonView';
import { platformOptions, timeOptions } from '@/hooks/useComparisonData';

const Comparison = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Insight Comparison</h1>
        <ComparisonView targetOptions={[...platformOptions, ...timeOptions]} />
      </div>
    </AppLayout>
  );
};

export default Comparison;
