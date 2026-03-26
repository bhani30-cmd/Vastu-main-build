import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { ArrowLeft, MapPin, Calendar, Ruler, ChevronLeft, ChevronRight, X, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import * as mock from '../data/mockData';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [quoteForm, setQuoteForm] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await publicAPI.getProjectById(projectId);
      setProject(response.data);
      setLoading(false);
    } catch {
      const all = mock.projects.map((p) => ({ ...p, _id: String(p.id) }));
      const found = all.find((p) => p._id === projectId);
      if (found) {
        const related = all.filter((p) => p.category === found.category && p._id !== found._id).slice(0, 3);
        setProject({ ...found, related_projects: related, gallery_images: found.gallery_images || [] });
      } else {
        setProject(null);
      }
      setLoading(false);
    }
  };

  const allImages = project ? [project.image, ...(project.gallery_images || [])].filter(Boolean) : [];

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
    setLightboxIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

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

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await publicAPI.submitContact({
        ...quoteForm,
        subject: `Quote Request: ${project.title}`,
        message: `Project: ${project.title}\nCategory: ${project.category}\n\n${quoteForm.message}`
      });
      toast.success('Quote request sent successfully! We will contact you soon.');
      setQuoteOpen(false);
      setQuoteForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-500">Project not found</p>
        <Link to="/projects" className="text-orange-500 hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Gallery
        </Link>
      </div>
    );
  }

  const highlights = project.highlights || [];
  const relatedProjects = project.related_projects || [];

  return (
    <div className="min-h-screen bg-white" data-testid="project-detail">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          data-testid="project-hero-image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white bg-black/30 backdrop-blur px-4 py-2 rounded-full text-sm transition-colors"
            data-testid="back-to-gallery-link"
          >
            <ArrowLeft size={16} /> Back to Gallery
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              {project.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2" data-testid="project-title">
              {project.title}
            </h1>
            <p className="text-white/70 text-base md:text-lg max-w-2xl">{project.description}</p>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap gap-6 md:gap-10 items-center justify-between">
          <div className="flex flex-wrap gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-sm">
              <Star className="text-orange-400" size={18} />
              <span className="text-gray-400">Client:</span>
              <span className="font-semibold" data-testid="project-client">{project.client}</span>
            </div>
            {project.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="text-orange-400" size={18} />
                <span className="text-gray-400">Location:</span>
                <span className="font-semibold" data-testid="project-location">{project.location}</span>
              </div>
            )}
            {project.area && (
              <div className="flex items-center gap-2 text-sm">
                <Ruler className="text-orange-400" size={18} />
                <span className="text-gray-400">Area:</span>
                <span className="font-semibold" data-testid="project-area">{project.area}</span>
              </div>
            )}
            {project.completion_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="text-orange-400" size={18} />
                <span className="text-gray-400">Completed:</span>
                <span className="font-semibold" data-testid="project-completion">{project.completion_date}</span>
              </div>
            )}
          </div>
          <Button
            onClick={() => setQuoteOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6"
            data-testid="request-quote-btn"
          >
            Request Quote
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Project Scope */}
            {project.scope && (
              <section data-testid="project-scope">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Scope</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{project.scope}</p>
              </section>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <section data-testid="project-highlights">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                      <span className="text-gray-700 text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Image Gallery */}
            {allImages.length > 1 && (
              <section data-testid="project-gallery">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allImages.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
                      onClick={() => openLightbox(index)}
                      data-testid={`gallery-image-${index}`}
                    >
                      <img
                        src={img}
                        alt={`${project.title} - ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <div className="bg-gray-900 text-white rounded-xl p-6" data-testid="quote-sidebar">
              <h3 className="text-xl font-bold mb-2">Interested in a Similar Project?</h3>
              <p className="text-gray-400 text-sm mb-5">
                Get a free consultation and detailed quote for your construction needs.
              </p>
              <Button
                onClick={() => setQuoteOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 font-semibold"
                data-testid="sidebar-quote-btn"
              >
                Request Quote
              </Button>
            </div>

            {/* Project Info Card */}
            <div className="border border-gray-200 rounded-xl p-6" data-testid="project-info-card">
              <h3 className="text-lg font-bold mb-4">Project Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Category</dt>
                  <dd className="font-semibold text-gray-900">{project.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Client</dt>
                  <dd className="font-semibold text-gray-900">{project.client}</dd>
                </div>
                {project.location && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Location</dt>
                    <dd className="font-semibold text-gray-900">{project.location}</dd>
                  </div>
                )}
                {project.area && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Area</dt>
                    <dd className="font-semibold text-gray-900">{project.area}</dd>
                  </div>
                )}
                {project.completion_date && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Completed</dt>
                    <dd className="font-semibold text-gray-900">{project.completion_date}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Status</dt>
                  <dd className="font-semibold text-green-600">Completed</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Related <span className="text-orange-500">Projects</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6" data-testid="related-projects">
              {relatedProjects.map((rp) => (
                <Link
                  key={rp._id}
                  to={`/projects/${rp._id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                  data-testid={`related-project-${rp._id}`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={rp.image}
                      alt={rp.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-orange-500 text-xs font-bold uppercase">{rp.category}</span>
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors mt-1">
                      {rp.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{rp.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Start Your Project?</h2>
          <p className="text-white/80 mb-6">Contact us today for a free consultation</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setQuoteOpen(true)}
              className="bg-white text-orange-500 hover:bg-gray-100 font-semibold px-8"
              data-testid="bottom-cta-quote-btn"
            >
              Request Quote
            </Button>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quote Dialog */}
      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="max-w-lg" data-testid="quote-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Request a Quote</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 -mt-2 mb-2">
            For project: <span className="font-semibold text-orange-500">{project.title}</span>
          </p>
          <form onSubmit={handleQuoteSubmit} className="space-y-4">
            <div>
              <Label htmlFor="q-name">Full Name *</Label>
              <Input
                id="q-name"
                value={quoteForm.name}
                onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                required
                placeholder="Your name"
                data-testid="quote-name-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="q-email">Email *</Label>
                <Input
                  id="q-email"
                  type="email"
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                  required
                  placeholder="you@email.com"
                  data-testid="quote-email-input"
                />
              </div>
              <div>
                <Label htmlFor="q-phone">Phone *</Label>
                <Input
                  id="q-phone"
                  type="tel"
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                  required
                  placeholder="+91-XXXXXXXXXX"
                  data-testid="quote-phone-input"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="q-message">Project Requirements *</Label>
              <Textarea
                id="q-message"
                value={quoteForm.message}
                onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                required
                rows={4}
                placeholder="Tell us about your project requirements, budget, and timeline..."
                data-testid="quote-message-input"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 font-semibold"
              disabled={submitting}
              data-testid="quote-submit-btn"
            >
              {submitting ? 'Sending...' : 'Submit Quote Request'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          data-testid="detail-lightbox"
        >
          <div className="relative max-w-5xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white/70 hover:text-white"
              data-testid="detail-lightbox-close"
            >
              <X size={28} />
            </button>
            <img
              src={allImages[lightboxIndex]}
              alt={`${project.title} - ${lightboxIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg"
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-orange-500 text-white p-3 rounded-full"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-orange-500 text-white p-3 rounded-full"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <div className="text-center text-white/50 mt-3 text-sm">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
