import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'OUR RESOURCES', path: '/resources' },
    { name: 'CONTACT US', path: '/contact' }
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="mailto:office@vastunirmana.com" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
              <Mail size={16} />
              <span className="hidden sm:inline">office@vastunirmana.com</span>
            </a>
            <a href="tel:+91-0120-2651155" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
              <Phone size={16} />
              <span className="hidden sm:inline">+91-0120-2651155</span>
            </a>
          </div>
          <div className="flex gap-3">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-1 h-7">
              SEND QUERY
            </Button>
            <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-800 text-xs px-4 py-1 h-7">
              LOGIN
            </Button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-orange-500">VASTUNIRMANA</span>
                <span className="text-3xl font-bold text-gray-600 ml-2">PROJECTS</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">ISO 9001 : 2015 | ISO 14001 : 2015 | ISO 45001 : 2018 Certified</p>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors hover:text-orange-500 ${
                    location.pathname === link.path ? 'text-orange-500' : 'text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-sm font-semibold transition-colors hover:text-orange-500 ${
                    location.pathname === link.path ? 'text-orange-500' : 'text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
