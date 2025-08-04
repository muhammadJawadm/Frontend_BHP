import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
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
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Unable to load order details. Please try again later.');
        
        toast({
          title: "Error Loading Order",
          description: "We couldn't load your order details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, token, toast]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to handle order cancellation
  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`https://backend-bhp.onrender.com/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      
      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled.",
      });
    } catch (error) {
      console.error('Error cancelling order:', error);
      
      toast({
        title: "Cancellation Failed",
        description: "We couldn't cancel your order. Please try again or contact customer support.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-12 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link to="/customer/orders">
            <Button>Return to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  // If we don't have order data yet
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-gray-700 mb-6">The requested order could not be found.</p>
          <Link to="/customer/orders">
            <Button>Return to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-gray-500">Order #{order._id}</p>
          </div>
          <Badge className={`mt-2 sm:mt-0 px-3 py-1 text-sm ${getStatusColor(order.status)}`}>
            {order.status}
          </Badge>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Order Information</h3>
                <p>Date Placed: {formatDate(order.createdAt)}</p>
                <p>Order Status: {order.status}</p>
                {order.paymentInfo && (
                  <p>Payment Method: {order.paymentInfo.method}</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p>{order.shippingInfo.fullName}</p>
                <p>{order.shippingInfo.address}</p>
                <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}</p>
                <p>{order.shippingInfo.country}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row justify-between sm:items-center py-3 border-b last:border-b-0">
                    <div className="flex items-center">
                      {item.product && item.product.image && (
                        <div className="w-16 h-16 mr-4">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{item.product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="font-bold mt-2 sm:mt-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>${order.totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping:</p>
                <p>$0.00</p>
              </div>
              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>
            
            {order.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Order Notes</h3>
                  <p className="text-gray-700">{order.notes}</p>
                </div>
              </>
            )}
            
            {order.status === 'processing' && (
              <>
                <Separator />
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleCancelOrder}
                  >
                    Cancel Order
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {order.status === 'shipped' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Shipment Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Your order is on its way! Track the status of your shipment below.</p>
                
                {order.trackingInfo ? (
                  <div>
                    <p className="mb-2">
                      <span className="font-medium">Carrier:</span> {order.trackingInfo.carrier}
                    </p>
                    <p className="mb-4">
                      <span className="font-medium">Tracking Number:</span> {order.trackingInfo.trackingNumber}
                    </p>
                    <Link to={`/track-order/${order._id}`}>
                      <Button>Track Package</Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Tracking information will be available soon.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-between">
          <Link to="/customer/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
          
          {order.status === 'delivered' && (
            <Link to={`/customer/review-order/${order._id}`}>
              <Button>Write a Review</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
