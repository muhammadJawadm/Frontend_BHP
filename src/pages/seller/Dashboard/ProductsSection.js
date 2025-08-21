import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Button } from '../../../components/ui/UIComponents';
import ProductCard from './ProductCard';

const ProductsSection = ({ 
  products, 
  sortedProducts, 
  sortBy, 
  setSortBy, 
  storeId, 
  store, 
  error,
  handleEditProduct,
  handleDeleteProduct 
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle>Your Products ({products.length})</CardTitle>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="price">Sort by Price</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
              </SelectContent>
            </Select>
            <Link to="/AddProduct" state={{ storeId, store }}>
              <Button size="sm" className="bg-slate-800 hover:bg-slate-900 w-36">
                <Plus className="h-4 w-4" />
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
              {error && <span className="block text-red-500 text-sm mt-2">Check API connection for products.</span>}
            </p>
            <Link to={`/addproduct/${storeId}`} state={{ storeId, store }}>
              <Button className="bg-slate-800 hover:bg-slate-900">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map(product => (
              <ProductCard 
                key={product.id || product._id}
                product={product}
                handleEditProduct={handleEditProduct}
                handleDeleteProduct={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsSection;