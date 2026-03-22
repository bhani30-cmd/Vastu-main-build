import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import HeroSlidesManagement from './pages/HeroSlidesManagement';
import CapabilitiesManagement from './pages/CapabilitiesManagement';
import ProjectsManagement from './pages/ProjectsManagement';
import ClientsManagement from './pages/ClientsManagement';
import TestimonialsManagement from './pages/TestimonialsManagement';
import ContactSubmissionsManagement from './pages/ContactSubmissionsManagement';
import CompanyInfoManagement from './pages/CompanyInfoManagement';
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
                    <Route path="/about" element={<Home />} />
                    <Route path="/projects" element={<Home />} />
                    <Route path="/resources" element={<Home />} />
                    <Route path="/contact" element={<Home />} />
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
              <Route path="hero-slides" element={<HeroSlidesManagement />} />
              <Route path="capabilities" element={<CapabilitiesManagement />} />
              <Route path="projects" element={<ProjectsManagement />} />
              <Route path="clients" element={<ClientsManagement />} />
              <Route path="testimonials" element={<TestimonialsManagement />} />
              <Route path="contacts" element={<ContactSubmissionsManagement />} />
              <Route path="company-info" element={<CompanyInfoManagement />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
