import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, Truck, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import CheckoutSteps from './CheckoutSteps';
import ShippingForm from './ShippingForm';
import PaymentForm from './PaymentForm';
import ReviewOrder from './ReviewOrder';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCartItemsWithDetails, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: ''
  });
  
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: user?.name || '',
    expiryDate: '',
    cvv: ''
  });

  const cartItems = getCartItemsWithDetails();
  const cartTotal = getCartTotal();
  
  const steps = [
    { name: 'Shipping', icon: <MapPin className="h-5 w-5" /> },
    { name: 'Payment', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Review', icon: <Truck className="h-5 w-5" /> }
  ];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate('/cart');
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleShippingSubmit = (data) => {
    setShippingDetails(data);
    handleNext();
  };

  const handlePaymentSubmit = (data) => {
    setPaymentDetails(data);
    handleNext();
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const orderProducts = cartItems.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.product?.sale_price || item.product?.price || 0
      }));
      
      const orderData = {
        products: orderProducts,
        total: cartTotal,
        shipping: shippingDetails,
        payment: {
          method: 'credit_card',
          // Don't send full card details, just last 4 digits in a real app
          last4: paymentDetails.cardNumber.slice(-4)
        }
      };

      const response = await fetch('https://backend-bhp.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Order Placed Successfully!",
          description: `Your order #${data.orderId || data._id} has been confirmed.`
        });
        clearCart();
        navigate('/checkout/confirmation', { 
          state: { 
            orderId: data.orderId || data._id,
            orderTotal: cartTotal
          } 
        });
      } else {
        toast({
          title: "Checkout Failed",
          description: data.message || 'Could not place order',
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Checkout Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {activeStep === 0 ? 'Back to Cart' : 'Back'}
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-600">Complete your order</p>
        </div>

        <CheckoutSteps steps={steps} activeStep={activeStep} />

        <div className="mt-8">
          <Card className="mb-8">
            <CardContent className="p-6">
              {activeStep === 0 && (
                <ShippingForm 
                  initialValues={shippingDetails}
                  onSubmit={handleShippingSubmit}
                />
              )}
              
              {activeStep === 1 && (
                <PaymentForm 
                  initialValues={paymentDetails}
                  onSubmit={handlePaymentSubmit}
                />
              )}
              
              {activeStep === 2 && (
                <ReviewOrder 
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  shipping={shippingDetails}
                  payment={paymentDetails}
                  onPlaceOrder={handlePlaceOrder}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
