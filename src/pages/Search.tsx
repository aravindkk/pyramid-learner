
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
        // Always perform local search first to have fallback results
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
        
        if (isConfigured && apiKey) {
          console.log("Starting OpenAI enhanced search...");
          
          // Generate embeddings for the search term
          const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'text-embedding-ada-002',
              input: normalizedSearchTerm,
            }),
          });

          if (!embeddingResponse.ok) {
            const errorData = await embeddingResponse.json();
            throw new Error(`OpenAI API error: ${errorData.error?.message || embeddingResponse.status}`);
          }

          const embeddingData = await embeddingResponse.json();
          console.log("Received embedding data:", embeddingData);
          
          if (embeddingData.data && embeddingData.data[0] && embeddingData.data[0].embedding) {
            console.log("Got search term embedding, asking OpenAI to find related concepts...");
            
            // Now use completions to find related concepts
            const completionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                  {
                    role: 'system',
                    content: `You are a helpful assistant that identifies relevant LLM concepts.
                    Below is a list of available LLM concepts: ${llmConcepts.map(c => c.title).join(', ')}.
                    The user's search query is: "${normalizedSearchTerm}".
                    Return ONLY the concept titles from the list that are most relevant to the search query.
                    Format your response as a comma-separated list of concept titles, with no additional text.`
                  },
                  {
                    role: 'user',
                    content: `Find the most relevant concepts for: "${normalizedSearchTerm}"`
                  }
                ],
                temperature: 0.3,
                max_tokens: 150
              }),
            });

            if (!completionResponse.ok) {
              const errorData = await completionResponse.json();
              throw new Error(`OpenAI completion error: ${errorData.error?.message || completionResponse.status}`);
            }

            const completionData = await completionResponse.json();
            console.log("Received completion data:", completionData);
            
            if (completionData.choices && completionData.choices[0]?.message?.content) {
              const content = completionData.choices[0].message.content.trim();
              console.log("OpenAI suggested concepts:", content);
              
              // Parse the response to get concept titles
              const suggestedConcepts = content.split(',')
                .map(title => title.trim())
                .filter(Boolean);
              
              if (suggestedConcepts.length > 0) {
                // Filter concepts based on the suggestions
                const aiResults = llmConcepts.filter(concept => 
                  suggestedConcepts.some(title => 
                    concept.title.toLowerCase().includes(title.toLowerCase()) || 
                    title.toLowerCase().includes(concept.title.toLowerCase())
                  )
                );
                
                console.log("AI filtered results:", aiResults);
                
                if (aiResults.length > 0) {
                  // Replace the basic search results with AI-enhanced ones
                  setSearchResults(aiResults);
                  toast({
                    title: "AI-Enhanced Search Results",
                    description: `Found ${aiResults.length} concepts related to "${searchTerm}"`,
                  });
                } else if (results.length === 0) {
                  toast({
                    title: "No Results Found",
                    description: "We only have LLM concepts in our dataset. Try searching for terms like 'transformer', 'attention', or 'large language model'.",
                  });
                }
              }
            }
          }
        } else if (results.length === 0) {
          // If no OpenAI config and no results from basic search
          toast({
            title: "No Results Found",
            description: "We only have LLM concepts in our dataset. Consider adding your OpenAI API key for enhanced search.",
          });
        }
      } catch (error: any) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: error.message || "Failed to enhance search with OpenAI. Using local search results.",
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
              <p className="text-muted-foreground">Searching with OpenAI...</p>
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
