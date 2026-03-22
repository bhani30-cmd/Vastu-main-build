import React, { useState, useEffect } from 'react';
import { publicAPI } from '../services/api';
import { CheckCircle, Compass, Paintbrush, Hammer, RefreshCw, Sun, Wind, LayoutPanelLeft, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const services = [
  {
    title: 'Architectural Design (Vastu-Aligned)',
    icon: Compass,
    items: [
      'Site-responsive planning',
      'Practical zoning & orientation',
      'Efficient layouts and circulation',
      'Contemporary architectural language',
    ],
  },
  {
    title: 'Interior Design',
    icon: Paintbrush,
    items: [
      'Residential, commercial & office interiors',
      'Material-driven modern design',
      'Lighting & spatial optimization',
      'Detailed working drawings',
    ],
  },
  {
    title: 'Turnkey Design & Build',
    icon: Hammer,
    items: [
      'Single-point responsibility',
      'Detailed BOQs & transparent costing',
      'Vendor & site coordination',
      'Quality-controlled execution',
    ],
  },
  {
    title: 'Renovation & Space Optimization',
    icon: RefreshCw,
    items: [
      'Layout improvements',
      'Practical Vastu corrections',
      'Minimal demolition solutions',
      'Phased execution',
    ],
  },
];

const vastuPoints = [
  { icon: LayoutPanelLeft, label: 'Functional zoning' },
  { icon: Sun, label: 'Natural light & ventilation' },
  { icon: Wind, label: 'Climate-responsive planning' },
  { icon: MapPin, label: 'Logical orientation of spaces' },
];

const Services = () => {
  const [capabilities, setCapabilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const capRes = await publicAPI.getCapabilities();
      setCapabilities(capRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="services-page">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-orange-400 font-semibold tracking-widest uppercase text-sm mb-3">What We Do</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Our <span className="text-orange-500">Services</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl">
            Comprehensive design, construction and renovation solutions rooted in modern aesthetics and practical Vastu principles.
          </p>
        </div>
      </div>

      {/* Core Services */}
      <div className="max-w-7xl mx-auto px-4 py-16" data-testid="core-services">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="bg-white border border-gray-100 rounded-xl p-7 shadow-sm hover:shadow-lg transition-shadow duration-300"
                data-testid={`service-card-${svc.title.toLowerCase().replace(/[^a-z]+/g, '-')}`}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{svc.title}</h3>
                </div>
                <ul className="space-y-3">
                  {svc.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
                      <CheckCircle className="text-orange-500 mt-0.5 flex-shrink-0" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vastu Section */}
      <div className="bg-gray-900 text-white py-20" data-testid="vastu-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="text-orange-400 font-semibold tracking-widest uppercase text-sm mb-3">Modern & Practical</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Our Approach to <span className="text-orange-500">Vastu</span>
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                We treat Vastu as a planning tool, not a restriction. Our method focuses on functional zoning, natural light, ventilation, climate-responsive planning and logical orientation of spaces.
              </p>
              <p className="text-gray-300 leading-relaxed mb-8">
                We adapt Vastu principles to suit modern apartments, villas, offices, and retail spaces, ensuring comfort, usability, and design harmony.
              </p>
              <div className="inline-block bg-orange-500/10 border border-orange-500/30 rounded-lg px-5 py-3">
                <p className="text-orange-400 font-semibold italic">
                  "Design always leads. Vastu supports."
                </p>
              </div>
            </div>

            {/* Right – focus areas */}
            <div className="grid grid-cols-2 gap-5">
              {vastuPoints.map((vp) => {
                const VIcon = vp.icon;
                return (
                  <div
                    key={vp.label}
                    className="bg-gray-800 rounded-xl p-6 hover:bg-gray-800/80 transition-colors"
                  >
                    <VIcon className="text-orange-500 mb-3" size={28} />
                    <p className="text-white font-semibold text-sm">{vp.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Construction Capabilities */}
      <div className="max-w-7xl mx-auto px-4 py-16" data-testid="capabilities-grid">
        <div className="text-center mb-12">
          <p className="text-orange-500 font-semibold tracking-widest uppercase text-sm mb-2">Expertise</p>
          <h2 className="text-3xl font-bold text-gray-900">Construction Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((cap) => (
            <div
              key={cap._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              data-testid={`capability-card-${cap._id}`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={cap.image}
                  alt={cap.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="text-orange-500 flex-shrink-0" size={18} />
                  {cap.title}
                </h3>
                {cap.description && (
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed">{cap.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-orange-500 py-14">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Ready to Start Your Project?</h2>
          <p className="text-white/80 text-base md:text-lg mb-8">Get in touch with us for a consultation and quote</p>
          <Link to="/contact">
            <Button className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-8 py-3 text-base" data-testid="services-contact-cta">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
