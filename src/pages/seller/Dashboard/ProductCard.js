import React from 'react';
import { Edit, Trash2, Eye, Star } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '../../../components/ui/UIComponents';

const ProductCard = ({ product, handleEditProduct, handleDeleteProduct }) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={Array.isArray(product.images) ? product.images[0] : (product.image || 'https://via.placeholder.com/300x200?text=Product')}
            alt={product.name || 'Product'}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Product';
            }}
          />
          {product.sale_price && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
              SALE
            </Badge>
          )}
          <div className="absolute top-2 right-2 flex space-x-1">
            {/* <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleEditProduct(product.id || product._id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteProduct(product.id || product._id, product.name)}
            >
              <Trash2 className="h-4 w-4" />
            </Button> */}
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
                <span className="text-xl font-bold text-red-600">Rs.{product.sale_price}</span>
                <span className="text-sm text-slate-500 line-through">Rs.{product.price}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-slate-900">Rs.{product.price || 0}</span>
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
            <Button variant="outline" size="sm" className="w-full flex-1" onClick={() => handleDeleteProduct(product.id || product._id, product.name)} >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button disabled={true}
              size="sm" 
              className="w-full flex-1 bg-slate-800 hover:bg-slate-900"
              onClick={() => handleEditProduct(product.id || product._id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
