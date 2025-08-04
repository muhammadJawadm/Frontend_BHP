import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, ChevronRight, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { Pagination } from '../../components/ui/pagination';
import { useToast } from '../../hooks/use-toast';

const OrderHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch customer orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://backend-bhp.onrender.com/api/orders/customer?page=${currentPage}&limit=5`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages || 1);
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
    
    fetchOrders();
  }, [currentPage, toast]);
  
  // Handle search
  const filteredOrders = orders.filter(order => 
    order._id?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge className="bg-slate-500">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Orders</h1>
          <p className="text-slate-600">View and manage your order history</p>
        </div>
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search orders by ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Orders Yet</h2>
            <p className="text-slate-600 mb-6">
              You haven't placed any orders yet. Start shopping to fill your order history!
            </p>
            <Link to="/products">
              <Button className="bg-slate-800 hover:bg-slate-900">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-slate-900">Order #{order._id}</h3>
                            {getStatusBadge(order.status)}
                          </div>
                          
                          <div className="flex items-center mt-2 text-sm text-slate-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="font-semibold text-slate-900">${order.total.toFixed(2)}</p>
                          <p className="text-sm text-slate-500">{order.products.length} items</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Products Summary */}
                    <div className="border-t border-slate-200 px-4 py-3 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {order.products.slice(0, 3).map((item, index) => (
                            <div 
                              key={index} 
                              className="h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-white"
                            >
                              {item.product?.image ? (
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package className="h-full w-full p-1 text-slate-300" />
                              )}
                            </div>
                          ))}
                          
                          {order.products.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-600">
                              +{order.products.length - 3}
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-3 text-sm text-slate-600">
                          {order.products.length} products ordered
                        </div>
                      </div>
                      
                      <Link to={`/customer/dashboard/orders/${order._id}`}>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <Pagination.Button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Pagination.Button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Button 
                      key={i}
                      className={currentPage === i + 1 ? "bg-slate-200" : ""}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Button>
                  ))}
                  
                  <Pagination.Button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Pagination.Button>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
