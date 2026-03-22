import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { publicAPI } from '../services/api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    { 
      name: 'PROJECTS', 
      path: '/projects',
      hasDropdown: true,
      submenu: [
        { name: 'All Projects', path: '/projects' },
        { name: 'Residential', path: '/projects/residential' },
        { name: 'Commercial', path: '/projects/commercial' },
        { name: 'Office/Workspace', path: '/projects/office' },
        { name: 'Retail', path: '/projects/retail' }
      ]
    },
    { name: 'SERVICES', path: '/services' },
    { name: 'CONTACT US', path: '/contact' }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await publicAPI.submitContact(contactForm);
      toast.success('Thank you! Your message has been sent successfully.');
      setContactDialogOpen(false);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/admin/login');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-800 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-end items-center text-sm">
          <div className="flex gap-3">
            <Button 
              size="sm" 
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-1 h-7"
              onClick={() => setContactDialogOpen(true)}
              data-send-query-btn
            >
              SEND QUERY
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-800 text-xs px-4 py-1 h-7"
              onClick={handleLoginClick}
            >
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
                link.hasDropdown ? (
                  <div 
                    key={link.path} 
                    className="relative"
                    onMouseEnter={() => setProjectsDropdownOpen(true)}
                    onMouseLeave={() => setProjectsDropdownOpen(false)}
                  >
                    <button className="text-sm font-semibold transition-colors hover:text-orange-500 flex items-center gap-1">
                      {link.name}
                      <ChevronDown size={16} />
                    </button>
                    {projectsDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                        {link.submenu.map((sublink) => (
                          <Link
                            key={sublink.path}
                            to={sublink.path}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-semibold transition-colors hover:text-orange-500 ${
                      location.pathname === link.path ? 'text-orange-500' : 'text-gray-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
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
                link.hasDropdown ? (
                  <div key={link.path}>
                    <div className="text-sm font-semibold text-gray-700 mb-2">{link.name}</div>
                    <div className="pl-4 space-y-2">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.path}
                          to={sublink.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-sm text-gray-600 hover:text-orange-500"
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
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
                )
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Contact Form Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Send Us a Query</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  required
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                  placeholder="What is your query about?"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                rows={5}
                placeholder="Tell us about your project requirements..."
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
