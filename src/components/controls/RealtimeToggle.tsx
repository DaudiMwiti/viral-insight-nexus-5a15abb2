
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Activity, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RealtimeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isUpdating?: boolean;
  hasNewData?: boolean;
  className?: string;
}

const RealtimeToggle: React.FC<RealtimeToggleProps> = ({
  enabled,
  onToggle,
  isUpdating = false,
  hasNewData = false,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <Switch
              id="realtime-mode"
              checked={enabled}
              onCheckedChange={onToggle}
              aria-label={enabled ? "Disable real-time updates" : "Enable real-time updates"}
            />
            <AnimatePresence mode="wait">
              {isUpdating ? (
                <motion.div
                  key="updating"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-primary"
                >
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={cn(
                    "text-muted-foreground transition-colors duration-200",
                    enabled && "text-primary",
                    hasNewData && "text-accent"
                  )}
                >
                  <Activity className={cn(
                    "h-4 w-4",
                    hasNewData && "animate-pulse"
                  )} aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
            <Label 
              htmlFor="realtime-mode" 
              className="text-sm cursor-pointer select-none"
            >
              Real-time
            </Label>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{enabled ? "Disable" : "Enable"} real-time updates</p>
          {enabled && (
            <p className="text-xs text-muted-foreground">
              Updates every 30 seconds
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default RealtimeToggle;
