import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';
import { getStoreById } from '../data/mock';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    getCartItemsWithDetails, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotal,
    getCartCount 
  } = useCart();
  const { toast } = useToast();

  const cartItems = getCartItemsWithDetails();
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart.",
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast({
      title: "Item Removed",
      description: `${productName} has been removed from your cart.`,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const orderProducts = cartItems.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.product?.price || 0
      }));
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ products: orderProducts, total: cartTotal })
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Checkout Successful!",
          description: `Order placed for ${cartCount} items. Total: $${cartTotal.toFixed(2)}`,
        });
        clearCart();
        navigate('/customer/dashboard');
      } else {
        toast({
          title: "Checkout Failed",
          description: data.message || 'Could not place order',
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Checkout Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-slate-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <div className="space-y-4">
              <Link to="/products">
                <Button size="lg" className="bg-slate-800 hover:bg-slate-900">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Start Shopping
                </Button>
              </Link>
              <div>
                <Link to="/products?sale=true" className="text-red-600 hover:text-red-700 font-medium">
                  Check out our sale items →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                Shopping Cart ({cartCount} items)
              </h1>
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {cartItems.map(item => {
                const store = getStoreById(item.product.store_id);
                return (
                  <Card key={item.productId} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Product Image */}
                        <div className="sm:w-32 h-32 relative">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          {item.product.sale_price && (
                            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs">
                              SALE
                            </Badge>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 p-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1 mb-4 sm:mb-0">
                              <Link 
                                to={`/products/${item.product.id}`}
                                className="text-lg font-semibold text-slate-900 hover:text-slate-700 line-clamp-2"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-sm text-slate-600 mt-1">
                                Sold by {store?.name || 'Unknown Store'}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                {item.product.sale_price ? (
                                  <>
                                    <span className="text-lg font-bold text-red-600">
                                      ${item.product.sale_price}
                                    </span>
                                    <span className="text-sm text-slate-500 line-through">
                                      ${item.product.price}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-slate-900">
                                    ${item.product.price}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between sm:flex-col sm:items-end space-y-2">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="flex items-center space-x-4">
                                <span className="font-semibold text-slate-900">
                                  ${item.totalPrice.toFixed(2)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(item.productId, item.product.name)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link to="/products">
                <Button variant="outline" className="text-slate-600 hover:text-slate-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <hr className="border-slate-200" />
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>${(cartTotal * 1.08).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-slate-800 hover:bg-slate-900 mb-4"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    Secure checkout powered by MarketHub
                  </p>
                </div>

                {/* Savings Summary */}
                {cartItems.some(item => item.product.sale_price) && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      🎉 You're saving ${cartItems.reduce((savings, item) => {
                        if (item.product.sale_price) {
                          return savings + ((item.product.price - item.product.sale_price) * item.quantity);
                        }
                        return savings;
                      }, 0).toFixed(2)} on this order!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;