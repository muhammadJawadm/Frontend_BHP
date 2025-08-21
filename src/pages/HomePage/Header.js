import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import logoBHP from '../../assets/Black.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user || userData);
      } else {
        // Token might be invalid, remove it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInClick = () => {
    if (user) {
      setShowUserDropdown(!showUserDropdown);
    } else {
      navigate('/customer/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowUserDropdown(false);
    navigate('/');
  };

  const handleSettings = () => {
    setShowUserDropdown(false);
    // Navigate to settings page (you can implement this later)
    navigate('/profile/settings');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img src={logoBHP} alt="BHP Logo" className="h-24 w-24 object-contain" />
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products, stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Sign In / User Profile */}
            <div className="relative user-dropdown-container">
              {isLoading ? (
                <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
              ) : user ? (
                <button
                  onClick={handleSignInClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium">{user.name || 'User'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSignInClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown */}
              {showUserDropdown && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Link to={`/MyOrders/${user.id}`}>
                  <button
                    
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>My Orders</span>
                  </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sell on BHP Button */}
            <Link to="/seller/signup">
              <button className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900">
                Sell on BHP
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            {/* Mobile User Section */}
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleSettings}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/customer/login"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
            
            <Link
              to="/seller/signup"
              className="block px-3 py-2 bg-slate-800 text-white rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Sell on BHP
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;