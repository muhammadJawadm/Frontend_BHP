import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { CreditCard, Lock } from 'lucide-react';

const PaymentForm = ({ initialValues, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  });
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
      
      <div className="flex items-center mb-6 text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <Lock className="h-5 w-5 mr-3 text-slate-500" />
        <p className="text-sm">
          Your payment information is encrypted and secure. We never store your full card details.
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <div className="relative">
            <Input 
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              {...register('cardNumber', { 
                required: 'Card number is required',
                pattern: {
                  value: /^[0-9]{16}$/,
                  message: 'Please enter a valid 16-digit card number'
                }
              })}
              className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          </div>
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="cardHolder">Cardholder Name</Label>
          <Input 
            id="cardHolder"
            placeholder="John Doe"
            {...register('cardHolder', { required: 'Cardholder name is required' })}
            className={errors.cardHolder ? 'border-red-500' : ''}
          />
          {errors.cardHolder && <p className="text-red-500 text-sm mt-1">{errors.cardHolder.message}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
            <Input 
              id="expiryDate"
              placeholder="MM/YY"
              {...register('expiryDate', { 
                required: 'Expiry date is required',
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                  message: 'Please use MM/YY format'
                }
              })}
              className={errors.expiryDate ? 'border-red-500' : ''}
            />
            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input 
              id="cvv"
              type="password"
              maxLength={3}
              placeholder="123"
              {...register('cvv', { 
                required: 'CVV is required',
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: 'CVV must be 3-4 digits'
                }
              })}
              className={errors.cvv ? 'border-red-500' : ''}
            />
            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>}
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-slate-800 hover:bg-slate-900"
          >
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
