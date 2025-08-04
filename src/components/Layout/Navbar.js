import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Store, LayoutDashboard, LogOut } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '../ui/dropdown-menu';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { searchProducts } from '../../data/mock';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated, isCustomer, isStoreOwner } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [authKey, setAuthKey] = useState(0);

  React.useEffect(() => {
    const handler = () => setAuthKey(k => k + 1);
    window.addEventListener('authChange', handler);
    return () => window.removeEventListener('authChange', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = getCartCount();

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-slate-800 to-slate-600 text-white p-2 rounded-lg">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-slate-800">MarketHub</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none focus:ring-2 focus:ring-slate-500"
              />
              <Button 
                type="submit"
                className="rounded-l-none bg-slate-700 hover:bg-slate-800"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/products" className="text-slate-600 hover:text-slate-800 font-medium">
              Products
            </Link>
            <Link to="/stores" className="text-slate-600 hover:text-slate-800 font-medium">
              Stores
            </Link>

            {/* Profile Icon and Dropdown */}
            <DropdownMenu key={authKey}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || 'U'}`} alt={user?.name} />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated() ? (
                  <>
                    <DropdownMenuLabel className="flex flex-col items-start">
                      <span className="font-bold text-base">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>Login as:</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/customer/login')} className="cursor-pointer">
                      Customer Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/seller/login')} className="cursor-pointer">
                      Seller Login
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart and Dashboard links remain unchanged */}
            {isAuthenticated() && isCustomer() && (
              <Link to="/cart" className="relative text-slate-600 hover:text-slate-800">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated() && isStoreOwner() && (
              <Link to="/dashboard" className="flex items-center space-x-1 text-slate-600 hover:text-slate-800 font-medium">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="sm"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="flex">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none"
            />
            <Button 
              type="submit"
              className="rounded-l-none bg-slate-700 hover:bg-slate-800"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/products" 
                className="text-slate-600 hover:text-slate-800 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/stores" 
                className="text-slate-600 hover:text-slate-800 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Stores
              </Link>

              {isAuthenticated() ? (
                <>
                  {isCustomer() && (
                    <Link 
                      to="/cart" 
                      className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Cart ({cartCount})</span>
                    </Link>
                  )}

                  {isStoreOwner() && (
                    <Link 
                      to="/dashboard" 
                      className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  <div className="flex items-center space-x-2 text-slate-600">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className="justify-start text-slate-600 hover:text-slate-800"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/customer/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-800">
                      Customer Login
                    </Button>
                  </Link>
                  <Link to="/seller/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-slate-700 hover:bg-slate-800">
                      Seller Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;