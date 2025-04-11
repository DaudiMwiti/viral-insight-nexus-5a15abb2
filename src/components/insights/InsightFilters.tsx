
import React from 'react';
import { Check, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SentimentFilter = 'all' | 'positive' | 'negative' | 'neutral';
export type EngagementFilter = 'all' | 'high' | 'medium' | 'low';
export type DateRangeFilter = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

interface InsightFiltersProps {
  sentimentFilter: SentimentFilter;
  engagementFilter: EngagementFilter;
  dateRangeFilter: DateRangeFilter;
  onSentimentChange: (value: SentimentFilter) => void;
  onEngagementChange: (value: EngagementFilter) => void;
  onDateRangeChange: (range: DateRangeFilter) => void;
  onClearFilters: () => void;
  isFiltersActive: boolean;
}

const InsightFilters = ({
  sentimentFilter,
  engagementFilter,
  dateRangeFilter,
  onSentimentChange,
  onEngagementChange,
  onDateRangeChange,
  onClearFilters,
  isFiltersActive
}: InsightFiltersProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between pb-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="px-2 py-1 h-8">
            <span className="mr-1">Filters</span>
            {isFiltersActive && (
              <Badge variant="secondary" className="ml-1 mr-1">
                Active
              </Badge>
            )}
            <span className="sr-only">Toggle filters</span>
          </Button>
        </CollapsibleTrigger>
        {isFiltersActive && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-8 text-xs flex items-center gap-1 text-muted-foreground"
          >
            <FilterX className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
      
      <CollapsibleContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sentiment Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sentiment</label>
            <Select 
              value={sentimentFilter} 
              onValueChange={(value) => onSentimentChange(value as SentimentFilter)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Engagement Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Engagement Level</label>
            <Select 
              value={engagementFilter} 
              onValueChange={(value) => onEngagementChange(value as EngagementFilter)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select engagement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRangeFilter.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRangeFilter.startDate ? (
                    dateRangeFilter.endDate ? (
                      <>
                        {format(dateRangeFilter.startDate, "MMM d")} - {format(dateRangeFilter.endDate, "MMM d")}
                      </>
                    ) : (
                      format(dateRangeFilter.startDate, "PPP")
                    )
                  ) : (
                    <span>Any date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRangeFilter.startDate}
                  onSelect={(date) => onDateRangeChange({ 
                    startDate: date, 
                    endDate: dateRangeFilter.endDate
                  })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Active Filters Pills */}
        {isFiltersActive && (
          <div className="flex flex-wrap gap-2 pt-2">
            {sentimentFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                Sentiment: {sentimentFilter.charAt(0).toUpperCase() + sentimentFilter.slice(1)}
                <button 
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => onSentimentChange('all')}
                >
                  <Check className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </button>
              </Badge>
            )}
            
            {engagementFilter !== 'all' && (
              <Badge variant="outline" className="flex items-center gap-1">
                Engagement: {engagementFilter.charAt(0).toUpperCase() + engagementFilter.slice(1)}
                <button 
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => onEngagementChange('all')}
                >
                  <Check className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </button>
              </Badge>
            )}
            
            {dateRangeFilter.startDate && (
              <Badge variant="outline" className="flex items-center gap-1">
                Date: {format(dateRangeFilter.startDate, "MMM d")}
                {dateRangeFilter.endDate && ` - ${format(dateRangeFilter.endDate, "MMM d")}`}
                <button 
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => onDateRangeChange({ startDate: undefined, endDate: undefined })}
                >
                  <Check className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </button>
              </Badge>
            )}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default InsightFilters;
