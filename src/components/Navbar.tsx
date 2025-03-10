
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { BookOpen, Layers, Home } from "lucide-react";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ease-in-out",
        scrolled 
          ? "navbar-glass shadow-sm py-3" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-foreground hover:opacity-80 transition-opacity"
        >
          <Layers className="h-6 w-6" />
          <span className="font-semibold text-lg">PyramidLearner</span>
        </Link>

        <div className="flex items-center space-x-8">
          <NavLink to="/" active={location.pathname === "/"}>
            <Home className="w-4 h-4 mr-1" />
            <span>Home</span>
          </NavLink>
          
          <NavLink to="/concept/llm" active={location.pathname.includes("/concept")}>
            <BookOpen className="w-4 h-4 mr-1" />
            <span>Learn</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center text-sm font-medium transition-all relative px-1 py-2",
        active 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
      <span 
        className={cn(
          "absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform duration-300",
          active && "scale-x-100"
        )} 
      />
    </Link>
  );
};

export default Navbar;
