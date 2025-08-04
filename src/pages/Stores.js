import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, Search, Users, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockStores } from '../data/mock';

const Stores = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredStores = useMemo(() => {
    let filtered = mockStores;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort stores
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'products':
          return b.total_products - a.total_products;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">All Stores</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover amazing products from our verified sellers. Each store offers unique items with quality guarantee.
          </p>
        </div>

        {/* Search and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="products">Most Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Stores Grid */}
        {filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg mb-4">No stores found matching your search</p>
            <Button onClick={() => setSearchQuery('')} variant="outline">
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map(store => (
              <Card key={store.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-0">
                  {/* Store Banner */}
                  <div className="relative h-32 overflow-hidden rounded-t-lg">
                    <img
                      src={store.banner}
                      alt={`${store.name} banner`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6">
                    {/* Store Logo and Name */}
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-lg -mt-8 z-10 relative"
                      />
                      <div className="flex-1 mt-2">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                          {store.name}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-slate-700">{store.rating}</span>
                          <span className="text-sm text-slate-500">rating</span>
                        </div>
                      </div>
                    </div>

                    {/* Store Description */}
                    <p className="text-slate-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {store.description}
                    </p>

                    {/* Store Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>{store.total_products} products</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Verified seller</span>
                      </div>
                    </div>

                    {/* Visit Store Button */}
                    <Link to={`/stores/${store.id}`}>
                      <Button className="w-full bg-slate-800 hover:bg-slate-900 group-hover:bg-slate-700 transition-colors">
                        Visit Store
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Want to Start Your Own Store?</h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Join thousands of successful sellers on MarketHub. Start selling your products today and reach customers worldwide.
          </p>
          <Link to="/seller/signup">
            <Button size="lg" className="bg-slate-800 hover:bg-slate-900">
              Become a Seller
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Stores;