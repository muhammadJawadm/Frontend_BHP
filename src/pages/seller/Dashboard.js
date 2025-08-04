import ProfilePictureUploader from '../../components/ProfilePictureUploader';
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, DollarSign, Star, TrendingUp, Eye, Store } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
const BASE_URL = process.env.BASE_URL ;


const Dashboard = () => {
  // Add error boundary for useAuth
  let user = null;
  let authAvailable = true;
  
  try {
    const authContext = useAuth();
    user = authContext?.user;
  } catch (error) {
    console.error('Auth context not available:', error);
    authAvailable = false;
    // Try to get user from localStorage as fallback
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        user = JSON.parse(userData);
      }
    } catch (fallbackError) {
      console.error('Fallback user retrieval failed:', fallbackError);
    }
  }
  
  const { toast } = useToast();
  const location = useLocation();
  const [sortBy, setSortBy] = useState('name');
  const [store, setStore] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStoreAndProducts() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // First, try to get store ID from various sources
        let storeId = null;
        
        // 1. From navigation state (when coming from store creation)
        if (location.state?.storeId) {
          storeId = location.state.storeId;
          console.log('Using store ID from navigation state:', storeId);
        }
        // 2. From localStorage
        else if (localStorage.getItem('currentStoreId')) {
          storeId = localStorage.getItem('currentStoreId');
        }
        // 3. From seller data in localStorage
        else {
          const sellerData = localStorage.getItem('seller');
          if (sellerData) {
            const seller = JSON.parse(sellerData);
            storeId = seller.storeId || seller.store?._id;
          }
        }

        if (!storeId) {
          console.warn('No store ID found');
          console.log('No store ID found, showing create store option');
          setStore(null);
          setProducts([]);
          setLoading(false);
          return;
        }

        // Fetch store details from API
        console.log('Fetching store with ID:', storeId);
        const storeResponse = await fetch(`${BASE_URL}r/api/stores/${storeId}`);
        
        if (!storeResponse.ok) {
          throw new Error(`Failed to fetch store: ${storeResponse.status}`);
        }

        const storeResult = await storeResponse.json();
        console.log('Store API response:', storeResult);

        if (storeResult.store) {
          setStore(storeResult.store);
          
          // Fetch products for this store
          try {
            const productsResponse = await fetch(`${BASE_URL}/api/products/store/${storeResult.store._id}`);
            if (productsResponse.ok) {
              const productsResult = await productsResponse.json();
              setProducts(productsResult.products || []);
            } else {
              console.warn('Failed to fetch products, using empty array');
              setProducts([]);
            }
          } catch (productsError) {
            console.error('Error fetching products:', productsError);
            setProducts([]);
          }
          
          // Save store ID to localStorage for future use
          localStorage.setItem('currentStoreId', storeResult.store._id);
        } else {
          throw new Error('Store data not found in response');
        }

      } catch (error) {
        console.error('Error fetching store data:', error);
        
        // Fallback to mock data or show error
        if (toast) {
          toast({
            title: "Error Loading Store",
            description: "Unable to load store data. Please try again.",
            variant: "destructive"
          });
        }
        
        // Try fallback to localStorage mock data
        try {
          const mockStoresData = localStorage.getItem('mockStores');
          const mockStores = mockStoresData ? JSON.parse(mockStoresData) : [];
          
          let userStore = mockStores.find(store => 
            store.owner === user._id || 
            store._id === user.store ||
            store.id === user._id
          );
          
          if (userStore) {
            console.log('Using fallback mock store:', userStore);
            setStore(userStore);
            setProducts(userStore.products || []);
          } else {
            setStore(null);
            setProducts([]);
          }
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          setStore(null);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchStoreAndProducts();
  }, [user, location.state, toast]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const sorted = [...products];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = a.sale_price || a.price || 0;
          const priceB = b.sale_price || b.price || 0;
          return priceB - priceA;
        case 'rating':
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        case 'name':
        default:
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameA.localeCompare(nameB);
      }
    });
    return sorted;
  }, [products, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalRevenue = products.reduce((sum, product) => {
      const price = product.sale_price || product.price || 0;
      return sum + (price * 10); // Mock sales multiplier
    }, 0);
    
    const averageRating = products.length > 0 
      ? (products.reduce((sum, product) => sum + (product.rating || 0), 0) / products.length).toFixed(1)
      : '0.0';
    
    const productsOnSale = products.filter(product => product.sale_price).length;

    return {
      totalProducts,
      totalRevenue,
      averageRating,
      productsOnSale
    };
  }, [products]);

  const handleDeleteProduct = async (productId, productName) => {
    if (!productId || !user) return;
    
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Try API delete first
        const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Remove from local state
          setProducts(prev => prev.filter(product => product._id !== productId));
          
          if (toast) {
            toast({
              title: "Product Deleted",
              description: `${productName || 'Product'} has been removed from your store.`,
            });
          }
          return;
        }
      }

      // Fallback to localStorage method
      const mockStoresData = localStorage.getItem('mockStores');
      const mockStores = mockStoresData ? JSON.parse(mockStoresData) : [];
      
      // Find the user's store
      const storeIndex = mockStores.findIndex(store => 
        store.owner === user._id || 
        store._id === user.store ||
        store.id === user._id
      );
      
      if (storeIndex !== -1 && mockStores[storeIndex].products) {
        // Filter out the product to delete
        mockStores[storeIndex].products = mockStores[storeIndex].products.filter(product => 
          product._id !== productId && product.id !== productId
        );
        
        // Update localStorage
        localStorage.setItem('mockStores', JSON.stringify(mockStores));
        
        // Update local state
        setProducts(mockStores[storeIndex].products);
        setStore(mockStores[storeIndex]);
        
        // Show success message
        if (toast) {
          toast({
            title: "Product Deleted",
            description: `${productName || 'Product'} has been removed from your store.`,
          });
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      if (toast) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Store Found</h1>
          <p className="text-slate-600 mb-6">
            You don't have a store yet. Create one to start adding products!
          </p>
          <Link to="/dashboard/create-store">
            <Button className="bg-slate-800 hover:bg-slate-900">
              <Plus className="h-4 w-4 mr-2" />
              Create Store
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div>
                {/* Only render ProfilePictureUploader if auth context is available */}
                {authAvailable ? (
                  <ProfilePictureUploader />
                ) : (
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                    <AvatarFallback className="text-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
                <p className="text-slate-600">
                  Welcome back, {user?.name || 'User'}! Manage your store "{store.name || 'Your Store'}"
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              {/* <Link to={`/dashboard/store/${store._id}`}>
                <Button className="bg-slate-800 hover:bg-slate-900">
                  <Eye className="h-4 w-4 mr-2" />
                  View Store
                </Button>
              </Link> */}
              {/* Updated Add Product link to pass store ID */}
              <Link to="/addproduct" state={{ storeId: store._id }}>
                <Button className="bg-slate-800 hover:bg-slate-900">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Store Information Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Store Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{store.name}</h3>
                  <p className="text-slate-600">{store.category || 'No category'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Description</h4>
                  <p className="text-slate-600 text-sm">
                    {store.description || 'No description available'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link to={`/dashboard/store/${store._id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Store
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" disabled>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Store
                  </Button>
                </div>
              </div>

              {/* Store Images */}
              <div className="space-y-4">
                {store.logo && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Store Logo</h4>
                    <img
                      src={store.logo}
                      alt="Store logo"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {store.banner && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Store Banner</h4>
                    <img
                      src={store.banner}
                      alt="Store banner"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {!store.logo && !store.banner && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No store images uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Products</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
                </div>
                <div className="bg-slate-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-slate-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {stats.productsOnSale} on sale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Revenue (Mock)</p>
                  <p className="text-3xl font-bold text-slate-900">Rs.{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  {/* <DollarSign className="h-6 w-6 text-green-600" /> */}
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average Rating</p>
                  <p className="text-3xl font-bold text-slate-900">3.5</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Based on {stats.totalProducts} products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Store Views</p>
                  <p className="text-3xl font-bold text-slate-900">2,845</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +8% this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle>Your Products ({products.length})</CardTitle>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="price">Sort by Price</SelectItem>
                    <SelectItem value="rating">Sort by Rating</SelectItem>
                  </SelectContent>
                </Select>
                {/* Updated Add Product link to pass store ID */}
                <Link to="/addproduct" state={{ storeId: store._id }}>
                  <Button size="sm" className="bg-slate-800 hover:bg-slate-900">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No products yet</h3>
                <p className="text-slate-600 mb-6">
                  Start by adding your first product to your store.
                </p>
                {/* Updated Add Product link to pass store ID */}
                <Link to="/addproducts" state={{ storeId: store._id }}>
                  <Button className="bg-slate-800 hover:bg-slate-900">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <Card key={product.id || product._id} className="group hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={product.image || '/api/placeholder/300/200'}
                          alt={product.name || 'Product'}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/300/200';
                          }}
                        />
                        {product.sale_price && (
                          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            SALE
                          </Badge>
                        )}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Link to={`/dashboard/edit/${product.id || product._id}`}>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteProduct(product.id || product._id, product.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                          {product.name || 'Unnamed Product'}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {product.description || 'No description available'}
                        </p>
                        <div className="flex items-center space-x-2 mb-2">
                          {product.sale_price ? (
                            <>
                              <span className="text-xl font-bold text-red-600">${product.sale_price}</span>
                              <span className="text-sm text-slate-500 line-through">${product.price}</span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-slate-900">${product.price || 0}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-slate-600 ml-1">{product.rating || 0}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {product.category || 'Uncategorized'}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Link to={`/products/${product.id || product._id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                          <Link to={`/dashboard/edit/${product.id || product._id}`} className="flex-1">
                            <Button size="sm" className="w-full bg-slate-800 hover:bg-slate-900">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Add New Product</h3>
              <p className="text-slate-600 mb-4">List a new product in your store</p>
              {/* Updated Add Product link to pass store ID */}
              <Link to="/addproducts" state={{ storeId: store._id }}>
                <Button className="bg-slate-800 hover:bg-slate-900">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">View Your Store</h3>
              <p className="text-slate-600 mb-4">See how customers view your store</p>
              <Link to={`/dashboard/store/${store._id}`}>
                <Button variant="outline">
                  View Store
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6 text-center">
              <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-slate-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics</h3>
              <p className="text-slate-600 mb-4">View detailed store analytics</p>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;