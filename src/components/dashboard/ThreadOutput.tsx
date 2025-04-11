
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Twitter } from 'lucide-react';
import { ThreadType } from '@/types/insight';
import { toast } from 'sonner';

interface ThreadOutputProps {
  threadData: ThreadType[];
}

const ThreadOutput = ({ threadData }: ThreadOutputProps) => {
  // Demo thread data if none is provided
  const demoThreadData: ThreadType[] = [
    {
      id: '1',
      title: 'AI Impact Analysis',
      content: [
        "🧵 Just analyzed the latest AI trends and here's what's happening (1/5):",
        "The rise of AI in creative fields is accelerating. Artists and writers are finding ways to collaborate with AI rather than compete. This is creating a new paradigm for creative production. (2/5)",
        "Key insight: Companies integrating AI thoughtfully see 3x productivity gains compared to those rushing implementation without proper training. (3/5)",
        "The most successful AI implementations focus on augmentation, not replacement. Teams working alongside AI report higher job satisfaction and better outcomes. (4/5)",
        "Prediction: Within 18 months, we'll see AI-human collaborative tools become the standard across creative industries, with new job categories emerging specifically for this partnership. (5/5)"
      ],
      sentiment: 'positive',
      platform: 'twitter'
    }
  ];

  const threads = threadData.length > 0 ? threadData : demoThreadData;

  const handleCopyThread = (thread: ThreadType) => {
    navigator.clipboard.writeText(thread.content.join('\n\n'));
    toast.success('Thread copied to clipboard');
  };

  return (
    <div className="space-y-8">
      {threads.map(thread => (
        <Card key={thread.id} className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-xl">{thread.title}</CardTitle>
            <CardDescription>Generated thread based on analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {thread.content.map((tweet, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">{tweet}</p>
                <div className="text-xs text-muted-foreground mt-2">Tweet {index + 1}/{thread.content.length}</div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => handleCopyThread(thread)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
            <Button size="sm">
              <Twitter className="h-4 w-4 mr-2" />
              Share to X
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ThreadOutput;
