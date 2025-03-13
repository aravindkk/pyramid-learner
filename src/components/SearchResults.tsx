
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
  
  // Determine if these are likely AI-generated results (not in llmConcepts.ts)
  const isAIGenerated = concepts.some(concept => 
    concept.id.includes('-ai-') || concept.id.includes('ai-generated')
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Results for "{searchTerm}"</h2>
      
      {isAIGenerated ? (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-6">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            These are AI-generated LLM concepts related to your search term. They are not part of our core curriculum but may help you understand the connection to language models.
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground mb-6">
          Showing LLM concepts that match your search criteria.
        </p>
      )}
      
      {/* Always show the pyramid for search results */}
      <div className="mb-8">
        <ConceptPyramid 
          maxLevels={4} 
          selectedConceptId={null}
          filterConcepts={sortedConcepts}
        />
      </div>
      
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium">Found {concepts.length} concept(s):</h3>
        <ul className="space-y-3">
          {sortedConcepts.map(concept => (
            <li key={concept.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="block">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-primary">{concept.title}</h4>
                  <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                    Level {concept.level}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1">{concept.description}</p>
                <div className="mt-3">
                  <h5 className="text-sm font-medium mb-1">Content:</h5>
                  <p className="text-sm">{concept.content.length > 150 
                    ? `${concept.content.substring(0, 150)}...` 
                    : concept.content}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {concept.tags.map(tag => (
                    <span key={tag} className="bg-secondary/70 text-secondary-foreground text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {(concept.parentIds.length > 0 || concept.childrenIds.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                      {concept.parentIds.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Parent concepts: </span>
                          {concept.parentIds.join(', ')}
                        </div>
                      )}
                      {concept.childrenIds.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Child concepts: </span>
                          {concept.childrenIds.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchResults;
