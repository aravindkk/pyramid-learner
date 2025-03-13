
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
  const [searchStatus, setSearchStatus] = useState('');
  const { apiKey, isConfigured } = useOpenAI();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const searchConcepts = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setSearchStatus('Starting search...');

      try {
        // Always perform local search first to have fallback results
        const normalizedSearchTerm = decodeURIComponent(searchTerm).toLowerCase();
        console.log(`Searching for: "${normalizedSearchTerm}"`);
        
        let results = llmConcepts.filter(concept => {
          return (
            concept.title.toLowerCase().includes(normalizedSearchTerm) ||
            concept.description.toLowerCase().includes(normalizedSearchTerm) ||
            concept.content.toLowerCase().includes(normalizedSearchTerm) ||
            concept.tags.some(tag => tag.toLowerCase().includes(normalizedSearchTerm))
          );
        });
        
        setSearchResults(results);
        console.log(`Found ${results.length} local results`);
        
        // If OpenAI is configured, try to enhance the search
        if (isConfigured && apiKey) {
          setSearchStatus('Enhancing search with OpenAI...');
          console.log("Starting OpenAI enhanced search...");
          
          try {
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
                    content: `You are a helpful assistant that identifies relevant concepts for the given search string.
                    The user is searching for: "${normalizedSearchTerm}".
                    Return ONLY the concept titles from the list that are most relevant to the search query, even if there's only a weak connection.
                    For non-LLM terms, try to find any remotely relevant LLM concepts.
                    Format your response as a JSON array of strings containing only the relevant concept titles.
                    Example: ["Attention Mechanism", "Transformer Architecture"]
                    If nothing is relevant, return an empty array: []`
                  },
                  {
                    role: 'user',
                    content: `Find the most relevant concepts for: "${normalizedSearchTerm}"`
                  }
                ],
                temperature: 0.5,
                max_tokens: 150
              }),
            });

            if (!completionResponse.ok) {
              const errorData = await completionResponse.json();
              throw new Error(`OpenAI API error: ${errorData.error?.message || completionResponse.statusText}`);
            }

            const completionData = await completionResponse.json();
            console.log("OpenAI response:", completionData);
            
            // Extract and parse the response content
            if (completionData.choices && completionData.choices[0]?.message?.content) {
              const content = completionData.choices[0].message.content.trim();
              console.log("OpenAI suggested concepts:", content);
              
              // Parse the response from OpenAI
              let suggestedConcepts: string[] = [];
              try {
                // Try to parse as JSON array first
                if (content.startsWith('[') && content.endsWith(']')) {
                  suggestedConcepts = JSON.parse(content);
                } else {
                  // Fall back to parsing as comma-separated list
                  suggestedConcepts = content.split(',').map(title => title.trim().replace(/['"]/g, '')).filter(Boolean);
                }
              } catch (e) {
                console.error("Failed to parse OpenAI response:", e);
                // Fall back to comma-separated parsing
                suggestedConcepts = content.split(',').map(title => title.trim().replace(/['"]/g, '')).filter(Boolean);
              }
              
              console.log("Parsed suggestions:", suggestedConcepts);
              
              if (suggestedConcepts.length > 0) {
                // Find matching concepts with more flexible matching
                const aiResults = llmConcepts.filter(concept => 
                  suggestedConcepts.some(title => {
                    const normalizedTitle = title.toLowerCase().replace(/["']/g, '');
                    const normalizedConceptTitle = concept.title.toLowerCase();
                    return normalizedConceptTitle.includes(normalizedTitle) || 
                           normalizedTitle.includes(normalizedConceptTitle);
                  })
                );
                
                console.log("AI filtered results:", aiResults);
                
                if (aiResults.length > 0) {
                  // Only update if we got results
                  setSearchResults(aiResults);
                  toast({
                    title: "AI-Enhanced Search Results",
                    description: `Found ${aiResults.length} concepts that might relate to "${searchTerm}"`,
                  });
                } else if (results.length === 0) {
                  // If no AI results and no basic results
                  toast({
                    title: "No Results Found",
                    description: "No LLM concepts matched your search term. Try a different term.",
                    variant: "destructive",
                  });
                }
              } else if (results.length === 0) {
                // If OpenAI didn't suggest any concepts and basic search found nothing
                toast({
                  title: "No Results Found",
                  description: "Try searching for LLM-related terms like 'transformer', 'attention', or 'fine-tuning'.",
                  variant: "destructive",
                });
              }
            }
          } catch (apiError: any) {
            console.error('OpenAI API error:', apiError);
            toast({
              title: "OpenAI Search Error",
              description: apiError.message || "Failed to enhance search with OpenAI.",
              variant: "destructive",
            });
          }
        } else if (results.length === 0) {
          // No OpenAI and no basic results
          toast({
            title: "No Results Found",
            description: "We only have LLM concepts in our dataset. Try a more relevant search term.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error('Search error:', error);
        toast({
          title: "Search Error",
          description: error.message || "Failed to perform search. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
        setSearchStatus('');
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
              <div className="animate-pulse mb-4">
                <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-primary/20 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-muted-foreground">{searchStatus || 'Searching...'}</p>
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
