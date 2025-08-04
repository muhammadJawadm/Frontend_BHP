import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, ShoppingBag, Zap, Search, ShoppingCart, User, Menu, X, Heart, Filter, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, ChevronDown, LogOut } from 'lucide-react';

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderPage, setShowOrderPage] = useState(false);
  const [orderData, setOrderData] = useState({
    products: [],
    shippingAddress: {
      fullName: '',
      addressLine: '',
      city: '',
      postalCode: '',
      country: '',
      phone: ''
    },
    shippingPrice: 10
  });

  // Mock data for categories and hero slides
  const categories = [
    { id: 1, name: 'Electronics', icon: '📱', count: '2.5k products' },
    { id: 2, name: 'Fashion', icon: '👗', count: '3.2k products' },
    { id: 3, name: 'Home & Garden', icon: '🏠', count: '1.8k products' },
    { id: 4, name: 'Sports', icon: '⚽', count: '950 products' },
    { id: 5, name: 'Books', icon: '📚', count: '1.2k products' },
    { id: 6, name: 'Beauty', icon: '💄', count: '1.5k products' },
    { id: 7, name: 'Automotive', icon: '🚗', count: '800 products' },
    { id: 8, name: 'Toys', icon: '🧸', count: '650 products' }
  ];

  const heroSlides = [
    {
      id: 1,
      title: "Mega Sale Up to 70% Off",
      subtitle: "Electronics & Gadgets",
      description: "Discover amazing deals on smartphones, laptops, and accessories",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop",
      buttonText: "Shop Electronics",
      bgColor: "from-blue-600 to-purple-700"
    },
    {
      id: 2,
      title: "Fashion Week Special",
      subtitle: "Latest Trends & Styles",
      description: "Get the latest fashion trends with free shipping worldwide",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
      buttonText: "Shop Fashion",
      bgColor: "from-pink-500 to-rose-600"
    },
    {
      id: 3,
      title: "Home Makeover Sale",
      subtitle: "Transform Your Space",
      description: "Premium home decor and furniture at unbeatable prices",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop",
      buttonText: "Shop Home",
      bgColor: "from-green-500 to-teal-600"
    }
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products/all');
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
        const response = await fetch('http://localhost:5000/api/stores');
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

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Handle Buy Now button click
  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setOrderData({
      products: [{
        product: product._id,
        quantity: 1
      }],
      shippingAddress: {
        fullName: '',
        addressLine: '',
        city: '',
        postalCode: '',
        country: '',
        phone: ''
      },
      shippingPrice: 10
    });
    setShowOrderPage(true);
  };

  // Calculate discount percentage
  const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  // Handle order submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/order/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      const result = await response.json();
      if (response.ok) {
        alert('Order placed successfully!');
        setShowOrderPage(false);
        setSelectedProduct(null);
      } else {
        alert('Error placing order: ' + result.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  // Order Page Component
  const OrderPage = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Place Order</h2>
            <button
              onClick={() => setShowOrderPage(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {selectedProduct && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedProduct.image?.[0] || 'https://via.placeholder.com/100'}
                  alt={selectedProduct.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">{selectedProduct.store_id?.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {selectedProduct.sale_price ? (
                      <>
                        <span className="text-lg font-bold text-red-600">
                          ₹{selectedProduct.sale_price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{selectedProduct.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ₹{selectedProduct.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleOrderSubmit}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={orderData.shippingAddress.fullName}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      shippingAddress: {
                        ...orderData.shippingAddress,
                        fullName: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={orderData.shippingAddress.phone}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      shippingAddress: {
                        ...orderData.shippingAddress,
                        phone: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line
                  </label>
                  <input
                    type="text"
                    required
                    value={orderData.shippingAddress.addressLine}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      shippingAddress: {
                        ...orderData.shippingAddress,
                        addressLine: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={orderData.shippingAddress.city}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      shippingAddress: {
                        ...orderData.shippingAddress,
                        city: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={orderData.shippingAddress.postalCode}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      shippingAddress: {
                        ...orderData.shippingAddress,
                        postalCode: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={orderData.shippingAddress.country}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      shippingAddress: {
                        ...orderData.shippingAddress,
                        country: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between text-sm">
                <span>Product Price:</span>
                <span>₹{selectedProduct?.sale_price || selectedProduct?.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>₹{orderData.shippingPrice}</span>
              </div>
              <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{(selectedProduct?.sale_price || selectedProduct?.price) + orderData.shippingPrice}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowOrderPage(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
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
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-slate-900">ShopHub</h1>
              </div>
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
              
<Link to="/seller/signup">
  <button className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900">
    Sell on ShopHub
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
              <a href="" className="block px-3 py-2 bg-slate-800 text-white rounded-md">Sell on ShopHub</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Slider */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
          >
            <div className={`bg-gradient-to-r ${slide.bgColor} h-full`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center h-full">
                  <div className="w-full md:w-1/2 text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                    <h2 className="text-xl md:text-2xl mb-4 opacity-90">{slide.subtitle}</h2>
                    <p className="text-lg mb-8 opacity-80">{slide.description}</p>
                    <button className="bg-white text-gray-900 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                      {slide.buttonText}
                      <ArrowRight className="inline ml-2 h-5 w-5" />
                    </button>
                  </div>
                  <div className="hidden md:block w-1/2">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Discover products across all categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 cursor-pointer transition-colors group"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-slate-700">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over ₹500</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure and encrypted transactions</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy on all items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="py-12 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🔥 Hot Deals</h2>
            <p className="text-lg text-gray-600">Limited time offers you don't want to miss</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter(p => p.sale_price && p.sale_price < p.price).slice(0, 4).map((product) => {
              const discount = calculateDiscount(product.price, product.sale_price);
              return (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img 
                      src={product.image?.[0] || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        -{discount}%
                      </div>
                    )}
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-slate-700">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{product.store_id?.name}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl font-bold text-red-600">₹{product.sale_price}</span>
                      <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.rating || 0})</span>
                    </div>
                    <button 
                      onClick={() => handleBuyNow(product)}
                      className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-900 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* <div className="text-center mt-8">
            <button className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-colors">
              View All Deals
              <ArrowRight className="inline ml-2 h-4 w-4" />
            </button>
          </div> */}
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
            {products.slice(0, 8).map((product) => {
              const discount = calculateDiscount(product.price, product.sale_price);
              return (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img 
                      src={product.image?.[0] || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.sale_price && discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        -{discount}%
                      </div>
                    )}
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-slate-700">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{product.store_id?.name}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      {product.sale_price ? (
                        <>
                          <span className="text-xl font-bold text-red-600">₹{product.sale_price}</span>
                          <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                      )}
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({product.rating || 0})</span>
                    </div>
                    <button 
                      onClick={() => handleBuyNow(product)}
                      className="w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-900 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
{/*           
          <div className="text-center mt-8">
            <button className="border border-slate-300 text-slate-700 px-8 py-3 rounded-md hover:bg-slate-50 transition-colors">
              View All Products
              <ArrowRight className="inline ml-2 h-4 w-4" />
            </button>
          </div> */}
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
                  Verified Store
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
            Join thousands of satisfied customers and sellers on ShopHub today
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="bg-white text-slate-900 px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-semibold">
              Shop Now
            </button>
            <Link to="/seller/signup">
            <button className="border border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-slate-900 transition-colors font-semibold">
              Start Selling
            </button>
</Link> 
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4">ShopHub</h3>
              <p className="text-gray-400 mb-4">
                Your trusted marketplace connecting buyers and sellers worldwide.
              </p>
              <div className="flex space-x-4">
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
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Returns</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Electronics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Fashion</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Home & Garden</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Sports</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Beauty</a></li>
              </ul>
            </div>

            {/* Seller Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Start Selling</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Seller Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Seller Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Fees & Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Seller Policies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 ShopHub. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Order Page Modal */}
      {showOrderPage && <OrderPage />}
    </div>
  );
};

export default Homepage;