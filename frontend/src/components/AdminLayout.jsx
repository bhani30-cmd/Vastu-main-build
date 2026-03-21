import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Home } from 'lucide-react';
import { Button } from '../components/ui/button';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                <LayoutDashboard size={24} />
                <span className="text-xl font-bold">
                  <span className="text-orange-500">VASTUNIRMANA</span> ADMIN
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
              >
                <Home size={18} />
                <span>View Website</span>
              </Link>
              
              {user && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300">
                    Welcome, <strong>{user.full_name}</strong>
                  </span>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
