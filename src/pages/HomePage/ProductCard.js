import React from 'react';
import { Heart, Star, Eye, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const ProductCard = ({ product, onAddToCart }) => {
  // Calculate discount percentage
  const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  const discount = calculateDiscount(product.price, product.sale_price);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
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
          {product.sale_price ? (
            <>
              <span className="text-xl font-bold text-red-600">Rs.{product.sale_price}</span>
              <span className="text-sm text-gray-500 line-through">Rs.{product.price}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">Rs.{product.price}</span>
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
        
        <div className="flex gap-2 w-full">
          <Link 
            to={`/viewproduct/${product._id}`}
            className="flex-1"
          >
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Details</span>
            </button>
          </Link>

          <button 
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-slate-800 text-white py-2 px-3 rounded-md hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;