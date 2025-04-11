
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ComparisonViewProps, ComparisonOption } from '@/types/comparison';
import { useComparisonData, platformOptions, timeOptions } from '@/hooks/useComparisonData';
import ComparisonMetricCard from './ComparisonMetricCard';
import TopicsComparison from './TopicsComparison';
import { PlatformIcon } from '@/components/icons/PlatformIcons';
import { getPlatformDisplayName } from '@/lib/platformUtils';

const ComparisonView: React.FC<ComparisonViewProps> = ({
  data: propData,
  targetOptions = [...platformOptions, ...timeOptions],
  onComparisonChange,
  isLoading: propIsLoading
}) => {
  const [comparisonType, setComparisonType] = useState<'platform' | 'time'>('platform');
  const [targetA, setTargetA] = useState<string>(platformOptions[0].id);
  const [targetB, setTargetB] = useState<string>(platformOptions[1].id);
  
  // Filter options based on comparison type
  const filteredOptions = targetOptions.filter(option => option.type === comparisonType);
  
  // Use provided data or fetch data
  const {
    data: fetchedData,
    isLoading: isFetchLoading
  } = useComparisonData(targetA, targetB);
  
  const data = propData || fetchedData;
  const isLoading = propIsLoading || isFetchLoading;
  
  // Get display names for the selected targets
  const getTargetDisplayName = (targetId: string): string => {
    const target = targetOptions.find(option => option.id === targetId);
    if (!target) return targetId;
    
    if (target.type === 'platform') {
      return getPlatformDisplayName(targetId);
    }
    
    return target.name;
  };
  
  const targetAName = getTargetDisplayName(targetA);
  const targetBName = getTargetDisplayName(targetB);
  
  // Handle comparison changes
  useEffect(() => {
    if (onComparisonChange) {
      onComparisonChange(targetA, targetB);
    }
  }, [targetA, targetB, onComparisonChange]);
  
  const handleTargetAChange = (value: string) => {
    if (value === targetB) {
      // If user selects the same as target B, swap them
      setTargetA(targetB);
      setTargetB(value);
    } else {
      setTargetA(value);
    }
  };
  
  const handleTargetBChange = (value: string) => {
    if (value === targetA) {
      // If user selects the same as target A, swap them
      setTargetB(targetA);
      setTargetA(value);
    } else {
      setTargetB(value);
    }
  };
  
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat().format(value);
  };
  
  const formatPercentage = (value: number): string => {
    return `${value}%`;
  };
  
  if (isLoading) {
    return <ComparisonViewSkeleton />;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Comparison View</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="platform" className="w-full" onValueChange={(v) => setComparisonType(v as 'platform' | 'time')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="platform">Compare Platforms</TabsTrigger>
              <TabsTrigger value="time">Compare Time Periods</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {comparisonType === 'platform' ? 'Platform A' : 'Time Period A'}
                </label>
                <Select value={targetA} onValueChange={handleTargetAChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {comparisonType === 'platform' && (
                          <div className="flex items-center gap-2">
                            <PlatformIcon platform={option.id} size={16} />
                            <span>{option.name}</span>
                          </div>
                        )}
                        {comparisonType === 'time' && option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {comparisonType === 'platform' ? 'Platform B' : 'Time Period B'}
                </label>
                <Select value={targetB} onValueChange={handleTargetBChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {comparisonType === 'platform' && (
                          <div className="flex items-center gap-2">
                            <PlatformIcon platform={option.id} size={16} />
                            <span>{option.name}</span>
                          </div>
                        )}
                        {comparisonType === 'time' && option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ComparisonMetricCard 
              title="Sentiment Score" 
              metric={data.sentiment} 
              formatValue={formatPercentage} 
            />
            <ComparisonMetricCard 
              title="Post Volume" 
              metric={data.volume} 
              formatValue={formatNumber} 
            />
            <ComparisonMetricCard 
              title="Engagement" 
              metric={data.engagement} 
              formatValue={formatNumber} 
            />
          </div>
          
          <TopicsComparison 
            titleA={targetAName}
            titleB={targetBName}
            topicsA={data.topTopics.targetA}
            topicsB={data.topTopics.targetB}
          />
        </>
      )}
    </div>
  );
};

const ComparisonViewSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-6 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
    
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-24 mb-2" />
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-5 w-24 mb-2" />
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ComparisonView;
