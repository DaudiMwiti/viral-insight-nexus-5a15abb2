
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChartIcon, PencilIcon, SparklesIcon } from 'lucide-react';

const agentPresets = [
  { id: 'analyst', name: 'Analyst Agent', description: 'Extract themes, sentiment, key events', icon: <BarChartIcon className="h-4 w-4" /> },
  { id: 'writer', name: 'Writer Agent', description: 'Convert insights into viral content', icon: <PencilIcon className="h-4 w-4" /> },
  { id: 'composer', name: 'Insight Composer', description: 'Run full analysis with personalized insights', icon: <SparklesIcon className="h-4 w-4" /> },
];

const AgentPresetSelector = () => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Agent Preset</label>
      <Select defaultValue="composer">
        <SelectTrigger>
          <SelectValue placeholder="Select agent preset" />
        </SelectTrigger>
        <SelectContent>
          {agentPresets.map(preset => (
            <SelectItem key={preset.id} value={preset.id}>
              <div className="flex items-center gap-2">
                {preset.icon}
                <div>
                  <div>{preset.name}</div>
                  <div className="text-xs text-muted-foreground">{preset.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AgentPresetSelector;
