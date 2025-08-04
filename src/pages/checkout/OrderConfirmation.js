import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, orderTotal } = location.state || {};

  // If someone tries to access this page directly without an order
  if (!orderId) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-slate-600 mb-8">
            Thank you for your purchase.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Order Number</span>
                <span className="font-semibold">{orderId}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Amount</span>
                <span className="font-semibold">${(orderTotal + (orderTotal * 0.08)).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Order Date</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-slate-100 rounded-md">
              <p className="text-sm text-slate-600">
                A confirmation email has been sent to your email address. You can track your order status in your account dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/customer/dashboard/orders" className="flex-1">
            <Button className="w-full bg-slate-800 hover:bg-slate-900">
              View Order
            </Button>
          </Link>
          
          <Link to="/products" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
