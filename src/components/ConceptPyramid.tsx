
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConceptsByLevel, Concept } from '@/data/llmConcepts';
import { cn } from '@/lib/utils';

interface ConceptPyramidProps {
  maxLevels?: number;
  selectedConceptId?: string;
}

const ConceptPyramid: React.FC<ConceptPyramidProps> = ({ 
  maxLevels = 4, 
  selectedConceptId 
}) => {
  const navigate = useNavigate();
  const pyramidRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = (concept: Concept) => {
    navigate(`/concept/${concept.id}`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (pyramidRef.current) {
      const nodes = pyramidRef.current.querySelectorAll('.reveal-animation');
      nodes.forEach((node) => observer.observe(node));
    }

    return () => observer.disconnect();
  }, []);

  // Generate pyramid levels
  const renderPyramidLevels = () => {
    const levels = [];

    for (let level = 1; level <= maxLevels; level++) {
      const concepts = getConceptsByLevel(level);
      const totalNodes = concepts.length;
      
      levels.push(
        <div
          key={`level-${level}`}
          className={cn(
            "flex justify-center items-center gap-4 reveal-animation",
            level > 1 && "mt-4"
          )}
          style={{ 
            transitionDelay: `${(level - 1) * 0.1}s`,
            zIndex: maxLevels - level + 1 
          }}
        >
          {concepts.map((concept, idx) => (
            <div
              key={concept.id}
              className={cn(
                "pyramid-node glass-card rounded-xl",
                selectedConceptId === concept.id ? "ring-2 ring-primary" : "",
                level === 1 ? "w-80 h-32" : level === 2 ? "w-56 h-28" : level === 3 ? "w-44 h-24" : "w-32 h-20"
              )}
              onClick={() => handleNodeClick(concept)}
              style={{
                animation: `float ${2 + (idx % 3)}s ease-in-out infinite`,
                animationDelay: `${idx * 0.2}s`,
              }}
            >
              <div className="pyramid-node-content p-4 flex flex-col items-center justify-center h-full">
                <span className="concept-tag bg-primary/10 text-primary mb-2">
                  {concept.tags[0]}
                </span>
                <h3 className={cn(
                  "font-medium text-center",
                  level === 1 ? "text-lg" : level === 2 ? "text-base" : "text-sm"
                )}>
                  {concept.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return levels;
  };

  return (
    <div 
      ref={pyramidRef}
      className="pyramid-container w-full flex flex-col items-center justify-center py-12"
    >
      {renderPyramidLevels()}
    </div>
  );
};

export default ConceptPyramid;
