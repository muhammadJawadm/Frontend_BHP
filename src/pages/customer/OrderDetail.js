import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, CheckCircle, RefreshCw, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
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
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, toast]);
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-slate-500" />;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }
  
  if (!order) {
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
          
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h2>
            <p className="text-slate-600 mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link to="/customer/dashboard/orders">
              <Button className="bg-slate-800 hover:bg-slate-900">Return to Orders</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Order #{order._id}</h1>
              <p className="text-slate-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Badge className={`
                text-white
                ${order.status === 'pending' ? 'bg-yellow-500' : ''}
                ${order.status === 'processing' ? 'bg-blue-500' : ''}
                ${order.status === 'shipped' ? 'bg-purple-500' : ''}
                ${order.status === 'delivered' ? 'bg-green-500' : ''}
                ${order.status === 'cancelled' ? 'bg-red-500' : ''}
              `}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Order Status Timeline */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            
            <div className="relative">
              {/* Progress Bar */}
              <div className="hidden md:block absolute left-8 top-0 ml-px border-l-2 h-full border-slate-200"></div>
              
              {/* Status Steps */}
              <div className="space-y-6">
                {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                  const isCompleted = 
                    ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= 
                    ['pending', 'processing', 'shipped', 'delivered'].indexOf(status);
                  
                  const isCurrent = order.status === status;
                  
                  return (
                    <div key={status} className="flex items-start">
                      <div className={`
                        relative flex items-center justify-center w-8 h-8 rounded-full z-10
                        ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}
                        ${isCurrent ? 'ring-2 ring-green-200 ring-offset-2' : ''}
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <span className="h-4 w-4 rounded-full bg-white"></span>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <h3 className={`font-medium ${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {status === 'pending' && 'Order has been received'}
                          {status === 'processing' && 'Order is being processed'}
                          {status === 'shipped' && 'Order has been shipped'}
                          {status === 'delivered' && 'Order has been delivered'}
                        </p>
                        {order.statusUpdates && order.statusUpdates[status] && (
                          <p className="text-xs text-slate-400 mt-1">
                            {formatDate(order.statusUpdates[status])}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Items */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            
            <div className="space-y-6">
              {order.products.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row border-b border-slate-200 pb-6 last:border-0 last:pb-0">
                  <div className="sm:w-20 h-20 bg-slate-100 rounded flex-shrink-0 mb-4 sm:mb-0 overflow-hidden">
                    {item.product?.image ? (
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-8 w-8 text-slate-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="sm:ml-6 flex flex-col sm:flex-row sm:justify-between flex-grow">
                    <div>
                      <h3 className="font-medium">
                        {item.product?.name || 'Product Name'}
                      </h3>
                      <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                    </div>
                    
                    <div className="mt-2 sm:mt-0">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-slate-500">
                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Order Summary and Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-slate-400" />
                Shipping Information
              </h2>
              
              <div className="space-y-2">
                <p className="font-medium">
                  {order.shipping?.fullName || user?.name || 'Customer Name'}
                </p>
                
                {order.shipping ? (
                  <>
                    <p>{order.shipping.address}</p>
                    <p>
                      {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                    </p>
                    <p>{order.shipping.country}</p>
                    <p className="mt-2">{order.shipping.phone}</p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    No shipping details available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span>${order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping:</span>
                  <span>${order.shipping_cost?.toFixed(2) || '0.00'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax:</span>
                  <span>${order.tax?.toFixed(2) || '0.00'}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    Payment Method: <span className="font-medium">Credit Card</span>
                    {order.payment?.last4 && ` ending in ${order.payment.last4}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
