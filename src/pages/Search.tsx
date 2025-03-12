
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { llmConcepts, Concept } from '@/data/llmConcepts';
import SearchResults from '@/components/SearchResults';
import Navbar from '@/components/Navbar';
import OpenAIConfig from '@/components/OpenAIConfig';
import { useOpenAI } from '@/hooks/useOpenAI';
import { toast } from '@/hooks/use-toast';

const Search: React.FC = () => {
  const { searchTerm = '' } = useParams<{ searchTerm: string }>();
  const [searchResults, setSearchResults] = useState<Concept[]>([]);
  const { apiKey, isConfigured } = useOpenAI();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const searchConcepts = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      try {
        if (isConfigured) {
          // First try OpenAI search
          const response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'text-embedding-ada-002',
              input: searchTerm,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to search with OpenAI');
          }

          // Fallback to local search if OpenAI fails
          const normalizedSearchTerm = decodeURIComponent(searchTerm).toLowerCase();
          const results = llmConcepts.filter(concept => {
            return (
              concept.title.toLowerCase().includes(normalizedSearchTerm) ||
              concept.description.toLowerCase().includes(normalizedSearchTerm) ||
              concept.content.toLowerCase().includes(normalizedSearchTerm) ||
              concept.tags.some(tag => tag.toLowerCase().includes(normalizedSearchTerm))
            );
          });
          
          setSearchResults(results);
        } else {
          // Use local search if OpenAI is not configured
          const normalizedSearchTerm = decodeURIComponent(searchTerm).toLowerCase();
          const results = llmConcepts.filter(concept => {
            return (
              concept.title.toLowerCase().includes(normalizedSearchTerm) ||
              concept.description.toLowerCase().includes(normalizedSearchTerm) ||
              concept.content.toLowerCase().includes(normalizedSearchTerm) ||
              concept.tags.some(tag => tag.toLowerCase().includes(normalizedSearchTerm))
            );
          });
          
          setSearchResults(results);
        }
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to perform search. Falling back to local search.",
          variant: "destructive",
        });
        
        // Fallback to local search
        const normalizedSearchTerm = decodeURIComponent(searchTerm).toLowerCase();
        const results = llmConcepts.filter(concept => {
          return (
            concept.title.toLowerCase().includes(normalizedSearchTerm) ||
            concept.description.toLowerCase().includes(normalizedSearchTerm) ||
            concept.content.toLowerCase().includes(normalizedSearchTerm) ||
            concept.tags.some(tag => tag.toLowerCase().includes(normalizedSearchTerm))
          );
        });
        
        setSearchResults(results);
      }
    };

    searchConcepts();
  }, [searchTerm, apiKey, isConfigured]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 mx-auto pt-24 pb-16">
        <OpenAIConfig />
        <div className="mt-8">
          <SearchResults 
            searchTerm={decodeURIComponent(searchTerm)} 
            concepts={searchResults} 
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
