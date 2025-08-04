import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';

const ReviewOrder = ({ cartItems, cartTotal, shipping, payment, onPlaceOrder }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
      
      {/* Shipping Information */}
      <div>
        <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
        <div className="bg-slate-50 p-4 rounded-md">
          <p className="font-medium">{shipping.fullName}</p>
          <p>{shipping.address}</p>
          <p>{shipping.city}, {shipping.state} {shipping.zipCode}</p>
          <p>{shipping.country}</p>
          <p className="mt-2">{shipping.phone}</p>
        </div>
      </div>
      
      <Separator />
      
      {/* Payment Information */}
      <div>
        <h3 className="text-lg font-medium mb-2">Payment Information</h3>
        <div className="bg-slate-50 p-4 rounded-md flex items-center">
          <div className="bg-slate-800 text-white p-2 rounded-md mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Credit Card</p>
            <p className="text-sm text-slate-600">Ending in {payment.cardNumber.slice(-4)}</p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Order Items */}
      <div>
        <h3 className="text-lg font-medium mb-2">Order Items</h3>
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.productId} className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <Link 
                    to={`/products/${item.productId}`} 
                    className="font-medium text-slate-900 hover:text-slate-700"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">
                ${((item.product.sale_price || item.product.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Order Summary */}
      <div>
        <h3 className="text-lg font-medium mb-2">Order Summary</h3>
        <div className="bg-slate-50 p-4 rounded-md">
          <div className="flex justify-between mb-2">
            <p>Subtotal:</p>
            <p>${cartTotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Shipping:</p>
            <p>$0.00</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Tax:</p>
            <p>${(cartTotal * 0.08).toFixed(2)}</p>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold">
            <p>Total:</p>
            <p>${(cartTotal + (cartTotal * 0.08)).toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Place Order Button */}
      <div className="pt-4">
        <Button 
          onClick={onPlaceOrder} 
          className="w-full bg-slate-800 hover:bg-slate-900"
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default ReviewOrder;
