import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Toaster position="top-right" />
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
              <Route path="hero-slides" element={<div className="p-8"><h1 className="text-2xl font-bold">Hero Slides Management - Coming Soon</h1></div>} />
              <Route path="capabilities" element={<div className="p-8"><h1 className="text-2xl font-bold">Capabilities Management - Coming Soon</h1></div>} />
              <Route path="projects" element={<div className="p-8"><h1 className="text-2xl font-bold">Projects Management - Coming Soon</h1></div>} />
              <Route path="clients" element={<div className="p-8"><h1 className="text-2xl font-bold">Clients Management - Coming Soon</h1></div>} />
              <Route path="testimonials" element={<div className="p-8"><h1 className="text-2xl font-bold">Testimonials Management - Coming Soon</h1></div>} />
              <Route path="contacts" element={<div className="p-8"><h1 className="text-2xl font-bold">Contact Submissions - Coming Soon</h1></div>} />
              <Route path="company-info" element={<div className="p-8"><h1 className="text-2xl font-bold">Company Info - Coming Soon</h1></div>} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
