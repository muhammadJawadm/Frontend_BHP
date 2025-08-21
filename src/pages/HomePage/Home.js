import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ArrowRight, Star, Users, ShoppingBag, Zap, Truck, Shield, RefreshCw, X, Heart, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

// Import the new components
import Header from './Header';
import HeroSection from './HeroSection';
import ProductCard from './ProductCard';
import Categories from './Categories';
import Features from './Features';
import Footer from './Footer';

const BASE_URL = 'http://localhost:5000';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products`);
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchStores = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/stores`);
        const data = await response.json();
        if (data.stores) {
          setStores(data.stores);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchProducts();
    fetchStores();
    setLoading(false);
  }, []);

  // Add to cart functionality
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove from cart
  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  // Update quantity in cart
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Calculate total cart value
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.sale_price || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  // Get total cart items count
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate discount percentage
  const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  // Cart Sidebar Component
  const CartSidebar = () => (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        {/* Cart Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart ({getCartItemsCount()})
          </h2>
          <button
            onClick={() => setShowCart(false)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={item.image?.[0] || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.store_id?.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {item.sale_price ? (
                          <>
                            <span className="text-sm font-bold text-red-600">
                              Rs.{item.sale_price}
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              Rs.{item.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-900">
                            Rs.{item.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link 
                        to={`/viewproduct/${item._id}`}
                        className="text-xs text-slate-600 hover:text-slate-800 font-medium"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleRemoveFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-slate-800">
                Rs.{getCartTotal().toLocaleString()}
              </span>
            </div>
            <button className="w-full bg-slate-800 text-white py-3 rounded-md hover:bg-slate-900 transition-colors font-medium">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Cart Button */}
      <div className="relative">
        <Header />
        
        {/* Cart Toggle Button */}
        <button
          onClick={() => setShowCart(true)}
          className="fixed top-4 right-4 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:bg-slate-900 transition-colors z-40"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {getCartItemsCount()}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <Categories />

      {/* Features Section */}
      <Features />

      {/* Hot Deals Section */}
      <section className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 Hot Deals</h2>
            <p className="text-lg text-gray-600">Limited time offers you don't want to miss</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => p.sale_price && p.sale_price < p.price).slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Discover our hand-picked selection of quality products</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 20).map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Stores</h2>
            <p className="text-lg text-gray-600">Shop from our trusted verified sellers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stores.slice(0, 8).map((store) => (
              <div key={store._id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow group">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto">
                    {store.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                    <Shield className="h-3 w-3" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-slate-700">
                  {store.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {store.description || store.category || 'Quality products and services'}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>4.5</span>
                  </div>
                  <span>Products</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <Link to={`/dashboard/store/${store._id}`}>
                    <Button variant="outline">
                      View Store
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-slate-300 mb-8">Get the latest deals and offers delivered to your inbox</p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-md border-0 focus:ring-2 focus:ring-slate-500"
            />
            <button className="bg-slate-600 text-white px-6 py-3 rounded-r-md hover:bg-slate-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and sellers on BHP today
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/seller/signup">
              <button className="border border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-slate-900 transition-colors font-semibold">
                Start Selling
              </button>
            </Link> 
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Cart Overlay */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowCart(false)}
        />
      )}
    </div>
  );
};

export default Homepage;