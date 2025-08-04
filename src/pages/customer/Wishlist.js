import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../hooks/use-toast';

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://backend-bhp.onrender.com/api/wishlist', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }
        
        const data = await response.json();
        setWishlistItems(data.items || []);
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, [toast]);
  
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://backend-bhp.onrender.com/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }
      
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
      
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id || product.id, 1);
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
          />
        ))}
        <span className="ml-2 text-xs text-slate-500">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Wishlist</h1>
          <p className="text-slate-600">
            Save items you like and come back to them later
          </p>
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-slate-600 mb-6">
              Save items you like by clicking the heart icon on products
            </p>
            <Link to="/products">
              <Button className="bg-slate-800 hover:bg-slate-900">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.productId} className="overflow-hidden h-full flex flex-col">
                <div className="relative">
                  <Link to={`/products/${item.product._id || item.product.id}`}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-48 w-full object-cover"
                    />
                  </Link>
                  
                  {item.product.sale_price && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                      SALE
                    </Badge>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-white bg-opacity-70 hover:bg-red-50 text-red-500 rounded-full"
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="p-4 flex-grow flex flex-col">
                  <Link 
                    to={`/products/${item.product._id || item.product.id}`}
                    className="text-lg font-semibold text-slate-900 hover:text-slate-700 line-clamp-2 mb-1"
                  >
                    {item.product.name}
                  </Link>
                  
                  <div className="mb-2">
                    <StarRating rating={item.product.rating || 0} />
                  </div>
                  
                  <div className="mb-2">
                    {item.product.sale_price ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          ${item.product.sale_price.toFixed(2)}
                        </span>
                        <span className="text-sm text-slate-500 line-through">
                          ${item.product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-slate-900">
                        ${item.product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {item.product.description}
                  </p>
                  
                  <div className="mt-auto">
                    <Button 
                      onClick={() => handleAddToCart(item.product)}
                      className="w-full bg-slate-800 hover:bg-slate-900"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
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

export default Wishlist;
