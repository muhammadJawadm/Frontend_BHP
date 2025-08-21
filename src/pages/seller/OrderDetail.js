import React, { useState, useEffect } from 'react';
import { ChevronDown, Package, User, CreditCard, Truck, MapPin, Phone, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  // Simulating route params - in real app, this would come from useParams()

  const { storeId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState({ orderId: null, type: null });

  // Status options
  const orderStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
  const paymentStatusOptions = ['Pending', 'Paid', 'Failed', 'Refunded'];

  useEffect(() => {
    fetchOrders();
  }, [storeId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log(`Fetching orders for store ID: ${storeId}`);
      const response = await fetch(`http://localhost:5000/api/orders/store/${storeId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error fetching orders');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, orderStatus, trackingNumber = null) => {
    try {
      setUpdating({ orderId, type: 'order' });
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderStatus,
          ...(trackingNumber && { trackingNumber })
        }),
      });

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus, ...(trackingNumber && { trackingNumber }) }
            : order
        ));
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      alert('Error updating order status');
      console.error('Error:', err);
    } finally {
      setUpdating({ orderId: null, type: null });
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      setUpdating({ orderId, type: 'payment' });
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus }),
      });

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, paymentStatus }
            : order
        ));
      } else {
        alert('Failed to update payment status');
      }
    } catch (err) {
      alert('Error updating payment status');
      console.error('Error:', err);
    } finally {
      setUpdating({ orderId: null, type: null });
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

  const getStatusColor = (status, type) => {
    const colors = {
      order: {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'Shipped': 'bg-purple-100 text-purple-800',
        'Delivered': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800',
        'Returned': 'bg-gray-100 text-gray-800'
      },
      payment: {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Paid': 'bg-green-100 text-green-800',
        'Failed': 'bg-red-100 text-red-800',
        'Refunded': 'bg-orange-100 text-orange-800'
      }
    };
    return colors[type][status] || 'bg-gray-100 text-gray-800';
  };

  const StatusDropdown = ({ currentStatus, options, onUpdate, orderId, type }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState('');
    const [showTrackingInput, setShowTrackingInput] = useState(false);
    const isUpdating = updating.orderId === orderId && updating.type === type;

    const handleStatusChange = (newStatus) => {
      if (type === 'order' && newStatus === 'Shipped') {
        setShowTrackingInput(true);
        setIsOpen(false);
      } else {
        onUpdate(orderId, newStatus, type === 'order' ? trackingNumber : undefined);
        setIsOpen(false);
      }
    };

    const handleTrackingSubmit = () => {
      onUpdate(orderId, 'Shipped', trackingNumber);
      setShowTrackingInput(false);
      setTrackingNumber('');
    };

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isUpdating}
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus, type)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'} transition-opacity`}
        >
          <span>{isUpdating ? 'Updating...' : currentStatus}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {options.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                  status === currentStatus ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {showTrackingInput && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
            <h4 className="font-medium text-gray-900 mb-2">Enter Tracking Number</h4>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleTrackingSubmit}
                disabled={!trackingNumber.trim()}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setShowTrackingInput(false);
                  setTrackingNumber('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Store Orders</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Package className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusDropdown
                      currentStatus={order.orderStatus}
                      options={orderStatusOptions}
                      onUpdate={updateOrderStatus}
                      orderId={order._id}
                      type="order"
                    />
                    <StatusDropdown
                      currentStatus={order.paymentStatus}
                      options={paymentStatusOptions}
                      onUpdate={updatePaymentStatus}
                      orderId={order._id}
                      type="payment"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h4 className="flex items-center space-x-2 font-semibold text-gray-900">
                      <User className="w-5 h-5" />
                      <span>Customer Information</span>
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {order.shippingAddress.addressLine}
                      </p>
                      <p className="text-sm text-gray-600 ml-6">
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-sm text-gray-600 ml-6">
                        {order.shippingAddress.country}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <h4 className="flex items-center space-x-2 font-semibold text-gray-900">
                      <DollarSign className="w-5 h-5" />
                      <span>Order Summary</span>
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Items Price:</span>
                        <span>Rs. {order.itemsPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span>Rs. {order.shippingPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax:</span>
                        <span>Rs. {order.taxPrice}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>Rs. {order.totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-3 pt-2 border-t">
                        <span>Payment Method:</span>
                        <span className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-1" />
                          {order.paymentMethod}
                        </span>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex justify-between text-sm">
                          <span>Tracking:</span>
                          <span className="flex items-center">
                            <Truck className="w-4 h-4 mr-1" />
                            {order.trackingNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                  <div className="space-y-4">
                    {order.products.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Unit Price: Rs. {item.product.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">Rs. {item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {order.notes && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Order Notes</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">There are no orders for this store yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;