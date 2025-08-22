"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { Heart, ShoppingCart, Star, Package, AlertCircle, RefreshCw } from "lucide-react"

const ProductByCategory = () => {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [useMockData, setUseMockData] = useState(false)

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "https://buyherpower.onrender.com"

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
          category: category,
        },
        saleEndingDate: "2025-08-30T18:59:00.000Z",
        createdAt: "2025-08-19T13:46:46.547Z",
        updatedAt: "2025-08-19T13:46:46.547Z",
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
          category: category,
        },
        createdAt: "2025-08-19T13:46:46.547Z",
        updatedAt: "2025-08-19T13:46:46.547Z",
      },
    ],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_products: 2,
      products_per_page: 10,
    },
  }

  useEffect(() => {
    if (useMockData) {
      setLoading(true)
      setTimeout(() => {
        setProducts(mockData.products)
        setPagination(mockData.pagination)
        setLoading(false)
      }, 1000)
    } else {
      fetchProducts()
    }
  }, [category, useMockData])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log(`Fetching products for category: ${category}`)
      const apiUrl = `${REACT_APP_API_URL}/api/products?category=${encodeURIComponent(category)}`

      console.log("Fetching from:", apiUrl)

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers.get("content-type"))

      if (!response.ok) {
        const responseText = await response.text()
        console.log("Error response:", responseText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        console.log("Non-JSON response:", responseText)
        throw new Error("Server returned non-JSON response. Check if API endpoint is correct.")
      }

      const data = await response.json()
      console.log("API Response:", data)

      if (data.success) {
        setProducts(data.products || [])
        setPagination(data.pagination)
      } else {
        throw new Error(data.message || "Failed to fetch products")
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "RS",
    }).format(price)
  }

  const calculateDiscount = (originalPrice, salePrice) => {
    const discount = ((originalPrice - salePrice) / originalPrice) * 100
    return Math.round(discount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3 mb-4 animate-shimmer"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-8 animate-shimmer"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20"
                >
                  <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 animate-shimmer"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-shimmer"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 animate-shimmer"></div>
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 animate-shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">{error}</p>
          <div className="text-sm text-gray-500 mb-8 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="font-medium mb-2">Common issues:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>API server not running</li>
              <li>Wrong API endpoint URL</li>
              <li>CORS configuration issues</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={fetchProducts}
              className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>
                {/* <button
              onClick={() => setUseMockData(true)}
              className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-3 rounded-xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/20"
            >
              Use Mock Data
            </button> */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-rose-200/20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                {category} Products
              </h1>
              <p className="text-gray-600 text-lg">
                {pagination && (
                  <span className="inline-flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Showing {products.length} of {pagination.total_products} products
                  </span>
                )}
                {useMockData && (
                  <span className="ml-4 inline-flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200">
                    <Star className="w-3 h-3" />
                    Using Mock Data
                  </span>
                )}
              </p>
            </div>
            {!useMockData && (
              <button
                onClick={() => setUseMockData(true)}
                className="bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-xl hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/20"
              >
                {/* Use Mock Data */}
              </button>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              No Products Found
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
              We couldn't find any products in the {category} category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20"
              >
                <div className="relative h-50 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <Package className="w-16 h-12 text-gray-400" />
                    </div>
                  )}

                  {product.sale_price && product.sale_price < product.price && (
                    <div className="absolute top-2 left-4">
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                        -{calculateDiscount(product.price, product.sale_price)}%
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2 right-4">
                    <span className="bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                      {product.quantity} in stock
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 mb-2 line-clamp-2 leading-relaxed">{product.description}</p>

                  {product.store_id && (
                    <div className="flex items-center mb-2 p-2 bg-gray-50/50 rounded-lg">
                      <span className="text-sm text-gray-500">
                        Sold by: <span className="font-semibold text-gray-700">{product.store_id.name}</span>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {product.sale_price && product.sale_price < product.price ? (
                        <>
                          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            RS. {product.sale_price}
                          </span>
                          <span className="text-lg text-gray-500 line-through">RS. {product.price}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">RS. {product.price}</span>
                      )}
                    </div>
                  </div>

                  {product.saleEndingDate && new Date(product.saleEndingDate) > new Date() && (
                    <div className="mb-4 p-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100">
                      <span className="text-sm text-red-600 font-semibold">
                        Sale ends: {new Date(product.saleEndingDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Link to={`/viewproduct/${product._id}`} className="flex-1">
                      <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Buy Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className="mt-16 flex justify-center">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
              <button className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium">
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {[...Array(pagination.total_pages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      index + 1 === pagination.current_page
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default ProductByCategory
