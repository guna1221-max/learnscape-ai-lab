
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { ScientificCalculator } from "@/components/tools/ScientificCalculator";
import { Multimeter } from "@/components/tools/Multimeter";
import { School, BookOpen, FlaskConical } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <School className="h-6 w-6 text-primary" />
          <Link to="/" className="text-xl font-bold tracking-tighter">
            Creative<span className="text-primary">thinkers</span> Lab
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link to="/physics" className="text-sm font-medium transition-colors hover:text-primary">
            Physics Lab
          </Link>
          <Link to="/algorithms" className="text-sm font-medium transition-colors hover:text-primary">
            Algorithm Lab
          </Link>
          <Link to="/tutor" className="text-sm font-medium transition-colors hover:text-primary">
            AI Tutor
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <ScientificCalculator />
            <Multimeter />
          </div>
          <ModeToggle />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 pb-6 border-b">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-sm font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/physics" 
              className="text-sm font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Physics Lab
            </Link>
            <Link 
              to="/algorithms" 
              className="text-sm font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Algorithm Lab
            </Link>
            <Link 
              to="/tutor" 
              className="text-sm font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Tutor
            </Link>
            <div className="flex gap-2">
              <ScientificCalculator />
              <Multimeter />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
