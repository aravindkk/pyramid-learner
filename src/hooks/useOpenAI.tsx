
import { useState, useEffect } from 'react';

export const useOpenAI = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsConfigured(true);
    }
  }, []);

  const configureAPI = (key: string) => {
    localStorage.setItem('openai_api_key', key);
    setApiKey(key);
    setIsConfigured(true);
  };

  const clearAPI = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsConfigured(false);
  };

  return { apiKey, isConfigured, configureAPI, clearAPI };
};
