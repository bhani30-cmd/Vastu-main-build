import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import ContactUs from './pages/ContactUs';
import ProjectsResidential from './pages/ProjectsResidential';
import ProjectsCommercial from './pages/ProjectsCommercial';
import ProjectsOffice from './pages/ProjectsOffice';
import ProjectsRetail from './pages/ProjectsRetail';
import ProjectsGallery from './pages/ProjectsGallery';
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ChangePassword from './pages/ChangePassword';
import HomepageManagement from './pages/HomepageManagement';
import HeroSlidesManagement from './pages/HeroSlidesManagement';
import CapabilitiesManagement from './pages/CapabilitiesManagement';
import ProjectsManagement from './pages/ProjectsManagement';
import ClientsManagement from './pages/ClientsManagement';
import TestimonialsManagement from './pages/TestimonialsManagement';
import ContactSubmissionsManagement from './pages/ContactSubmissionsManagement';
import CompanyInfoManagement from './pages/CompanyInfoManagement';
import PageContentManagement from './pages/PageContentManagement';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Toaster position="top-right" />
          <LiveChat />
          <Routes>
            {/* Public Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/projects/residential" element={<ProjectsResidential />} />
                    <Route path="/projects/commercial" element={<ProjectsCommercial />} />
                    <Route path="/projects/office" element={<ProjectsOffice />} />
                    <Route path="/projects/retail" element={<ProjectsRetail />} />
                    <Route path="/projects" element={<ProjectsGallery />} />
                    <Route path="/projects/:projectId" element={<ProjectDetail />} />
                  </Routes>
                  <Footer />
                </>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="homepage" element={<HomepageManagement />} />
              <Route path="hero-slides" element={<HeroSlidesManagement />} />
              <Route path="capabilities" element={<CapabilitiesManagement />} />
              <Route path="projects" element={<ProjectsManagement />} />
              <Route path="clients" element={<ClientsManagement />} />
              <Route path="testimonials" element={<TestimonialsManagement />} />
              <Route path="contacts" element={<ContactSubmissionsManagement />} />
              <Route path="company-info" element={<CompanyInfoManagement />} />
              <Route path="pages" element={<PageContentManagement />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
