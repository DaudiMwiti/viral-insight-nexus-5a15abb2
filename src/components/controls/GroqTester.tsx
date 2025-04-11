
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const GroqTester = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkGroqConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/test-groq`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Groq API Connection Test</CardTitle>
        <CardDescription>
          Check if your Groq API key is configured correctly and models are available
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {result && (
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-medium mr-2">Status:</span>
              <Badge 
                variant={result.status === 'success' ? 'default' : 'destructive'}
                className="ml-2"
              >
                {result.status}
              </Badge>
            </div>
            
            <div>
              <span className="font-medium">Message:</span>
              <p className="mt-1 text-sm text-muted-foreground">{result.message}</p>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium mr-2">API Key Configured:</span>
              {result.api_key_configured ? 
                <CheckCircle2 className="text-green-500 h-5 w-5" /> : 
                <XCircle className="text-red-500 h-5 w-5" />
              }
            </div>
            
            {result.models_available && result.models_available.length > 0 && (
              <div>
                <span className="font-medium">Available Models:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.models_available.map((model: string) => (
                    <Badge key={model} variant="outline">{model}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkGroqConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Checking Groq Connection...' : 'Test Groq Connection'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroqTester;
