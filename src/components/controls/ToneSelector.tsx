
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const tones = [
  { id: 'professional', name: 'Professional', description: 'Formal and business-like' },
  { id: 'casual', name: 'Casual', description: 'Relaxed and conversational' },
  { id: 'viral', name: 'Viral', description: 'Optimized for engagement' },
  { id: 'sarcastic', name: 'Sarcastic', description: 'Witty with subtle humor' },
  { id: 'academic', name: 'Academic', description: 'Scholarly and analytical' },
];

const ToneSelector = () => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Content Tone</label>
      <Select defaultValue="viral">
        <SelectTrigger>
          <SelectValue placeholder="Select tone" />
        </SelectTrigger>
        <SelectContent>
          {tones.map(tone => (
            <SelectItem key={tone.id} value={tone.id}>
              <div>
                <div>{tone.name}</div>
                <div className="text-xs text-muted-foreground">{tone.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ToneSelector;
