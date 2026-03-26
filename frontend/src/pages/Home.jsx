import React, { useState, useEffect } from 'react';
import HeroSlider from '../components/HeroSlider';
import SectionHeader from '../components/SectionHeader';
import { publicAPI } from '../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as mock from '../data/mockData';

const Home = () => {
  const [heroSlides, setHeroSlides] = useState([]);
  const [capabilities, setCapabilities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [homePage, setHomePage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Industrial', 'Commercial', 'Institutional', 'Residential'];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchProjects(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      const [slidesRes, capabilitiesRes, clientsRes, testimonialsRes, homeRes] = await Promise.all([
        publicAPI.getHeroSlides(),
        publicAPI.getCapabilities(),
        publicAPI.getClients(),
        publicAPI.getTestimonials(),
        publicAPI.getPageContent('home').catch(() => ({ data: null }))
      ]);
      
      setHeroSlides(slidesRes.data);
      setCapabilities(capabilitiesRes.data);
      setClients(clientsRes.data);
      setTestimonials(testimonialsRes.data);
      setHomePage(homeRes.data);
      
      await fetchProjects('All');
      setLoading(false);
    } catch {
      setHeroSlides(mock.heroSlides.map((s) => ({ ...s, _id: String(s.id) })));
      setCapabilities(mock.capabilities.map((c) => ({ ...c, _id: String(c.id) })));
      setClients(mock.clients.map((c) => ({ ...c, _id: String(c.id) })));
      setTestimonials(mock.testimonials.map((t) => ({ ...t, _id: String(t.id) })));
      setProjects(mock.projects.map((p) => ({ ...p, _id: String(p.id) })));
      setLoading(false);
    }
  };

  const fetchProjects = async (category) => {
    try {
      const response = await publicAPI.getProjects(category === 'All' ? null : category);
      setProjects(response.data);
    } catch {
      const all = mock.projects.map((p) => ({ ...p, _id: String(p.id) }));
      if (category && category !== 'All') {
        setProjects(all.filter((p) => p.category === category));
        return;
      }
      setProjects(all);
    }
  };

  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* Editable Homepage Content */}
      {homePage && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            {homePage.content?.hero_title || homePage.content?.hero_subtitle ? (
              <SectionHeader
                orangeText={homePage.content?.hero_title || ''}
                regularText={homePage.content?.hero_subtitle || ''}
              />
            ) : null}
            {homePage.content?.body && (
              <div
                className="prose max-w-none mt-8"
                dangerouslySetInnerHTML={{ __html: homePage.content.body }}
              />
            )}
          </div>
        </section>
      )}

      {/* Corporate Overview Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader orangeText="CORPORATE" regularText="OVERVIEW" isDark={true} />
          
          <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
            <div className="relative">
              <div className="absolute -left-8 top-0 w-32 h-full bg-orange-500" />
              <img
                src="https://images.unsplash.com/photo-1600313419152-c66124a3b727?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Corporate Building"
                className="relative z-10 w-full h-96 object-cover shadow-2xl"
              />
            </div>

            <div className="text-white">
              <p className="text-gray-300 leading-relaxed mb-6">
                Vastunirmana Projects Pvt. Ltd. is one of the top Construction Companies in Northern India, 
                having successfully completed over 100 building projects across major cities, including Noida, 
                Delhi, Gurugram (Gurgaon), Lucknow, Jaipur, Faridabad, Kanpur, and locations in Haryana, 
                Uttar Pradesh, Rajasthan, and Madhya Pradesh.
              </p>

              <h4 className="text-xl font-bold mb-4">Industrial Project & manufacturing plant</h4>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">›</span>
                  <span className="text-gray-300">Corporate offices & IT parks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">›</span>
                  <span className="text-gray-300">Heavy duty printing presses & Industrial buildings/ sheds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">›</span>
                  <span className="text-gray-300">Residential townships and multi storied towers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">›</span>
                  <span className="text-gray-300">Schools and Institutional buildings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">›</span>
                  <span className="text-gray-300">Many others (Click here to view some of our projects)</span>
                </li>
              </ul>

              <div className="bg-white text-gray-900 p-6 mt-8">
                <p className="text-sm leading-relaxed">
                  We are an <span className="font-bold">ISO 9001: 2015 | ISO 14001 : 2015 | ISO 45001: 2018</span> certified 
                  company implementing a strict quality, health and safety management system for executing our projects. 
                  Our emphasis on quality, timely delivery and professional project management ensures we are counted in the
                </p>
                <h3 className="text-xl font-bold text-center mt-4">
                  top civil construction companies in Delhi, Noida, Gurugram, Faridabad, Lucknow, Jaipur, Kanpur, 
                  Haryana, Rajasthan, MP & Uttar Pradesh
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader orangeText="ABOUT" regularText="US" />
          
          <div className="grid md:grid-cols-2 gap-12 items-start mt-12">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-24 h-full bg-orange-500" />
              <div className="relative z-10 bg-gray-800 aspect-video flex items-center justify-center">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed mb-6">
                Established in 1986, Vastunirmana Projects Pvt. Ltd. is a top construction companies in Northern India, 
                with a presence across major cities such as Delhi, Noida, Gurugram (Gurgaon), Lucknow, Jaipur, Kanpur, 
                Faridabad, and beyond, spanning Haryana, Rajasthan, Madhya Pradesh, and Uttar Pradesh. Over the past 
                three decades, we have proudly delivered numerous civil construction projects, ranging from industrial 
                and residential developments to specialized structures.
              </p>

              <p className="text-gray-700 leading-relaxed mb-6">
                Our diverse portfolio includes factories, industrial facilities, townships, schools, corporate offices, 
                IT parks, multi-storied buildings, specialized printing presses, residential towers, and more. Guided 
                by a commitment to excellence, our quality policy ensures the successful delivery of projects that meet 
                and often exceed international construction standards.
              </p>

              <h4 className="text-xl font-bold text-gray-900 mb-3">Why Choose Us?</h4>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our deep expertise in the construction industry, coupled with effective labor management, has enabled 
                us to provide unparalleled civil construction services. This has cemented our reputation as one of the 
                top civil contractors in Gurgaon, Delhi, Noida, NCR, Haryana, Uttar Pradesh, and Madhya Pradesh.
              </p>

              <h4 className="text-xl font-bold text-gray-900 mb-3">Health & Safety Commitment</h4>
              <p className="text-gray-700 leading-relaxed mb-6">
                At Vastunirmana Projects, we prioritize the health and safety of our workforce and stakeholders. To 
                ensure a safe working environment, we have a team of dedicated safety officers and engineers who 
                rigorously implement and monitor our Health & Safety (H&S) policies. These standards are integrated 
                into every project we undertake, making us a trusted name in the industry across Noida, Delhi, 
                Faridabad, Gurgaon, NCR, Lucknow, Kanpur, and other regions.
              </p>

              <h4 className="text-xl font-bold text-gray-900 mb-3">Technology and Innovation</h4>
              <p className="text-gray-700 leading-relaxed">
                Leveraging cutting-edge technology and modern equipment, we aim to make the construction process as 
                rewarding as the finished product. Our comprehensive design-and-build services reflect our commitment 
                to delivering projects that align with our clients' visions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader orangeText="OUR" regularText="CAPABILITIES" isDark={true} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {capabilities.map((capability) => (
              <div
                key={capability._id}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden aspect-video mb-4">
                  <img
                    src={capability.image}
                    alt={capability.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-white text-center font-semibold group-hover:text-orange-500 transition-colors">
                  {capability.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader orangeText="OUR" regularText="PROJECTS" />
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden aspect-video mb-4 shadow-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h4 className="text-sm font-bold text-orange-500 mb-1">{project.category}</h4>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader orangeText="OUR  ESTEEMED" regularText="CLIENTS" isDark={true} />
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-12">
            {clients.map((client) => (
              <div
                key={client._id}
                className="bg-white border-t-4 border-orange-500 p-6 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-w-full h-16 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader orangeText="CLIENT" regularText="TESTIMONIALS" />
            
            <div className="relative max-w-4xl mx-auto mt-12">
              <div className="bg-white p-12 shadow-xl relative">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={testimonials[currentTestimonial].logo}
                    alt={testimonials[currentTestimonial].company}
                    className="h-16 mb-6"
                  />
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {testimonials[currentTestimonial].position}
                  </p>
                  <p className="text-sm text-orange-500 font-semibold mb-6">
                    {testimonials[currentTestimonial].company}
                  </p>
                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                </div>

                {/* Navigation Arrows */}
                {testimonials.length > 1 && (
                  <>
                    <button
                      onClick={prevTestimonial}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-all"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-all"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Dots Navigation */}
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentTestimonial
                          ? 'bg-orange-500 w-8'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA Section */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-white text-lg mb-8">
            Contact us today for a consultation and let's build your dream together.
          </p>
          <button 
            onClick={() => {
              // Scroll to top and wait a bit, then the navbar component will handle it
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // Trigger the contact form after a short delay
              setTimeout(() => {
                const sendQueryBtn = document.querySelector('[data-send-query-btn]');
                if (sendQueryBtn) sendQueryBtn.click();
              }, 500);
            }}
            className="bg-white text-orange-500 px-8 py-3 rounded font-bold hover:bg-gray-100 transition-colors"
          >
            Send Query
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
