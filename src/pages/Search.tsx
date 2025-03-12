
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { llmConcepts, Concept } from '@/data/llmConcepts';
import SearchResults from '@/components/SearchResults';
import Navbar from '@/components/Navbar';

const Search: React.FC = () => {
  const { searchTerm = '' } = useParams<{ searchTerm: string }>();
  const [searchResults, setSearchResults] = useState<Concept[]>([]);
  
  useEffect(() => {
    // Scroll to top when search term changes
    window.scrollTo(0, 0);
    
    if (searchTerm) {
      // Normalize the search term
      const normalizedSearchTerm = decodeURIComponent(searchTerm).toLowerCase();
      
      // Filter concepts based on search term
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
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 mx-auto pt-24 pb-16">
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
