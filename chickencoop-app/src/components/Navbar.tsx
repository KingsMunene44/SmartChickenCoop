// src/components/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Assuming username is saved in localStorage after login

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <nav className="bg-purple-100 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-800">Smart Coop App</span>
        </div>

        <div className="flex items-center gap-4">
          {username && (
            <div className="flex items-center gap-2 text-gray-800">
              <User className="w-6 h-6" />
              <span>{username}</span>
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
              <span className="hidden sm:inline">Menu</span>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg animate-fade-in"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">Dashboard</Link>
                <Link to="/dashboard/cooplive" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">Coop Live</Link>
                <Link to="/dashboard/controlsetup" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">Control & Setup</Link>
                <Link to="/dashboard/inventorysales" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">Inventory & Sales</Link>
              </div>
            )}
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;