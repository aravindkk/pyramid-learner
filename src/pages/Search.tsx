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
                    content: `You are a helpful assistant that identifies or creates relevant concepts for the given search query.
                    The user is searching for: "${normalizedSearchTerm}".
                    
                    Format your response as a JSON array of 9 objects with the following structure:
                    [
                      {
                        "id": "unique-id",
                        "title": "Concept Title",
                        "description": "Brief description of the concept",
                        "level": 1-4 (1 being most fundamental),
                        "position": 1-10,
                        "childrenIds": [],
                        "parentIds": [],
                        "content": "Detailed explanation of the concept",
                        "tags": ["Tag1", "Tag2"]
                      }
                    ]
                    
                    Focus on creating concepts related to the given search query. If the results are not related to the given search query, return an empty array: []`
                  },
                  {
                    role: 'user',
                    content: `Find or create related concepts for: "${normalizedSearchTerm}"`
                  }
                ],
                temperature: 0.7,
                max_tokens: 500
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
              
              let aiConcepts: Concept[] = [];
              try {
                // Try to parse the JSON response
                if (content.startsWith('[') && content.endsWith(']')) {
                  // Extract JSON array even if it's embedded in other text
                  const jsonStart = content.indexOf('[');
                  const jsonEnd = content.lastIndexOf(']') + 1;
                  const jsonContent = content.slice(jsonStart, jsonEnd);
                  
                  aiConcepts = JSON.parse(jsonContent);
                  
                  // Validate each concept has required fields
                  aiConcepts = aiConcepts.filter(concept => 
                    concept.id && concept.title && concept.description && 
                    typeof concept.level === 'number' && 
                    typeof concept.position === 'number'
                  );
                  
                  console.log("Parsed AI concepts:", aiConcepts);
                  
                  if (aiConcepts.length > 0) {
                    // Use AI generated concepts as search results
                    setSearchResults(aiConcepts);
                    toast({
                      title: "AI-Enhanced Search Results",
                      description: `Found ${aiConcepts.length} LLM concepts related to "${searchTerm}"`,
                    });
                  } else if (results.length === 0) {
                    toast({
                      title: "No Results Found",
                      description: "No LLM concepts matched your search term. Try a different term.",
                      variant: "destructive",
                    });
                  }
                } else {
                  throw new Error("Response not in expected JSON format");
                }
              } catch (e) {
                console.error("Failed to parse OpenAI response:", e);
                // If parsing fails but we have local results, keep them
                if (results.length > 0) {
                  toast({
                    title: "Using Basic Search Results",
                    description: `Found ${results.length} concepts that might relate to "${searchTerm}"`,
                  });
                } else {
                  toast({
                    title: "No Results Found",
                    description: "We couldn't find LLM concepts matching your search. Try a different term.",
                    variant: "destructive",
                  });
                }
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
