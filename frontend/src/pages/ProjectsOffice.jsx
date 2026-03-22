import React, { useState, useEffect } from 'react';
import { publicAPI } from '../services/api';
import { Briefcase } from 'lucide-react';

const ProjectsOffice = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Fetch both Commercial and Industrial as they often include offices
      const [commercialRes, institutionalRes] = await Promise.all([
        publicAPI.getProjects('Commercial'),
        publicAPI.getProjects('Institutional')
      ]);
      // Filter for office/workspace related projects
      const allProjects = [...commercialRes.data, ...institutionalRes.data];
      const officeProjects = allProjects.filter(p => 
        p.title.toLowerCase().includes('office') || 
        p.title.toLowerCase().includes('workspace') ||
        p.title.toLowerCase().includes('it park') ||
        p.description.toLowerCase().includes('office')
      );
      setProjects(officeProjects);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
          <div className="flex items-center gap-4 mb-4">
            <Briefcase size={48} />
            <h1 className="text-5xl font-bold">Office & Workspace Projects</h1>
          </div>
          <p className="text-xl text-gray-300">
            Designing productive work environments for modern businesses
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <p className="text-sm text-orange-500 font-semibold">Client: {project.client}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No office/workspace projects available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsOffice;
