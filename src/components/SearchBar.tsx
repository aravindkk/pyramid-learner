
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface SearchBarProps {
  className?: string;
  variant?: 'default' | 'navbar';
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className, 
  variant = 'default' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return;
    }

    const normalizedTerm = encodeURIComponent(searchTerm.trim());

    if (normalizedTerm) {
      navigate(`/search/${normalizedTerm}`);
      setSearchTerm('');
    } else {
      toast({
        title: "Invalid search term",
        description: "Please enter a valid search term",
        variant: "destructive"
      });
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={cn(
        "flex items-center relative",
        variant === 'navbar' ? 'w-full max-w-xs' : 'w-full max-w-md',
        className
      )}
    >
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a concept..."
          className={cn(
            "w-full bg-background/50 border border-input rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all",
            variant === 'navbar' ? 'h-9' : 'h-10'
          )}
        />
      </div>
      <button
        type="submit"
        className={cn(
          "ml-2 bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors",
          variant === 'navbar' ? 'h-9' : 'h-10'
        )}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
