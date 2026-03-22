import React, { useState, useEffect } from 'react';
import { publicAPI } from '../services/api';
import { Building2, Users, Award, TrendingUp } from 'lucide-react';

const AboutUs = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const response = await publicAPI.getPageContent('about');
      setPageContent(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching page content:', error);
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">
            {pageContent?.content?.hero_title || 'About Us'}
          </h1>
          <p className="text-xl text-gray-300">
            {pageContent?.content?.hero_subtitle || 'Building Excellence Since 1986'}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <Building2 size={40} className="mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-sm">Projects Completed</div>
            </div>
            <div>
              <Users size={40} className="mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-sm">Happy Clients</div>
            </div>
            <div>
              <Award size={40} className="mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">35+</div>
              <div className="text-sm">Years Experience</div>
            </div>
            <div>
              <TrendingUp size={40} className="mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">ISO</div>
              <div className="text-sm">Certified Company</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {pageContent?.content?.sections?.map((section, index) => (
          <div key={index} className={`mb-12 ${index % 2 === 1 ? 'bg-gray-50 p-8 rounded-lg' : ''}`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{section.content}</p>
          </div>
        ))}

        {/* Default Content if no sections */}
        {(!pageContent?.content?.sections || pageContent.content.sections.length === 0) && (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Established in 1986, Vastunirmana Projects Pvt. Ltd. is one of the top construction 
                companies in Northern India, with a presence across major cities such as Delhi, Noida, 
                Gurugram, Lucknow, Jaipur, Kanpur, Faridabad, and beyond, spanning Haryana, Rajasthan, 
                Madhya Pradesh, and Uttar Pradesh.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Over the past three decades, we have proudly delivered numerous civil construction projects, 
                ranging from industrial and residential developments to specialized structures.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our deep expertise in the construction industry, coupled with effective labor management, 
                has enabled us to provide unparalleled civil construction services. This has cemented our 
                reputation as one of the top civil contractors in Gurgaon, Delhi, Noida, NCR, Haryana, 
                Uttar Pradesh, and Madhya Pradesh.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Health & Safety Commitment</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                At Vastunirmana Projects, we prioritize the health and safety of our workforce and stakeholders. 
                We have a team of dedicated safety officers and engineers who rigorously implement and monitor 
                our Health & Safety policies.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology and Innovation</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Leveraging cutting-edge technology and modern equipment, we aim to make the construction 
                process as rewarding as the finished product. Our comprehensive design-and-build services 
                reflect our commitment to delivering projects that align with our clients' visions.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Vision & Mission */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-orange-500">Our Vision</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                To be the most trusted and preferred construction company in Northern India, 
                delivering world-class infrastructure and exceeding client expectations.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4 text-orange-500">Our Mission</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                To provide innovative, sustainable, and quality construction solutions while 
                maintaining the highest standards of safety, integrity, and professionalism.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
