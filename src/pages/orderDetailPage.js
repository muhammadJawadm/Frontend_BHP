import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  Store,
  Calendar,
  Package,
  ArrowLeft,
  Minus,
  Plus,
  Share2,
  Clock,
  CheckCircle,
  User,
  MapPin,
  CreditCard,
  StickyNote,
  Download
} from 'lucide-react';

// UI Components
const Button = ({ children, className = "", variant = "default", size = "default", onClick, disabled, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
    outline: "border-2 border-gray-300 bg-white hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100"
  };
  const sizes = {
    default: "h-12 py-3 px-6 text-base",
    sm: "h-9 px-3 text-sm",
    lg: "h-14 px-8 text-lg"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    sale: "bg-red-500 text-white"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

// Order Success Modal Component
const OrderSuccessModal = ({ isOpen, onClose, orderData }) => {
  const downloadReceipt = () => {
    const receiptContent = `
      ORDER RECEIPT
      =============
      
      Order ID: ${orderData?._id}
      Date: ${new Date(orderData?.createdAt).toLocaleDateString()}
      
      CUSTOMER DETAILS:
      Name: ${orderData?.shippingAddress?.fullName}
      Phone: ${orderData?.shippingAddress?.phone}

      SHIPPING ADDRESS:
      ${orderData?.shippingAddress?.fullName}
      ${orderData?.shippingAddress?.addressLine}
      ${orderData?.shippingAddress?.city}, ${orderData?.shippingAddress?.postalCode}
      ${orderData?.shippingAddress?.country}
      Phone: ${orderData?.shippingAddress?.phone}
      
      PRODUCTS:
      ${orderData?.products?.map(item => 
        `${item.product?.name} - Qty: ${item.quantity} - Price: Rs. ${item.price}`
      ).join('\n')}
      
      PAYMENT:
      Method: ${orderData?.paymentMethod}
      Items Total: Rs. ${orderData?.itemsPrice}
      Shipping: Rs. ${orderData?.shippingPrice}
      Tax: Rs. ${orderData?.taxPrice}
      Total: Rs. ${orderData?.totalPrice}
      
      Status: ${orderData?.orderStatus}
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${orderData?._id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Order Placed Successfully!</h2>
        <p className="text-gray-600 mt-2">Thank you for your purchase</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Order ID:</span>
            <p className="font-mono text-gray-900">{orderData?._id}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Date:</span>
            <p className="text-gray-900">{new Date(orderData?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Customer Details
          </h3>
          <div className="text-sm text-gray-600">
            <p><strong>Name:</strong> {orderData?.shippingAddress?.fullName}</p>
            <p><strong>Phone:</strong> {orderData?.shippingAddress?.phone}</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Shipping Address
          </h3>
          <div className="text-sm text-gray-600">
            <p>{orderData?.shippingAddress?.fullName}</p>
            <p>{orderData?.shippingAddress?.addressLine}</p>
            <p>{orderData?.shippingAddress?.city}, {orderData?.shippingAddress?.postalCode}</p>
            <p>{orderData?.shippingAddress?.country}</p>
            <p><strong>Phone:</strong> {orderData?.shippingAddress?.phone}</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Products
          </h3>
          {orderData?.products?.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div>
                <p className="font-medium text-gray-900">{item.product?.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-blue-600">Rs. {item.price}</p>
            </div>
          ))}
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Items Total:</span>
              <span>Rs. {orderData?.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Rs. {orderData?.shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>Rs. {orderData?.taxPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span className="text-blue-600">Rs. {orderData?.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Badge variant="warning" className="text-lg px-4 py-2">
            Status: {orderData?.orderStatus}
          </Badge>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={downloadReceipt} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
        <Button onClick={onClose} className="flex-1">
          Close
        </Button>
      </div>
    </Modal>
  );
};

// Order Detail Page Component
const OrderDetailPage = ({ product, quantity, onBack }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
    phone: '',
    paymentMethod: 'Cash on Delivery',
    notes: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://buyherpower.onrender.com';
  const BASE_URL = REACT_APP_API_URL;

  const paymentMethods = [
    'Cash on Delivery',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Mobile Wallet'
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to continue');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        alert('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      alert('Error fetching user profile');
    }
  };

  const handleInputChange = (e) => {
    setOrderData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const calculateTotals = () => {
    const itemsPrice = (product?.sale_price || product?.price || 0) * quantity;
    const shippingPrice = itemsPrice > 1000 ? 0 : 50;
    const taxPrice = itemsPrice * 0.05; // 5% tax
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('User not found. Please login again.');
      return;
    }

    // Validate form
    const requiredFields = ['fullName', 'addressLine', 'city', 'postalCode', 'phone'];
    const missingFields = requiredFields.filter(field => !orderData[field].trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotals();

      const orderPayload = {
        user_id: user._id,
        products: [
          {
            product: product._id,
            quantity: quantity,
            price: product?.sale_price || product?.price || 0,
            store_id: product.store_id._id || product.store_id
          }
        ],
        shippingAddress: {
          fullName: orderData.fullName,
          addressLine: orderData.addressLine,
          city: orderData.city,
          postalCode: orderData.postalCode,
          country: orderData.country,
          phone: orderData.phone
        },
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes
      };

      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderResponse(data.data);
        setShowSuccessModal(true);
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            <Card>
              <CardContent>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="h-6 w-6 mr-2" />
                  Customer Information
                </h2>
                
                {user && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={orderData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line *</label>
                    <input
                      type="text"
                      name="addressLine"
                      value={orderData.addressLine}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Street address, apartment, suite, etc."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={orderData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={orderData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      name="country"
                      value={orderData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="India">India</option>
                      <option value="Bangladesh">Bangladesh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+92-300-1234567"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </h3>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label key={method} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={orderData.paymentMethod === method}
                        onChange={handleInputChange}
                        className="text-blue-600"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <StickyNote className="h-5 w-5 mr-2" />
                  Order Notes (Optional)
                </h3>
                <textarea
                  name="notes"
                  value={orderData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special instructions for your order..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardContent>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                  <img
                    src={product?.images?.[0] || 'https://via.placeholder.com/80x80'}
                    alt={product?.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{product?.name}</h4>
                    <p className="text-sm text-gray-600">{product?.category}</p>
                    <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                    <p className="font-semibold text-blue-600">
                      Rs. {(product?.sale_price || product?.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Items Total:</span>
                    <span>Rs. {itemsPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className={shippingPrice === 0 ? "text-green-600" : ""}>
                      {shippingPrice === 0 ? "Free" : `Rs. ${shippingPrice}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%):</span>
                    <span>Rs. {taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total:</span>
                    <span className="text-blue-600">Rs. {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <ShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms & Conditions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <OrderSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        orderData={orderResponse}
      />
    </div>
  );
};

export default OrderDetailPage;