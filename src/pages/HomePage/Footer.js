import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Buy Her Power</h3>
            <p className="text-gray-400 mb-4">
              A platform where women create, communities grow, and traditions live on.
            </p>
            {/* <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                📸
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/About" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/Contact" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="/TermsOfService" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="/PrivacyPolicy" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              {/* <li><a href="/FAQ" className="text-gray-400 hover:text-white">FAQ</a></li> */}
              {/* <li><a href="/Shipping" className="text-gray-400 hover:text-white">Shipping Info</a></li> */}
              {/* <li><a href="/Returns" className="text-gray-400 hover:text-white">Returns</a></li> */}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer </h4>
            <ul className="space-y-2">
              <li><a href="/Customer/Login" className="text-gray-400 hover:text-white">Customer Login</a></li>
              <li><a href="/Customer/SignUp" className="text-gray-400 hover:text-white">Customer SignUp</a></li>
              <li><a href="/AllProducts" className="text-gray-400 hover:text-white">View All Products</a></li>
              </ul>
          </div> 

          {/* Seller Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Sellers</h4>
            <ul className="space-y-2">
              <li><a href="/seller/signup" className="text-gray-400 hover:text-white">Start Selling</a></li>
              <li><a href="/seller/login" className="text-gray-400 hover:text-white">Seller Login</a></li>
              {/* <li><a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a></li> */}
              {/* <li><a href="/seller/support" className="text-gray-400 hover:text-white">Seller Support</a></li>
              <li><a href="/seller/fees" className="text-gray-400 hover:text-white">Fees & Pricing</a></li>
              <li><a href="/seller/policies" className="text-gray-400 hover:text-white">Seller Policies</a></li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 BHP. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/PrivacyPolicy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="/TermsOfService" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              {/* <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;