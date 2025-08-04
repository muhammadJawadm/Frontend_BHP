import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { X, Filter, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useSearchParams } from 'react-router-dom';
import { mockStores } from '../data/mock';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showSaleOnly, setShowSaleOnly] = useState(searchParams.get('sale') === 'true');

  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  React.useEffect(() => {
    fetch('https://backend-bhp.onrender.com/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Dynamically extract categories from products
  const categories = useMemo(() => {
    const cats = new Set();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [products]);
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (searchQuery) {
      filtered = filtered.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }
    if (selectedStores.length > 0) {
      filtered = filtered.filter(product => selectedStores.includes(product.storeId?.toString()));
    }
    // Add price range and sale filter logic if needed
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price) - (b.price);
        case 'price-high':
          return (b.price) - (a.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return filtered;
  }, [products, searchQuery, selectedCategories, selectedStores, priceRange, showSaleOnly, sortBy]);

  const handleCategoryChange = (category, checked) => {
    setSelectedCategories(prev => 
      checked 
        ? [...prev, category]
        : prev.filter(c => c !== category)
    );
  };

  const handleStoreChange = (storeId, checked) => {
    setSelectedStores(prev => 
      checked 
        ? [...prev, storeId]
        : prev.filter(s => s !== storeId)
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStores([]);
    setPriceRange('all');
    setShowSaleOnly(false);
    setSearchParams({});
  };

  const getStoreName = (storeId) => {
    const store = mockStores.find(s => s.id === storeId);
    return store ? store.name : 'Unknown Store';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-slate-600">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-low">Price (Low to High)</SelectItem>
                      <SelectItem value="price-high">Price (High to Low)</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sale Items */}
                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sale-only"
                      checked={showSaleOnly}
                      onCheckedChange={setShowSaleOnly}
                    />
                    <label htmlFor="sale-only" className="text-sm font-medium text-slate-700">
                      Sale Items Only
                    </label>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                        />
                        <label htmlFor={category} className="text-sm text-slate-600">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stores */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Stores</h3>
                  <div className="space-y-2">
                    {mockStores.map(store => (
                      <div key={store.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`store-${store.id}`}
                          checked={selectedStores.includes(store.id.toString())}
                          onCheckedChange={(checked) => handleStoreChange(store.id.toString(), checked)}
                        />
                        <label htmlFor={`store-${store.id}`} className="text-sm text-slate-600">
                          {store.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-50">Under $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-200">$100 - $200</SelectItem>
                      <SelectItem value="over-200">Over $200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full text-slate-600 hover:text-slate-800"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg mb-4">No products found matching your criteria</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div className="text-xs text-slate-500 mb-1">
                          {getStoreName(product.store_id)}
                        </div>
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
    </div>
  );
};

export default Products;