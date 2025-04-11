
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricSummary } from '@/types/comparison';

interface ComparisonMetricCardProps {
  title: string;
  metric: MetricSummary;
  formatValue?: (value: number) => string;
  className?: string;
}

const ComparisonMetricCard: React.FC<ComparisonMetricCardProps> = ({
  title,
  metric,
  formatValue = (value) => value.toString(),
  className
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="text-2xl font-bold">{formatValue(metric.current)}</div>
          
          <div className="flex items-center space-x-2">
            {metric.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            
            <span 
              className={cn(
                "text-sm font-medium",
                metric.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {metric.isPositive ? "+" : ""}{metric.percentChange}%
            </span>
            
            <span className="text-xs text-muted-foreground">
              vs. {formatValue(metric.previous)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonMetricCard;
