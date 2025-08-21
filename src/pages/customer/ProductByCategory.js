import React, { useState, useEffect } from 'react';
import {Link, useParams } from 'react-router-dom';


const ProductByCategory = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://buyherpower.onrender.com';


  // Mock data for testing
  const mockData = {
    success: true,
    message: "Products retrieved successfully",
    products: [
      {
        _id: "mock1",
        name: "Sample Product 1",
        description: "This is a sample product for testing purposes.",
        price: 1000,
        sale_price: 850,
        category: category,
        images: ["https://via.placeholder.com/300x200?text=Product+1"],
        quantity: 50,
        store_id: {
          _id: "store1",
          name: "Sample Store",
          category: category
        },
        saleEndingDate: "2025-08-30T18:59:00.000Z",
        createdAt: "2025-08-19T13:46:46.547Z",
        updatedAt: "2025-08-19T13:46:46.547Z"
      },
      {
        _id: "mock2",
        name: "Sample Product 2",
        description: "Another sample product for testing the layout.",
        price: 750,
        sale_price: 650,
        category: category,
        images: ["https://via.placeholder.com/300x200?text=Product+2"],
        quantity: 25,
        store_id: {
          _id: "store2",
          name: "Another Store",
          category: category
        },
        createdAt: "2025-08-19T13:46:46.547Z",
        updatedAt: "2025-08-19T13:46:46.547Z"
      }
    ],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_products: 2,
      products_per_page: 10
    }
  };

  useEffect(() => {
    if (useMockData) {
      // Use mock data for testing
      setLoading(true);
      setTimeout(() => {
        setProducts(mockData.products);
        setPagination(mockData.pagination);
        setLoading(false);
      }, 1000); // Simulate loading time
    } else {
      fetchProducts();
    }
  }, [category, useMockData]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching products for category: ${category}`);
      // Update this URL to match your actual API endpoint
      const apiUrl = `${REACT_APP_API_URL}/api/products?category=${encodeURIComponent(category)}`;
      
      console.log('Fetching from:', apiUrl); // Debug log
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', response.headers.get('content-type')); // Debug log
      
      if (!response.ok) {
        // Get the response text to see what's actually being returned
        const responseText = await response.text();
        console.log('Error response:', responseText); // Debug log
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('Non-JSON response:', responseText); // Debug log
        throw new Error('Server returned non-JSON response. Check if API endpoint is correct.');
      }
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.success) {
        setProducts(data.products || []);
        setPagination(data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RS'
    }).format(price);
  };

  const calculateDiscount = (originalPrice, salePrice) => {
    const discount = ((originalPrice - salePrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-2">{error}</p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Common issues:</p>
            <ul className="list-disc list-inside mt-2">
              <li>API server not running</li>
              <li>Wrong API endpoint URL</li>
              <li>CORS configuration issues</li>
            </ul>
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={fetchProducts}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => setUseMockData(true)}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Use Mock Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {category} Products
              </h1>
              <p className="text-gray-600">
                {pagination && `Showing ${products.length} of ${pagination.total_products} products`}
                {useMockData && <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Using Mock Data</span>}
              </p>
            </div>
            {!useMockData && (
              <button 
                onClick={() => setUseMockData(true)}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors"
              >
                Use Mock Data
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-600">
              We couldn't find any products in the {category} category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                  
                  {/* Sale Badge */}
                  {product.sale_price && product.sale_price < product.price && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{calculateDiscount(product.price, product.sale_price)}%
                      </span>
                    </div>
                  )}

                  {/* Quantity Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {product.quantity} in stock
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Store Info */}
                  {product.store_id && (
                    <div className="flex items-center mb-3">
                      <span className="text-xs text-gray-500">
                        Sold by: <span className="font-medium">{product.store_id.name}</span>
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {product.sale_price && product.sale_price < product.price ? (
                        <>
                          <span className="text-xl font-bold text-green-600">
                            RS. {product.sale_price}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            RS. {product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">
                          {product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sale Ending Date */}
                  {product.saleEndingDate && new Date(product.saleEndingDate) > new Date() && (
                    <div className="mb-3">
                      <span className="text-xs text-red-600 font-medium">
                        Sale ends: {new Date(product.saleEndingDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      <Link to={`/viewproduct/${product._id}`}>
                      Buy Now
                      </Link>
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-lg">❤️</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {[...Array(pagination.total_pages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-2 rounded-lg ${
                      index + 1 === pagination.current_page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductByCategory;