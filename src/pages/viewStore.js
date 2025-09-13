import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Eye, 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Filter,
  Grid3X3,
  List,
  Search,
  Calendar,
  Tag,
  ShoppingCart
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { useToast } from '../hooks/use-toast';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://buyherpower.onrender.com';

const BASE_URL = REACT_APP_API_URL;

const ViewStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { storeId: paramStoreId } = useParams();
  
  // Get store ID from multiple sources
  const getStoreId = () => {
    // Priority 1: URL parameter
    if (paramStoreId) return paramStoreId;
    
    // Priority 2: Navigation state
    if (location.state?.storeId) return location.state.storeId;
    
    // Priority 3: sessionStorage (changed from localStorage to avoid storage issues)
    const currentStoreId = sessionStorage.getItem('currentStoreId');
    if (currentStoreId) return currentStoreId;
    
    return null;
  };

  const storeId = getStoreId();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Safe toast hook usage
  let toast = null;
  try {
    const toastHook = useToast();
    toast = toastHook.toast;
  } catch (error) {
    console.error('Toast hook not available:', error);
    toast = (message) => console.log('Toast:', message);
  }

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        setError('Store ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch store details
        const storeResponse = await fetch(`${BASE_URL}/api/stores/${storeId}`);
        if (!storeResponse.ok) {
          throw new Error(`Failed to fetch store: ${storeResponse.status}`);
        }
        const storeResult = await storeResponse.json();
        setStore(storeResult.store);

        // Fetch store products
        const productsResponse = await fetch(`${BASE_URL}/api/products/store/${storeId}`);
        if (!productsResponse.ok) {
          throw new Error(`Failed to fetch products: ${productsResponse.status}`);
        }
        const productsResult = await productsResponse.json();
        
        if (productsResult.success) {
          setProducts(productsResult.products || []);
        } else {
          throw new Error(productsResult.message || 'Failed to fetch products');
        }

      } catch (error) {
        console.error('Error fetching store data:', error);
        setError(error.message);
        if (toast) {
          toast({
            title: "Error",
            description: "Failed to load store data",
            variant: "destructive"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId, toast]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);
    return uniqueCategories;
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          const priceA = a.sale_price || a.price || 0;
          const priceB = b.sale_price || b.price || 0;
          return priceB - priceA;
        case 'price-low':
          const priceLowA = a.sale_price || a.price || 0;
          const priceLowB = b.sale_price || b.price || 0;
          return priceLowA - priceLowB;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    return filtered;
  }, [products, searchTerm, filterCategory, sortBy]);

  // Calculate store stats
  const storeStats = useMemo(() => {
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.quantity > 0).length; // Changed from p.in_stock
    const averagePrice = products.length > 0 
      ? (products.reduce((sum, p) => sum + (p.sale_price || p.price || 0), 0) / products.length).toFixed(2)
      : '0.00';
    const averageRating = products.length > 0 
      ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
      : '0.0';
    const productsOnSale = products.filter(p => p.sale_price).length;

    return {
      totalProducts,
      inStockProducts,
      averagePrice,
      averageRating,
      productsOnSale
    };
  }, [products]);

  // Get product image - Updated to handle the new API structure
  const getProductImage = (product) => {
    // Check if product has images array and it's not empty
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
      return 'https://via.placeholder.com/300x200?text=No+Image';
    }
    
    // Get the first image from the array
    const imageUrl = product.images[0];
    
    // Handle base64 images
    if (imageUrl && imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    
    // Handle regular URLs
    if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('/'))) {
      return imageUrl;
    }
    
    // Fallback to placeholder
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  // Handle image error
  const handleImageError = (e, product) => {
    console.error('Image failed to load for product:', product.name);
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
  };

  // Check if product is in stock
  const isInStock = (product) => {
    return product.quantity > 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Store className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Store Not Found</h1>
          <p className="text-slate-600 mb-6">
            {error || 'The store you are looking for does not exist.'}
          </p>
          <Link to="/">
            <Button className="bg-slate-800 hover:bg-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" state={{ storeId: storeId }}>
            <Button variant="ghost" className="mb-4 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Store Header */}
        <Card className="mb-8">
          <CardContent className="p-0">
            {/* Store Banner */}
            {store.banner && (
              <div className="relative h-48 md:h-64">
                <img
                  src={store.banner}
                  alt="Store banner"
                  className="w-full h-full object-cover rounded-t-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x200?text=Store+Banner';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-lg"></div>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                {/* Store Logo */}
                {store.logo ? (
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <img
                      src={store.logo}
                      alt="Store logo"
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border-4 border-white shadow-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/128x128?text=Logo';
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-200 rounded-lg border-4 border-white shadow-lg flex items-center justify-center">
                      <Store className="h-8 w-8 md:h-12 md:w-12 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Store Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        {store.name}
                      </h1>
                      <div className="flex items-center space-x-4 text-slate-600">
                        <Badge variant="secondary" className="text-sm">
                          {store.category || 'General Store'}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span>{storeStats.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {store.description || 'Welcome to our store! Discover amazing products and great deals.'}
                  </p>

                  {/* Store Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {store.location && (
                      <div className="flex items-center text-slate-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{store.location}</span>
                      </div>
                    )}
                    {store.phone && (
                      <div className="flex items-center text-slate-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{store.phone}</span>
                      </div>
                    )}
                    {store.email && (
                      <div className="flex items-center text-slate-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{store.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{storeStats.totalProducts}</div>
              <div className="text-sm text-slate-600">Total Products</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{storeStats.inStockProducts}</div>
              <div className="text-sm text-slate-600">In Stock</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">Rs {storeStats.averagePrice}</div>
              <div className="text-sm text-slate-600">Avg Price</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{storeStats.averageRating}</div>
              <div className="text-sm text-slate-600">Avg Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{storeStats.productsOnSale}</div>
              <div className="text-sm text-slate-600">On Sale</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Category Filter */}
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-slate-600">
              Showing {filteredAndSortedProducts.length} of {products.length} products
              {searchTerm && ` for "${searchTerm}"`}
              {filterCategory !== 'all' && ` in ${filterCategory}`}
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        {filteredAndSortedProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-600">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'This store doesn\'t have any products yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredAndSortedProducts.map(product => (
              <Card 
                key={product._id} 
                className={`group hover:shadow-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}
              >
                <CardContent className={`p-0 ${viewMode === 'list' ? 'flex w-full' : ''}`}>
                  {/* Product Image */}
                  <div className={`relative ${
                    viewMode === 'list' 
                      ? 'w-48 flex-shrink-0' 
                      : 'w-full'
                  }`}>
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className={`object-cover ${
                        viewMode === 'list' 
                          ? 'w-full h-full rounded-l-lg' 
                          : 'w-full h-48 rounded-t-lg'
                      }`}
                      onError={(e) => handleImageError(e, product)}
                    />
                    
                    {/* Sale Badge */}
                    {product.sale_price && (
                      <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                        SALE
                      </Badge>
                    )}
                    
                    {/* Stock Status */}
                    {!isInStock(product) && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                        <Badge variant="secondary" className="bg-red-500 text-white">
                          Out of Stock
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className={`text-sm text-slate-600 mb-3 ${
                        viewMode === 'list' ? 'line-clamp-3' : 'line-clamp-2'
                      }`}>
                        {product.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        {product.sale_price ? (
                          <>
                            <span className="text-xl font-bold text-red-600">
                              Rs.{product.sale_price}
                            </span>
                            <span className="text-sm text-slate-500 line-through">
                              Rs.{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-slate-900">
                            Rs.{product.price}
                          </span>
                        )}
                      </div>

                      {/* Rating and Category */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-slate-600 ml-1">
                            {product.rating || 0}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>

                      {/* Sale End Date */}
                      {product.sale_price && product.saleEndingDate && (
                        <div className="flex items-center text-xs text-red-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          Sale ends: {new Date(product.saleEndingDate).toLocaleDateString()}
                        </div>
                      )}

                      {/* Stock Info */}
                      <div className="text-xs text-slate-500">
                        {isInStock(product) ? (
                          `${product.quantity} in stock`
                        ) : (
                          'Out of stock'
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <Button 
                          size="sm" 
                          className="w-full bg-slate-800 hover:bg-slate-900"
                          disabled={!isInStock(product)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Product
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStore;