import React, { useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    return location.pathname === path
      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col h-full z-30">
        <div className="p-5 border-b border-gray-100 flex items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary-600 flex items-center justify-center text-white mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-800">Alumni Management</h1>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-4 mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</h2>
          </div>
          <ul className="space-y-1 px-3">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center py-3 px-4 ${isActive('/dashboard')} transition-colors duration-200 ease-in-out`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/models"
                className={`flex items-center py-3 px-4 ${isActive('/models')} transition-colors duration-200 ease-in-out`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium">Models</span>
              </Link>
            </li>
          </ul>

          <div className="px-4 mt-8 mb-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</h2>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center py-3 px-4 w-full text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-200 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {location.pathname === '/dashboard' ? 'Dashboard' : 'Models'}
              </h2>
            </div>
            {user && (
              <div className="flex items-center">
                <div className="relative group">
                  <div className="flex items-center cursor-pointer">
                    <span className="text-gray-700 mr-2 hidden md:block">{user.name || 'Admin User'}</span>
                    <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white shadow-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
