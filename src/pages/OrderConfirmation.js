import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch(`https://backend-bhp.onrender.com/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Unable to load order details. Please try again later.');
        setLoading(false);
        
        toast({
          title: "Error Loading Order",
          description: "We couldn't load your order details. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, token, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-3xl">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If we don't have order data yet, use placeholder data for the UI
  const orderData = order || {
    _id: orderId,
    createdAt: new Date().toISOString(),
    shippingInfo: {
      fullName: 'Loading...',
      address: 'Loading...',
      city: 'Loading...',
      state: 'Loading...',
      postalCode: 'Loading...',
      country: 'Loading...'
    },
    orderItems: [],
    totalPrice: 0,
    status: 'processing'
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Confirmation</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
            {orderData.status}
          </span>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Thank you for your order!</CardTitle>
              <p className="text-sm text-gray-500">
                Order Placed: {formatDate(orderData.createdAt)}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium mb-2">Order Number:</p>
              <p className="bg-gray-100 p-2 rounded">{orderData._id}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p>{orderData.shippingInfo.fullName}</p>
                <p>{orderData.shippingInfo.address}</p>
                <p>
                  {orderData.shippingInfo.city}, {orderData.shippingInfo.state} {orderData.shippingInfo.postalCode}
                </p>
                <p>{orderData.shippingInfo.country}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Payment Information</h3>
                <p>Payment Method: Credit Card</p>
                <p>Total: ${orderData.totalPrice?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-4">Order Summary</h3>
              
              {orderData.orderItems && orderData.orderItems.length > 0 ? (
                <div className="space-y-4">
                  {orderData.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        {item.product && (
                          <div className="w-16 h-16 mr-3">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{item.product?.name || 'Product'}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p>${(item.price || 0).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No items in this order.</p>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>${orderData.totalPrice?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping:</p>
                <p>$0.00</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>${orderData.totalPrice?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
            <Link to="/customer/orders">
              <Button variant="outline">View All Orders</Button>
            </Link>
            <Link to="/">
              <Button>Continue Shopping</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-2">What's Next?</h3>
          <p className="mb-4">
            You will receive an email confirmation shortly at your registered email address.
            We'll notify you when your order ships.
          </p>
          <p className="text-sm text-gray-600">
            If you have any questions about your order, please contact our customer support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
