
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
          className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse LLM Concepts
        </button>
      </div>
    );
  }

  // Sort concepts by level to ensure the pyramid displays correctly
  const sortedConcepts = [...concepts].sort((a, b) => a.level - b.level);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Results for "{searchTerm}"</h2>
      {searchTerm.toLowerCase() !== 'transformer' && 
       searchTerm.toLowerCase() !== 'attention' && 
       !searchTerm.toLowerCase().includes('llm') && 
       !searchTerm.toLowerCase().includes('language model') && (
        <p className="text-muted-foreground mb-6">
          Showing related LLM concepts that might be relevant to your search.
        </p>
      )}
      
      <div className="mb-8">
        <ConceptPyramid 
          maxLevels={4} 
          selectedConceptId={concepts[0]?.id}
          filterConcepts={sortedConcepts}
        />
      </div>
      
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium">Found {concepts.length} concept(s):</h3>
        <ul className="space-y-3">
          {sortedConcepts.map(concept => (
            <li key={concept.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <a 
                href={`/concept/${concept.id}`}
                className="block"
              >
                <h4 className="text-lg font-medium text-primary">{concept.title}</h4>
                <p className="text-muted-foreground mt-1">{concept.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {concept.tags.map(tag => (
                    <span key={tag} className="bg-secondary/70 text-secondary-foreground text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchResults;
