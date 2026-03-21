import React from 'react';
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
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
            <div className="flex gap-3 mt-6">
              <a href="#" className="bg-orange-500 hover:bg-orange-600 p-2 rounded transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-orange-500 hover:bg-orange-600 p-2 rounded transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-orange-500 hover:bg-orange-600 p-2 rounded transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="bg-orange-500 hover:bg-orange-600 p-2 rounded transition-colors">
                <Youtube size={18} />
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
              <li className="text-gray-400 text-sm">Excavation Works</li>
              <li className="text-gray-400 text-sm">Steel Structure Works</li>
              <li className="text-gray-400 text-sm">RCC Works</li>
              <li className="text-gray-400 text-sm">Industrial Sheds</li>
              <li className="text-gray-400 text-sm">MEP Works</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-gray-400 text-sm">
                  Noida, Delhi, Gurugram, Lucknow, Jaipur
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-orange-500 flex-shrink-0" />
                <a href="tel:+91-0120-2651155" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                  +91-0120-2651155
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
