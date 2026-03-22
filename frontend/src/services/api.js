import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API calls
export const publicAPI = {
  getHeroSlides: () => api.get('/public/hero-slides'),
  getCapabilities: () => api.get('/public/capabilities'),
  getProjects: (category) => api.get('/public/projects', { params: { category } }),
  getProjectById: (id) => api.get(`/public/projects/${id}`),
  getClients: () => api.get('/public/clients'),
  getTestimonials: () => api.get('/public/testimonials'),
  getCompanyInfo: () => api.get('/public/company-info'),
  submitContact: (data) => api.post('/public/contact', data),
  getPageContent: (pageName) => api.get(`/public/pages/${pageName}`)
};

// Admin API calls
export const adminAPI = {
  // Auth
  login: (credentials) => api.post('/admin/login', credentials),
  getMe: () => api.get('/admin/me'),
  
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  
  // Hero Slides
  getHeroSlides: () => api.get('/admin/hero-slides'),
  createHeroSlide: (data) => api.post('/admin/hero-slides', data),
  updateHeroSlide: (id, data) => api.put(`/admin/hero-slides/${id}`, data),
  deleteHeroSlide: (id) => api.delete(`/admin/hero-slides/${id}`),
  
  // Capabilities
  getCapabilities: () => api.get('/admin/capabilities'),
  createCapability: (data) => api.post('/admin/capabilities', data),
  updateCapability: (id, data) => api.put(`/admin/capabilities/${id}`, data),
  deleteCapability: (id) => api.delete(`/admin/capabilities/${id}`),
  
  // Projects
  getProjects: () => api.get('/admin/projects'),
  createProject: (data) => api.post('/admin/projects', data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),
  
  // Clients
  getClients: () => api.get('/admin/clients'),
  createClient: (data) => api.post('/admin/clients', data),
  updateClient: (id, data) => api.put(`/admin/clients/${id}`, data),
  deleteClient: (id) => api.delete(`/admin/clients/${id}`),
  
  // Testimonials
  getTestimonials: () => api.get('/admin/testimonials'),
  createTestimonial: (data) => api.post('/admin/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`),
  
  // Contacts
  getContacts: () => api.get('/admin/contacts'),
  updateContactStatus: (id, status) => api.put(`/admin/contacts/${id}?status=${status}`),
  deleteContact: (id) => api.delete(`/admin/contacts/${id}`),
  
  // Company Info
  getCompanyInfo: () => api.get('/admin/company-info'),
  updateCompanyInfo: (data) => api.put('/admin/company-info', data),
  
  // Page Management
  getPages: () => api.get('/admin/pages'),
  getPage: (pageName) => api.get(`/admin/pages/${pageName}`),
  createPage: (data) => api.post('/admin/pages', data),
  updatePage: (pageName, data) => api.put(`/admin/pages/${pageName}`, data),
  
  // Upload
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default api;
