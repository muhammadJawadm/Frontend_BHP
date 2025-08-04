import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Package, Users, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { getStoreById, getProductsByStore, categories } from '../data/mock';

const StoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const store = getStoreById(parseInt(id));
  const allProducts = store ? getProductsByStore(store.id) : [];

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.sale_price || a.price) - (b.sale_price || b.price);
        case 'price-high':
          return (b.sale_price || b.price) - (a.sale_price || a.price);
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [allProducts, selectedCategory, sortBy]);

  // Get unique categories for this store
  const storeCategories = [...new Set(allProducts.map(product => product.category))];

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Store Not Found</h1>
          <Link to="/stores">
            <Button className="bg-slate-800 hover:bg-slate-900">
              Back to Stores
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Store Header */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={store.banner}
          alt={`${store.name} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Store Info Card */}
        <div className="relative -mt-16 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
                />
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{store.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-medium text-slate-700">{store.rating}</span>
                      <span className="text-slate-500">rating</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Package className="h-4 w-4" />
                      <span>{store.total_products} products</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Users className="h-4 w-4" />
                      <span>Verified seller</span>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-4 max-w-3xl">
                    {store.description}
                  </p>
                  
                  {/* Contact Info (Mock) */}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>contact@{store.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>New York, USA</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Products ({filteredProducts.length})</h2>
              <p className="text-slate-600">Browse all products from {store.name}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All categories..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {storeCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-4">
                {selectedCategory === 'all' 
                  ? "This store doesn't have any products yet" 
                  : `No products found in ${selectedCategory} category`
                }
              </p>
              {selectedCategory !== 'all' && (
                <Button onClick={() => setSelectedCategory('all')} variant="outline">
                  View All Products
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {product.sale_price && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                          SALE
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-2 mb-2">
                        {product.sale_price ? (
                          <>
                            <span className="text-xl font-bold text-red-600">${product.sale_price}</span>
                            <span className="text-sm text-slate-500 line-through">${product.price}</span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-slate-900">${product.price}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-slate-600 ml-1">{product.rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>
                      <Link to={`/products/${product.id}`}>
                        <Button className="w-full bg-slate-800 hover:bg-slate-900">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;