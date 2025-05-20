
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const location = useLocation();
  
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-primary flex items-center">
            <FileText className="mr-2" />
            DocQuery
          </Link>
        </div>
        
        <nav className="flex space-x-4">
          <Link to="/documents">
            <Button 
              variant={location.pathname === '/documents' ? 'default' : 'ghost'}
              className={cn(
                "flex items-center", 
                location.pathname === '/documents' ? 'bg-primary text-white' : 'text-gray-700'
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </Button>
          </Link>
          
          <Link to="/ask">
            <Button 
              variant={location.pathname === '/ask' ? 'default' : 'ghost'}
              className={cn(
                "flex items-center", 
                location.pathname === '/ask' ? 'bg-primary text-white' : 'text-gray-700'
              )}
            >
              <Search className="mr-2 h-4 w-4" />
              Ask Query
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
