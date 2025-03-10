
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ConceptDetail from '@/components/ConceptDetail';
import ConceptPyramid from '@/components/ConceptPyramid';
import { getConceptById } from '@/data/llmConcepts';
import Navbar from '@/components/Navbar';

const Concept: React.FC = () => {
  const { conceptId = 'llm' } = useParams<{ conceptId: string }>();
  
  // Scroll to top when concept changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [conceptId]);

  const concept = getConceptById(conceptId);
  const conceptLevel = concept?.level || 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 mx-auto pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <ConceptDetail conceptId={conceptId} />
          </div>
          
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <div className="glass-card rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Learning Pyramid</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Click on any concept to navigate through the learning pyramid
                </p>
                <div className="max-h-[500px] overflow-y-auto pr-2">
                  <ConceptPyramid 
                    maxLevels={conceptLevel + 1 > 4 ? 4 : conceptLevel + 1} 
                    selectedConceptId={conceptId} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Concept;
