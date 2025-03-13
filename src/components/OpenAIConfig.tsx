
import { useState } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle } from 'lucide-react';

const OpenAIConfig = () => {
  const { isConfigured, configureAPI, clearAPI, apiKey } = useOpenAI();
  const [inputKey, setInputKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateApiKey = async (key: string) => {
    setIsValidating(true);
    try {
      console.log("Validating OpenAI API key...");
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log("API key validation successful");
        return true;
      } else {
        const data = await response.json();
        console.error("API key validation failed:", data);
        throw new Error(data.error?.message || 'API key validation failed');
      }
    } catch (error: any) {
      console.error('API key validation error:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }
    
    setIsValidating(true);
    const isValid = await validateApiKey(inputKey.trim());
    
    if (isValid) {
      configureAPI(inputKey.trim());
      setInputKey('');
      toast({
        title: "API Key Configured",
        description: "Your OpenAI API key has been validated and saved.",
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "The API key could not be validated. Please check your key and try again.",
        variant: "destructive",
      });
    }
    setIsValidating(false);
  };

  return (
    <div className="rounded-lg border p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2">OpenAI Configuration</h3>
      {isConfigured ? (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            API key is configured and stored locally. This enables enhanced search capabilities.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                toast({
                  title: "API Key Info",
                  description: `Key starts with: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 4)}`,
                });
              }}
            >
              Check Key
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                clearAPI();
                toast({
                  title: "API Key Removed",
                  description: "Your OpenAI API key has been removed.",
                });
              }}
            >
              Clear API Key
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground mb-2">
            Add your OpenAI API key to enhance search capabilities. Your key is stored only in your browser.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="flex-1"
              disabled={isValidating}
            />
            <Button type="submit" disabled={isValidating}>
              {isValidating ? "Validating..." : "Save Key"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default OpenAIConfig;
