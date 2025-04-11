
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getPlatformDisplayName } from '@/lib/platformUtils';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptPreviewProps {
  platforms: string[];
  preset: string;
  tone: string;
  date?: Date;
}

const PromptPreview: React.FC<PromptPreviewProps> = ({
  platforms,
  preset,
  tone,
  date
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Build the prompt based on the selected options
  const buildPrompt = () => {
    const platformsText = platforms.length > 0 
      ? platforms.map(p => getPlatformDisplayName(p)).join(', ')
      : 'No platforms selected';
    
    const dateText = date ? format(date, 'PPP') : 'Last 7 days';
    
    return `Generate insights with the following parameters:
- Platforms: ${platformsText}
- Time range: ${dateText}
- Content tone: ${tone}
- Agent preset: ${preset}

The AI should analyze recent social media activity and web content
to identify key trends, sentiment patterns, and engagement drivers.
Focus on actionable insights that can inform content creation strategy.`;
  };
  
  const promptText = buildPrompt();
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(promptText);
    setIsCopied(true);
    toast.success('Prompt copied to clipboard');
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  return (
    <div className="w-full my-4">
      <div className="flex justify-between items-center mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleVisibility}
          className="text-xs"
        >
          {isVisible ? (
            <>
              <EyeOff className="h-3.5 w-3.5 mr-1" />
              Hide Agent Prompt
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 mr-1" />
              View Agent Prompt
            </>
          )}
        </Button>
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-2 flex flex-row justify-between">
                <CardTitle className="text-sm">Agent Prompt Preview</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="h-7 px-2"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-auto max-h-60 whitespace-pre-wrap">
                  {promptText}
                </pre>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptPreview;
