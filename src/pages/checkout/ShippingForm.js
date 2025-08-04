import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const ShippingForm = ({ initialValues, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: initialValues
  });
  
  // Set up the country select to work with react-hook-form
  React.useEffect(() => {
    register('country', { required: 'Country is required' });
  }, [register]);
  
  const watchCountry = watch('country');
  
  const handleCountryChange = (value) => {
    setValue('country', value);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName"
            {...register('fullName', { required: 'Full name is required' })}
            className={errors.fullName ? 'border-red-500' : ''}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="address">Street Address</Label>
          <Input 
            id="address"
            {...register('address', { required: 'Address is required' })}
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input 
              id="city"
              {...register('city', { required: 'City is required' })}
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="state">State/Province</Label>
            <Input 
              id="state"
              {...register('state', { required: 'State is required' })}
              className={errors.state ? 'border-red-500' : ''}
            />
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zipCode">ZIP / Postal Code</Label>
            <Input 
              id="zipCode"
              {...register('zipCode', { required: 'ZIP code is required' })}
              className={errors.zipCode ? 'border-red-500' : ''}
            />
            {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="country">Country</Label>
            <Select 
              defaultValue={initialValues.country} 
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USA">United States</SelectItem>
                <SelectItem value="CAN">Canada</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="AUS">Australia</SelectItem>
                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
          </div>
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone"
            type="tel"
            {...register('phone', { required: 'Phone number is required' })}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-slate-800 hover:bg-slate-900"
          >
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
