import React, { useState, useEffect } from 'react';
import { Package, MapPin, Calendar, CreditCard, Truck, Clock, AlertCircle } from 'lucide-react';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://buyherpower.onrender.com';

const MyOrder = () => {
  // Extract user ID from URL path
  const getUserIdFromUrl = () => {
    const path = window.location.pathname;
    const segments = path.split('/');
    // Assuming URL structure: /MyOrders/userId
    return segments[segments.length - 1];
  };

  const userId = getUserIdFromUrl();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${REACT_APP_API_URL}/api/orders/user/${userId}`);
        const result = await response.json();
        
        if (result.success) {
          setOrders(result.data);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            My Orders
          </h1>
          <p className="mt-2 text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{order.products.length} item(s)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Products */}
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-4">
                      {order.products.map((item) => (
                        <div key={item._id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name}
                              className="h-16 w-16 object-cover rounded-md bg-white"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 truncate">{item.product.name}</h5>
                            <p className="text-sm text-gray-600">Store: {item.store_id.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${(item.price / item.quantity).toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-600" />
                        Shipping Address
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                        <p className="text-gray-700">{order.shippingAddress.addressLine}</p>
                        <p className="text-gray-700">
                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                        </p>
                        <p className="text-gray-700">{order.shippingAddress.country}</p>
                        <p className="text-gray-600 text-sm mt-1">{order.shippingAddress.phone}</p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        Order Details
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items Price:</span>
                          <span className="text-gray-900">${order.itemsPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="text-gray-900">${order.shippingPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="text-gray-900">${order.taxPrice.toFixed(2)}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-gray-900">${order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm text-gray-600">
                            <strong>Payment:</strong> {order.paymentMethod}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Status:</strong> {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(order.notes || order.trackingNumber) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid md:grid-cols-2 gap-6">
                        {order.trackingNumber && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              Tracking Number
                            </h5>
                            <p className="text-gray-700 font-mono bg-gray-50 p-2 rounded">
                              {order.trackingNumber}
                            </p>
                          </div>
                        )}
                        {order.notes && (
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Order Notes</h5>
                            <p className="text-gray-700 bg-gray-50 p-2 rounded">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {order.deliveredAt && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-green-800 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Delivered on {formatDate(order.deliveredAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;