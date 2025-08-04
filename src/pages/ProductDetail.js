import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Plus, Minus, Store } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { getProductById, getStoreById, getProductsByStore } from '../data/mock';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();
  const { toast } = useToast();

  const product = getProductById(parseInt(id));
  const store = product ? getStoreById(product.store_id) : null;
  const relatedProducts = store ? getProductsByStore(store.id).filter(p => p.id !== product.id).slice(0, 4) : [];

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button className="bg-slate-800 hover:bg-slate-900">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Login Required",
        description: "Please login as a customer to add items to cart.",
        variant: "destructive",
      });
      navigate('/customer/login');
      return;
    }

    if (!isCustomer()) {
      toast({
        title: "Access Denied",
        description: "Only customers can add items to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product.id, quantity);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const currentPrice = product.sale_price || product.price;
  const savings = product.sale_price ? product.price - product.sale_price : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
            />
            {product.sale_price && (
              <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white">
                SALE
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg text-slate-600 ml-1">{product.rating}</span>
                </div>
                <Badge variant="secondary">{product.category}</Badge>
                {product.in_stock ? (
                  <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Store Info */}
            {store && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div>
                      <Link 
                        to={`/stores/${store.id}`}
                        className="font-medium text-slate-900 hover:text-slate-700"
                      >
                        {store.name}
                      </Link>
                      <div className="flex items-center text-sm text-slate-600">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{store.rating} • {store.total_products} products</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                {product.sale_price ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">${product.sale_price}</span>
                    <span className="text-xl text-slate-500 line-through">${product.price}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-slate-900">${product.price}</span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-green-600 font-medium">You save ${savings}!</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            {product.in_stock && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-slate-700">Quantity:</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-slate-800 hover:bg-slate-900"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isInCart(product.id) ? 'Add More to Cart' : 'Add to Cart'}
                  </Button>
                  <Button variant="outline" size="lg" className="px-8">
                    Buy Now
                  </Button>
                </div>

                <p className="text-sm text-slate-600">
                  Total: <span className="font-semibold">${(currentPrice * quantity).toFixed(2)}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">More from {store.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Card key={relatedProduct.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {relatedProduct.sale_price && (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                          SALE
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {relatedProduct.sale_price ? (
                          <>
                            <span className="text-lg font-bold text-red-600">${relatedProduct.sale_price}</span>
                            <span className="text-sm text-slate-500 line-through">${relatedProduct.price}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-slate-900">${relatedProduct.price}</span>
                        )}
                      </div>
                      <div className="flex items-center mb-3">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-600 ml-1">{relatedProduct.rating}</span>
                      </div>
                      <Link to={`/products/${relatedProduct.id}`}>
                        <Button className="w-full bg-slate-800 hover:bg-slate-900">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;