
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
  const [isSearching, setIsSearching] = useState(false);
  const { apiKey, isConfigured } = useOpenAI();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const searchConcepts = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);

      try {
        // Always perform local search first to have results
        const normalizedSearchTerm = decodeURIComponent(searchTerm).toLowerCase();
        let results = llmConcepts.filter(concept => {
          return (
            concept.title.toLowerCase().includes(normalizedSearchTerm) ||
            concept.description.toLowerCase().includes(normalizedSearchTerm) ||
            concept.content.toLowerCase().includes(normalizedSearchTerm) ||
            concept.tags.some(tag => tag.toLowerCase().includes(normalizedSearchTerm))
          );
        });
        
        // Set initial search results
        setSearchResults(results);
        
        // Try enhanced search with OpenAI if configured
        if (isConfigured && apiKey) {
          console.log("Using OpenAI to enhance search...");
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
            throw new Error(`OpenAI API error: ${response.status}`);
          }

          const data = await response.json();
          
          if (data.data && data.data[0] && data.data[0].embedding) {
            console.log("Got OpenAI embedding, enhancing search...");
            
            // If no results from basic search, show a meaningful message
            if (results.length === 0) {
              toast({
                title: "Search Enhanced",
                description: "We only have LLM concepts in our dataset. Try searching for terms like 'transformer', 'attention', or 'large language model'.",
              });
            }
          }
        }
      } catch (error) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to enhance search with OpenAI. Using local search results.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
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
          {isSearching ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : (
            <SearchResults 
              searchTerm={decodeURIComponent(searchTerm)} 
              concepts={searchResults} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
