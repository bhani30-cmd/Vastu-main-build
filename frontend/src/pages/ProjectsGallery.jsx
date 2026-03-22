import React, { useState, useEffect, useCallback } from 'react';
import { publicAPI } from '../services/api';
import { X, ChevronLeft, ChevronRight, Maximize2, Grid3X3, LayoutGrid, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProjectsGallery = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [gridCols, setGridCols] = useState(3);
  const [pageContent, setPageContent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const [projRes, pageRes] = await Promise.all([
        publicAPI.getProjects(),
        publicAPI.getPageContent('projects').catch(() => null)
      ]);
      const data = projRes.data;
      setProjects(data);
      setFilteredProjects(data);
      const uniqueCats = ['All', ...new Set(data.map(p => p.category))];
      setCategories(uniqueCats);
      if (pageRes?.data) setPageContent(pageRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === category));
    }
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % filteredProjects.length);
  }, [filteredProjects.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  }, [filteredProjects.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goNext, goPrev]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  const currentProject = filteredProjects[lightboxIndex];

  return (
    <div className="min-h-screen bg-gray-50" data-testid="projects-gallery">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,140,50,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <p className="text-orange-400 font-semibold tracking-widest uppercase text-sm mb-3">Our Portfolio</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            {pageContent?.content?.hero_title || <>Project <span className="text-orange-500">Gallery</span></>}
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl">
            {pageContent?.content?.hero_subtitle || 'Explore our portfolio of successfully delivered construction projects across Northern India.'}
          </p>
          <div className="mt-6 flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">{projects.length}</span>
              <span className="text-gray-400">Total Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">{categories.length - 1}</span>
              <span className="text-gray-400">Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter + View Controls */}
      <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2" data-testid="category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilter(cat)}
                  data-testid={`filter-${cat.toLowerCase()}`}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                  {cat !== 'All' && (
                    <span className="ml-1.5 opacity-70">
                      ({projects.filter(p => p.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setGridCols(2)}
                className={`p-2 rounded-md transition-colors ${gridCols === 2 ? 'bg-white shadow text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                data-testid="grid-2-cols-btn"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 rounded-md transition-colors ${gridCols === 3 ? 'bg-white shadow text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                data-testid="grid-3-cols-btn"
              >
                <Grid3X3 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-500 mb-6" data-testid="projects-count">
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>

        {filteredProjects.length > 0 ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols === 3 ? 'lg:grid-cols-3' : ''} gap-6`}>
            {filteredProjects.map((project, index) => (
              <div
                key={project._id}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => navigate(`/projects/${project._id}`)}
                data-testid={`project-card-${index}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-5 w-full">
                      <p className="text-white text-sm mb-1">{project.description}</p>
                      <p className="text-orange-300 text-xs">Client: {project.client}</p>
                    </div>
                  </div>
                  {/* View detail icon */}
                  <div className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink size={16} />
                  </div>
                  {/* Lightbox icon */}
                  <button
                    onClick={(e) => { e.stopPropagation(); openLightbox(index); }}
                    className="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-orange-500"
                    data-testid={`lightbox-btn-${index}`}
                  >
                    <Maximize2 size={16} />
                  </button>
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors text-lg">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Grid3X3 size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-xl text-gray-500">No projects found in this category.</p>
          </div>
        )}
      </div>

      {/* Category Links */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Browse by <span className="text-orange-500">Category</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Residential', path: '/projects/residential', desc: 'Homes & Apartments' },
              { name: 'Commercial', path: '/projects/commercial', desc: 'Offices & IT Parks' },
              { name: 'Office', path: '/projects/office', desc: 'Workspaces' },
              { name: 'Retail', path: '/projects/retail', desc: 'Shops & Malls' },
            ].map((cat) => (
              <Link
                key={cat.path}
                to={cat.path}
                className="group bg-gray-800 hover:bg-orange-500 rounded-xl p-6 text-center transition-all duration-300"
                data-testid={`category-link-${cat.name.toLowerCase()}`}
              >
                <h3 className="text-white font-bold text-lg mb-1 group-hover:scale-105 transition-transform">{cat.name}</h3>
                <p className="text-gray-400 group-hover:text-white/80 text-sm">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentProject && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          data-testid="lightbox-overlay"
        >
          <div
            className="relative max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors z-10"
              data-testid="lightbox-close-btn"
            >
              <X size={28} />
            </button>

            {/* Image */}
            <div className="relative flex-1 flex items-center justify-center">
              <img
                src={currentProject.image}
                alt={currentProject.title}
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
                data-testid="lightbox-image"
              />

              {/* Navigation arrows */}
              {filteredProjects.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-orange-500 text-white p-3 rounded-full transition-all"
                    data-testid="lightbox-prev-btn"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-orange-500 text-white p-3 rounded-full transition-all"
                    data-testid="lightbox-next-btn"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Info panel */}
            <div className="mt-4 bg-gray-900/80 backdrop-blur rounded-lg p-5" data-testid="lightbox-info">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">{currentProject.category}</span>
                  <h3 className="text-white text-2xl font-bold mt-1">{currentProject.title}</h3>
                  <p className="text-gray-300 text-sm mt-2">{currentProject.description}</p>
                  <p className="text-orange-400 text-sm mt-2">Client: {currentProject.client}</p>
                </div>
                <div className="text-white/50 text-sm whitespace-nowrap">
                  {lightboxIndex + 1} / {filteredProjects.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsGallery;
