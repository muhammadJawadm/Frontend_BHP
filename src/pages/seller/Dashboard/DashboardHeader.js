import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Store, User, Calendar, Phone, Mail, ChevronDown } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback, Button } from '../../../components/ui/UIComponents';

const DashboardHeader = ({ seller, store, error, storeId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Get seller initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mb-8">
      {/* Main Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Profile Section */}
          <div className="flex items-start space-x-4">
            <div className="relative" ref={dropdownRef}>
              <div 
                className="cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Avatar className="h-20 w-20 ring-4 ring-slate-100 hover:ring-slate-200 transition-all duration-200">
                  <AvatarImage 
                    src={seller.seller?.avatar || seller?.profileImage || ""} 
                    alt={seller.seller?.name || "User"} 
                  />
                  <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-slate-600 to-slate-800 text-white">
                    {getInitials(seller.seller?.name)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="absolute -bottom-1 -right-1 h-6 w-6 bg-white rounded-full shadow-md p-1 text-slate-600" />
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-4 px-6 z-50">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">{seller.seller?.name}</h3>
                    <p className="text-sm text-slate-500">Seller Profile</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Mail className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm font-medium text-slate-900">{seller.seller?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="text-sm font-medium text-slate-900">{seller.seller?.phone}</p>
                      </div>
                    </div>
                    
                    
                    
                  
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">
                  Welcome back, {seller.seller?.name || 'User'}!
                </h1>
                {seller?.verified && (
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Verified
                  </div>
                )}
              </div>
              
              {/* Store Info */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <Store className="h-5 w-5 text-slate-600" />
                <div>
                  <p className="font-medium text-slate-900">
                    {store?.name || 'Your Store'}
                  </p>
                  <p className="text-sm text-slate-600">
                    {store?.description || 'Manage your products and orders'}
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">⚠️ {error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col mt-4 sm:flex-row gap-3">
            <Link to={`/addproduct/${storeId}`} state={{ storeId, store }}>
              <Button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 transition-colors duration-200 shadow-md hover:shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;