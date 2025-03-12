
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Concept } from '@/data/llmConcepts';
import ConceptPyramid from './ConceptPyramid';

interface SearchResultsProps {
  searchTerm: string;
  concepts: Concept[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm, concepts }) => {
  const navigate = useNavigate();

  if (!concepts || concepts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No results found for "{searchTerm}"</h2>
        <p className="text-muted-foreground">
          Try searching for a different term or browse our existing concepts.
        </p>
        <button
          onClick={() => navigate('/concept/llm')}
          className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse LLM Concepts
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Results for "{searchTerm}"</h2>
      <div className="mb-8">
        <ConceptPyramid 
          maxLevels={4} 
          selectedConceptId={concepts[0]?.id}
          filterConcepts={concepts}
        />
      </div>
    </div>
  );
};

export default SearchResults;
