import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useToast } from '../../hooks/use-toast';

const CustomerOrders = () => {
  // Get auth context
  const auth = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get token from localStorage instead of context to ensure it's always fresh
        const token = localStorage.getItem('token');
        
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "You need to be logged in to view orders",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        const response = await fetch('https://backend-bhp.onrender.com/api/orders/customer', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error Loading Orders",
          description: "We couldn't load your orders. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map(order => (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-base sm:text-lg">
                        Order #{order._id.substring(0, 8)}...
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={`mt-2 sm:mt-0 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <p className="font-medium">Items:</p>
                          <ul className="mt-1 space-y-1">
                            {order.orderItems.map((item, index) => (
                              <li key={index} className="text-sm">
                                {item.quantity}x {item.product?.name || 'Product'}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:text-right">
                          <p className="font-medium">Total:</p>
                          <p className="text-lg font-bold">${order.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap justify-between items-center pt-2">
                        <div>
                          <p className="text-sm">
                            Shipping to: {order.shippingInfo.city}, {order.shippingInfo.country}
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-0">
                          <Link to={`/order-details/${order._id}`}>
                            <Button variant="outline" className="mr-2">View Details</Button>
                          </Link>
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <Link to={`/track-order/${order._id}`}>
                              <Button>Track Order</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No orders found</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `You don't have any ${activeTab} orders.`}
              </p>
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerOrders;
