import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../services/api';

const QuoraIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    width="18" 
    height="18" 
    fill="currentColor"
  >
    <path d="M12.738 18.701c-.831 0-1.416-.6-1.416-1.433 0-.778.576-1.407 1.398-1.407.84 0 1.434.629 1.434 1.407 0 .833-.603 1.433-1.416 1.433M14.548 9.444c1.474 0 2.681 1.198 2.681 2.681a2.674 2.674 0 0 1-2.681 2.681h-.033c.25.638.594 1.188.997 1.638h4.786c.447 0 .801-.36.801-.801V3.357a.801.801 0 0 0-.801-.801H3.357a.801.801 0 0 0-.801.801v12.286c0 .447.36.801.801.801h6.492c.015-.021.03-.042.046-.063-.609-.625-1.053-1.357-1.277-2.116a2.682 2.682 0 0 1-1.544-2.419c0-1.483 1.198-2.681 2.681-2.681h3.793zm-1.681 2.087c-.48 0-.87.39-.87.87s.39.87.87.87.87-.39.87-.87-.39-.87-.87-.87z"/>
  </svg>
);

const Footer = () => {
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await publicAPI.getCompanyInfo();
      setCompanyInfo(response.data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const socialLinks = companyInfo?.social_links || {};
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-orange-500">VASTUNIRMANA</span>
              <br />
              <span className="text-white">PROJECTS</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              One of the top Construction Companies in Northern India, having successfully completed over 100 building projects.
            </p>
            <div className="flex gap-3 mt-6 flex-wrap">
              <a 
                href={socialLinks.facebook || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-orange-500 hover:bg-orange-600 p-2 rounded transition-colors" 
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href={socialLinks.twitter || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-orange-500 hover:bg-orange-600 p-2 rounded transition-colors" 
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href={socialLinks.linkedin || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-orange-500 hover:bg-orange-600 p-2 rounded transition-colors" 
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href={socialLinks.youtube || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-orange-500 hover:bg-orange-600 p-2 rounded transition-colors" 
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a 
                href={socialLinks.instagram || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-orange-500 hover:bg-orange-600 p-2 rounded transition-colors" 
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href={socialLinks.quora || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-orange-500 hover:bg-orange-600 p-2 rounded transition-colors" 
                aria-label="Quora"
              >
                <QuoraIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">About Us</Link></li>
              <li><Link to="/projects" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Our Projects</Link></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Resources</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">Architectural Design</li>
              <li className="text-gray-400 text-sm">Interior Design</li>
              <li className="text-gray-400 text-sm">Turnkey Design & Build</li>
              <li className="text-gray-400 text-sm">Renovation & Space Optimisation</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-gray-400 text-sm">
                  Plot No.7 Lower Ground Floor Saidulajab Saket
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-orange-500 flex-shrink-0" />
                <a href="tel:+91-9873041716" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                  +91-9873041716
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-orange-500 flex-shrink-0" />
                <a href="mailto:office@vastunirmana.com" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                  office@vastunirmana.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Vastunirmana Projects Pvt. Ltd. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
