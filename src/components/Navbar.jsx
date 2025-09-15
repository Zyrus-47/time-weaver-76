import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navLinks = [{
    href: '/',
    label: 'Home'
  }, {
    href: '/about',
    label: 'About'
  }, {
    href: '/login',
    label: 'Login'
  }];
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">ChronoClass</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => 
              <Link 
                key={link.href} 
                to={link.href} 
                className={`transition-colors duration-200 hover:opacity-90 ${
                  isActive(link.href) 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            )}
            <Button asChild variant="default" className="bg-gradient-primary shadow-sm hover:shadow-md hover:opacity-95 transition-shadow">
              <Link to="/create">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-muted-foreground">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/80 backdrop-blur border-t supports-[backdrop-filter]:bg-card/70">
              {navLinks.map(link => 
                <Link 
                  key={link.href} 
                  to={link.href} 
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.href) 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`} 
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )}
              <div className="px-3 py-2">
                <Button asChild variant="default" className="w-full bg-gradient-primary shadow-sm">
                  <Link to="/create" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;