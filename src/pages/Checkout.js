import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { getCartItemsWithDetails, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const cartItems = getCartItemsWithDetails();
  const cartTotal = getCartTotal();
  
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  
  // Redirect to login if not authenticated
  if (!isAuthenticated() && step === 1) {
    // Show a message asking user to log in
    toast({
      title: "Login Required",
      description: "Please log in to proceed with checkout",
      variant: "destructive",
    });
    navigate('/customer/login');
    return null;
  }

  // Handle shipping form submit
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };
  
  // Handle payment form submit
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };
  
  // Handle order confirmation
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.sale_price || item.product.price
      }));
      
      const orderData = {
        shippingInfo,
        orderItems,
        totalPrice: cartTotal,
        notes: orderNotes
      };

      const token = localStorage.getItem('token');
      const response = await fetch('https://backend-bhp.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      
      // Clear cart after successful order
      clearCart();
      
      // Show success toast
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${result.order._id} has been placed.`,
      });

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${result.order._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change for shipping form
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle input change for payment form
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  // Render shipping form (Step 1)
  const renderShippingForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleShippingSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                name="fullName" 
                value={shippingInfo.fullName} 
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={shippingInfo.email} 
                onChange={handleShippingChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input 
              id="address" 
              name="address" 
              value={shippingInfo.address} 
              onChange={handleShippingChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city" 
                name="city" 
                value={shippingInfo.city} 
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input 
                id="state" 
                name="state" 
                value={shippingInfo.state} 
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input 
                id="postalCode" 
                name="postalCode" 
                value={shippingInfo.postalCode} 
                onChange={handleShippingChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country" 
                name="country" 
                value={shippingInfo.country} 
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={shippingInfo.phone} 
                onChange={handleShippingChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate('/cart')}>
            Back to Cart
          </Button>
          <Button type="submit">Continue to Payment</Button>
        </CardFooter>
      </form>
    </Card>
  );
  
  // Render payment form (Step 2)
  const renderPaymentForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <form onSubmit={handlePaymentSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input 
              id="cardNumber" 
              name="cardNumber" 
              placeholder="1234 5678 9012 3456" 
              value={paymentInfo.cardNumber} 
              onChange={handlePaymentChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nameOnCard">Name on Card</Label>
            <Input 
              id="nameOnCard" 
              name="nameOnCard" 
              value={paymentInfo.nameOnCard} 
              onChange={handlePaymentChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input 
                id="expiryDate" 
                name="expiryDate" 
                placeholder="MM/YY" 
                value={paymentInfo.expiryDate} 
                onChange={handlePaymentChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input 
                id="cvv" 
                name="cvv" 
                placeholder="123" 
                value={paymentInfo.cvv} 
                onChange={handlePaymentChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => setStep(1)}>
            Back to Shipping
          </Button>
          <Button type="submit">Review Order</Button>
        </CardFooter>
      </form>
    </Card>
  );
  
  // Render order review (Step 3)
  const renderOrderReview = () => (
    <Card>
      <CardHeader>
        <CardTitle>Order Review</CardTitle>
      </CardHeader>
      <form onSubmit={handlePlaceOrder}>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Shipping Address</h3>
            <p>{shippingInfo.fullName}</p>
            <p>{shippingInfo.address}</p>
            <p>
              {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}
            </p>
            <p>{shippingInfo.country}</p>
            <p>Phone: {shippingInfo.phone}</p>
            <p>Email: {shippingInfo.email}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Payment Method</h3>
            <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Order Items</h3>
            {cartItems.map(item => (
              <div key={item.productId} className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <div className="w-12 h-12 mr-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p>${(item.product.sale_price || item.product.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Order Notes</h3>
            <Textarea
              placeholder="Add any special instructions or notes for your order"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              rows={3}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping:</p>
              <p>$0.00</p>
            </div>
            <div className="flex justify-between font-bold">
              <p>Total:</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => setStep(2)}>
            Back to Payment
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Steps indicator */}
      <div className="flex justify-between mb-8 relative">
        <div className="flex flex-col items-center z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <p className="mt-2 text-sm">Shipping</p>
        </div>
        
        <div className="flex flex-col items-center z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <p className="mt-2 text-sm">Payment</p>
        </div>
        
        <div className="flex flex-col items-center z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <p className="mt-2 text-sm">Review</p>
        </div>
        
        {/* Progress bar */}
        <div className="absolute top-4 left-0 h-0.5 bg-gray-200 w-full z-0">
          <div 
            className="h-full bg-blue-600 transition-all duration-300" 
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>
        </div>
      </div>
      
      {/* Render the appropriate step */}
      {step === 1 && renderShippingForm()}
      {step === 2 && renderPaymentForm()}
      {step === 3 && renderOrderReview()}
    </div>
  );
};

export default Checkout;
