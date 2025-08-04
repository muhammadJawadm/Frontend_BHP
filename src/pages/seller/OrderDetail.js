import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Truck, MapPin, CheckCircle, RefreshCw, 
  XCircle, Printer, Download, ExternalLink, MoreHorizontal, Mail 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../components/ui/dropdown-menu';
import { useToast } from '../../hooks/use-toast';

const SellerOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/orders/seller/${orderId}`, {
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
  
  const handleUpdateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      setOrder(prev => ({ ...prev, status: newStatus }));
      
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}.`
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Get status badge and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          badge: <Badge className="bg-yellow-500">Pending</Badge>,
          icon: <RefreshCw className="h-5 w-5 text-yellow-500" />,
          nextAction: 'Process',
          nextStatus: 'processing'
        };
      case 'processing':
        return {
          badge: <Badge className="bg-blue-500">Processing</Badge>,
          icon: <Package className="h-5 w-5 text-blue-500" />,
          nextAction: 'Ship',
          nextStatus: 'shipped'
        };
      case 'shipped':
        return {
          badge: <Badge className="bg-purple-500">Shipped</Badge>,
          icon: <Truck className="h-5 w-5 text-purple-500" />,
          nextAction: 'Mark Delivered',
          nextStatus: 'delivered'
        };
      case 'delivered':
        return {
          badge: <Badge className="bg-green-500">Delivered</Badge>,
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          nextAction: null,
          nextStatus: null
        };
      case 'cancelled':
        return {
          badge: <Badge className="bg-red-500">Cancelled</Badge>,
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          nextAction: null,
          nextStatus: null
        };
      default:
        return {
          badge: <Badge className="bg-slate-500">Unknown</Badge>,
          icon: null,
          nextAction: null,
          nextStatus: null
        };
    }
  };
  
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Order Not Found</h1>
          <Button 
            onClick={() => navigate('/seller/orders')} 
            className="bg-slate-800 hover:bg-slate-900"
          >
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }
  
  const statusInfo = getStatusInfo(order.status);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/seller/orders')}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order #{order._id}</h1>
            <p className="text-slate-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            {statusInfo.badge}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusInfo.nextStatus && (
                  <DropdownMenuItem 
                    onClick={() => handleUpdateStatus(statusInfo.nextStatus)}
                    disabled={updatingStatus}
                  >
                    {statusInfo.nextAction}
                  </DropdownMenuItem>
                )}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <DropdownMenuItem 
                    onClick={() => handleUpdateStatus('cancelled')}
                    disabled={updatingStatus}
                  >
                    Cancel Order
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Order
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </DropdownMenuItem>
                {order.customer?.email && (
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Customer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Order Status */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress Bar */}
              <div className="absolute left-9 top-0 h-full border-l-2 border-slate-200"></div>
              
              {/* Status Steps */}
              <div className="space-y-8">
                <div className="relative flex items-start">
                  <div className="absolute left-0 mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-green-600">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-12">
                    <div className="text-sm font-medium text-slate-900">Order Placed</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className={`absolute left-0 mt-1 flex h-7 w-7 items-center justify-center rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-600' : 'bg-slate-300'}`}>
                    {['processing', 'shipped', 'delivered'].includes(order.status) ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <RefreshCw className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="ml-12">
                    <div className={`text-sm font-medium ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-slate-900' : 'text-slate-500'}`}>
                      Processing
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {order.status === 'pending' ? (
                        <span>Waiting to be processed</span>
                      ) : (
                        <span>Order processed on {formatDate(order.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className={`absolute left-0 mt-1 flex h-7 w-7 items-center justify-center rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-green-600' : 'bg-slate-300'}`}>
                    {['shipped', 'delivered'].includes(order.status) ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Truck className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="ml-12">
                    <div className={`text-sm font-medium ${['shipped', 'delivered'].includes(order.status) ? 'text-slate-900' : 'text-slate-500'}`}>
                      Shipped
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {order.status === 'shipped' || order.status === 'delivered' ? (
                        <span>Order shipped on {formatDate(order.updatedAt)}</span>
                      ) : (
                        <span>Not yet shipped</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className={`absolute left-0 mt-1 flex h-7 w-7 items-center justify-center rounded-full ${order.status === 'delivered' ? 'bg-green-600' : 'bg-slate-300'}`}>
                    {order.status === 'delivered' ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Package className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="ml-12">
                    <div className={`text-sm font-medium ${order.status === 'delivered' ? 'text-slate-900' : 'text-slate-500'}`}>
                      Delivered
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {order.status === 'delivered' ? (
                        <span>Order delivered on {formatDate(order.updatedAt)}</span>
                      ) : (
                        <span>Not yet delivered</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.products.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row border-b border-slate-200 pb-4 last:border-0 last:pb-0">
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
                            {item.product?.name || 'Product'}
                          </h3>
                          <p className="text-sm text-slate-500">
                            SKU: {item.product?.sku || item.productId?.substring(0, 8) || 'N/A'}
                          </p>
                          <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                        </div>
                        
                        <div className="mt-2 sm:mt-0 text-right">
                          <p className="font-medium">${item.price?.toFixed(2) || '0.00'}</p>
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
            
            {/* Order Notes */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {order.notes ? (
                  <p className="text-slate-700">{order.notes}</p>
                ) : (
                  <p className="text-slate-500 italic">No notes for this order</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Customer and Order Summary */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-slate-500" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="font-medium text-slate-900">
                    {order.customer?.name || 'Customer'}
                  </h3>
                  
                  {order.customer?.email && (
                    <div className="mt-2 flex items-center">
                      <Mail className="h-4 w-4 text-slate-500 mr-2" />
                      <a href={`mailto:${order.customer.email}`} className="text-blue-600 hover:underline">
                        {order.customer.email}
                      </a>
                    </div>
                  )}
                  
                  {order.shipping && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <h4 className="font-medium text-slate-900 mb-1">Shipping Address:</h4>
                      <p className="text-sm text-slate-700">{order.shipping.address}</p>
                      <p className="text-sm text-slate-700">
                        {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                      </p>
                      <p className="text-sm text-slate-700">{order.shipping.country}</p>
                      {order.shipping.phone && (
                        <p className="text-sm text-slate-700 mt-1">{order.shipping.phone}</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Order Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal:</span>
                    <span>${order.subtotal?.toFixed(2) || order.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping:</span>
                    <span>${order.shipping_cost?.toFixed(2) || '0.00'}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax:</span>
                    <span>${order.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${order.total?.toFixed(2) || '0.00'}</span>
                  </div>
                  
                  <div className="pt-4 text-sm text-slate-500">
                    <p>Payment Method:</p>
                    <p className="font-medium">Credit Card {order.payment?.last4 && `(ending in ${order.payment.last4})`}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <div className="flex flex-col space-y-3">
              {statusInfo.nextStatus && (
                <Button 
                  className="bg-slate-800 hover:bg-slate-900 w-full"
                  onClick={() => handleUpdateStatus(statusInfo.nextStatus)}
                  disabled={updatingStatus}
                >
                  {statusInfo.nextAction} Order
                </Button>
              )}
              
              {(order.status === 'pending' || order.status === 'processing') && (
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 w-full"
                  onClick={() => handleUpdateStatus('cancelled')}
                  disabled={updatingStatus}
                >
                  Cancel Order
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <Printer className="h-4 w-4 mr-2" />
                Print Order Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetail;
