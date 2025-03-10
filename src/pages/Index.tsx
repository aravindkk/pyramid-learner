
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Layers, Lightbulb } from 'lucide-react';
import ConceptPyramid from '@/components/ConceptPyramid';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);

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

    const elements = document.querySelectorAll('.reveal-animation');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={cn(
              "transition-all duration-1000 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            )}>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
                <Lightbulb className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">First Principles Learning</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Learn anything through the
                <span className="text-primary block">Pyramid of Knowledge</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Break down complex concepts into fundamental building blocks. Each level of the pyramid builds on the foundations below it, creating true understanding.
              </p>
              
              <button
                onClick={() => navigate('/concept/llm')}
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <span>Start Learning</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            
            <div className={cn(
              "transition-all duration-1000 delay-300 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            )}>
              <div className="pyramid-display relative animate-float">
                <ConceptPyramid maxLevels={4} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Learn with Pyramids?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our pyramid approach helps you build robust mental models and true understanding of complex topics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Layers className="w-8 h-8 text-primary" />}
              title="Hierarchical Learning"
              description="Start with fundamental concepts and build upward. Each concept is supported by the concepts beneath it."
              delay={0}
            />
            
            <FeatureCard
              icon={<Brain className="w-8 h-8 text-primary" />}
              title="Mental Models"
              description="Develop powerful mental models that help you understand and remember complex ideas more effectively."
              delay={0.2}
            />
            
            <FeatureCard
              icon={<Lightbulb className="w-8 h-8 text-primary" />}
              title="Deeper Understanding"
              description="Don't just memorize facts. Truly understand concepts by learning their fundamental building blocks."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Example Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal-animation">
            <h2 className="text-3xl font-bold mb-4">Explore Large Language Models</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how LLMs work by exploring their hierarchical components. From foundational neural networks to advanced attention mechanisms.
            </p>
          </div>
          
          <div className="flex justify-center reveal-animation" style={{ transitionDelay: "0.2s" }}>
            <button
              onClick={() => navigate('/concept/llm')}
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <span>Explore LLM Pyramid</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Layers className="h-5 w-5" />
            <span className="font-semibold">PyramidLearner</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PyramidLearner. Designed for deeper understanding.
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="concept-card hover-lift reveal-animation"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
