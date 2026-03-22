import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { 
  LayoutDashboard, 
  Images, 
  Briefcase, 
  FolderKanban, 
  Users, 
  MessageSquare,
  Mail,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: Images, label: 'Hero Slides', path: '/admin/hero-slides', count: stats?.hero_slides, color: 'bg-blue-500' },
    { icon: Briefcase, label: 'Capabilities', path: '/admin/capabilities', count: stats?.capabilities, color: 'bg-green-500' },
    { icon: FolderKanban, label: 'Projects', path: '/admin/projects', count: stats?.projects, color: 'bg-purple-500' },
    { icon: Users, label: 'Clients', path: '/admin/clients', count: stats?.clients, color: 'bg-yellow-500' },
    { icon: MessageSquare, label: 'Testimonials', path: '/admin/testimonials', count: stats?.testimonials, color: 'bg-pink-500' },
    { icon: Mail, label: 'Contact Submissions', path: '/admin/contacts', count: stats?.new_contacts, color: 'bg-red-500', badge: true },
    { icon: Settings, label: 'Company Info', path: '/admin/company-info', color: 'bg-gray-500' },
    { icon: LayoutDashboard, label: 'Page Content', path: '/admin/pages', color: 'bg-indigo-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <LayoutDashboard className="inline mr-2" size={32} />
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage your website content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`${item.color} p-3 rounded-lg text-white`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{item.label}</h3>
                    {item.count !== undefined && (
                      <p className="text-2xl font-bold text-gray-900 mt-1">{item.count}</p>
                    )}
                  </div>
                </div>
                {item.badge && item.count > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.count} New
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/projects"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors text-center font-semibold"
            >
              Add New Project
            </Link>
            <Link
              to="/admin/testimonials"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-center font-semibold"
            >
              Add Testimonial
            </Link>
            <Link
              to="/admin/contacts"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-center font-semibold"
            >
              View Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
