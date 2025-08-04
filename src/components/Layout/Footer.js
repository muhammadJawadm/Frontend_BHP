import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-slate-600 to-slate-400 text-white p-2 rounded-lg">
                <Store className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">MarketHub</span>
            </Link>
            <p className="text-slate-300 mb-4 max-w-md">
              Your trusted multi-vendor marketplace connecting buyers with quality sellers. 
              Discover amazing products from verified stores with secure transactions.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@markethub.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-slate-300 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/stores" className="text-slate-300 hover:text-white transition-colors">
                  All Stores
                </Link>
              </li>
              <li>
                <Link to="/products?sale=true" className="text-slate-300 hover:text-white transition-colors">
                  Sale Items
                </Link>
              </li>
              <li>
                <Link to="/customer/signup" className="text-slate-300 hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/seller/signup" className="text-slate-300 hover:text-white transition-colors">
                  Start Selling
                </Link>
              </li>
              <li>
                <Link to="/seller/login" className="text-slate-300 hover:text-white transition-colors">
                  Seller Login
                </Link>
              </li>
              <li>
                <span className="text-slate-300">Seller Support</span>
              </li>
              <li>
                <span className="text-slate-300">Seller Guidelines</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-300 text-sm">
              © 2024 MarketHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-slate-300 text-sm hover:text-white cursor-pointer">
                Privacy Policy
              </span>
              <span className="text-slate-300 text-sm hover:text-white cursor-pointer">
                Terms of Service
              </span>
              <span className="text-slate-300 text-sm hover:text-white cursor-pointer">
                Contact Us
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;