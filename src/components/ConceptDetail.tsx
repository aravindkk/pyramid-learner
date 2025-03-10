
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConceptById, getChildConcepts, getParentConcepts, Concept } from '@/data/llmConcepts';
import { cn } from '@/lib/utils';
import { ChevronRight, ArrowRight, Layers, ArrowUp, ArrowDown } from 'lucide-react';

interface ConceptDetailProps {
  conceptId: string;
}

const ConceptDetail: React.FC<ConceptDetailProps> = ({ conceptId }) => {
  const [concept, setConcept] = useState<Concept | null>(null);
  const [childConcepts, setChildConcepts] = useState<Concept[]>([]);
  const [parentConcepts, setParentConcepts] = useState<Concept[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading time for smooth transitions
    setIsLoaded(false);
    
    setTimeout(() => {
      const foundConcept = getConceptById(conceptId);
      
      if (foundConcept) {
        setConcept(foundConcept);
        setChildConcepts(getChildConcepts(conceptId));
        setParentConcepts(getParentConcepts(conceptId));
        setIsLoaded(true);
      }
    }, 300);
  }, [conceptId]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
          <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
          <div className="h-32 bg-gray-200 rounded-md w-full"></div>
          <div className="h-24 bg-gray-200 rounded-md w-full"></div>
        </div>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Concept not found</h2>
        <p className="text-muted-foreground mb-4">
          The concept you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "transition-opacity duration-500 ease-in-out",
      isLoaded ? "opacity-100" : "opacity-0"
    )}>
      <div className="mb-6 flex flex-col">
        <div className="flex items-center space-x-2 mb-1">
          {concept.tags.map((tag, index) => (
            <span 
              key={index} 
              className="concept-tag bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-foreground animate-fade-in">
          {concept.title}
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {concept.description}
        </p>

        <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="prose prose-lg max-w-none">
            <p>{concept.content}</p>
          </div>
        </div>
      </div>

      {/* Concept Relationships */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {parentConcepts.length > 0 && (
          <div className="concept-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center mb-4">
              <ArrowUp className="w-5 h-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Parent Concepts</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              These concepts build upon {concept.title}
            </p>
            <div className="space-y-2">
              {parentConcepts.map((parentConcept) => (
                <button
                  key={parentConcept.id}
                  onClick={() => navigate(`/concept/${parentConcept.id}`)}
                  className="w-full text-left p-3 rounded-lg hover:bg-secondary flex items-center justify-between transition-colors"
                >
                  <span>{parentConcept.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        )}

        {childConcepts.length > 0 && (
          <div className="concept-card animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center mb-4">
              <ArrowDown className="w-5 h-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">Child Concepts</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              These concepts make up {concept.title}
            </p>
            <div className="space-y-2">
              {childConcepts.map((childConcept) => (
                <button
                  key={childConcept.id}
                  onClick={() => navigate(`/concept/${childConcept.id}`)}
                  className="w-full text-left p-3 rounded-lg hover:bg-secondary flex items-center justify-between transition-colors"
                >
                  <span>{childConcept.title}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 border-t pt-8 flex justify-between items-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:text-primary/80 transition-colors inline-flex items-center"
        >
          <Layers className="w-4 h-4 mr-2" />
          View Full Pyramid
        </button>
        
        {childConcepts.length > 0 && (
          <button
            onClick={() => navigate(`/concept/${childConcepts[0].id}`)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg inline-flex items-center transition-colors"
          >
            <span>Explore Components</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ConceptDetail;
