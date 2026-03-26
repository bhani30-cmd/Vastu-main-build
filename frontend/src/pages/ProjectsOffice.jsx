import React, { useState, useEffect } from 'react';
import { publicAPI } from '../services/api';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as mock from '../data/mockData';

const ProjectsOffice = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const [projRes, pageRes] = await Promise.all([
        publicAPI.getProjects('Office'),
        publicAPI.getPageContent('projects-office').catch(() => null)
      ]);
      setProjects(projRes.data);
      if (pageRes?.data) setPageContent(pageRes.data);
      setLoading(false);
    } catch {
      const data = mock.projects
        .filter((p) => p.category === 'Office')
        .map((p) => ({ ...p, _id: String(p.id) }));
      setProjects(data);
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
    <div className="min-h-screen" data-testid="projects-office-page">
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-orange-400 font-semibold tracking-widest uppercase text-sm mb-3">Projects</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            {pageContent?.content?.hero_title || <>Office / <span className="text-orange-500">Workspace</span></>}
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl">
            {pageContent?.content?.hero_subtitle || 'Modern office interiors, co-working spaces and corporate campuses designed for productivity.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                data-testid={`office-project-${project._id}`}
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <span className="text-orange-500 text-xs font-bold uppercase">{project.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors mt-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
                  <p className="text-xs text-gray-400 mt-3">Client: {project.client}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Briefcase size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">No office projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsOffice;
