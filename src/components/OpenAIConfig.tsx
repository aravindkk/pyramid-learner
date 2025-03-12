
import { useState } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const OpenAIConfig = () => {
  const { isConfigured, configureAPI, clearAPI } = useOpenAI();
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      configureAPI(inputKey.trim());
      setInputKey('');
      toast({
        title: "API Key Configured",
        description: "Your OpenAI API key has been saved.",
      });
    }
  };

  return (
    <div className="rounded-lg border p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2">OpenAI Configuration</h3>
      {isConfigured ? (
        <div>
          <p className="text-sm text-muted-foreground mb-2">API key is configured</p>
          <Button 
            variant="destructive" 
            onClick={clearAPI}
          >
            Clear API Key
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Enter your OpenAI API key"
            className="flex-1"
          />
          <Button type="submit">Save Key</Button>
        </form>
      )}
    </div>
  );
};

export default OpenAIConfig;
