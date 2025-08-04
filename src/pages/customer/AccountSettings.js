import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import ProfilePictureUploader from '../../components/ProfilePictureUploader';
import { Separator } from '../../components/ui/separator';
import { User, Lock, CreditCard, Bell } from 'lucide-react';

const AccountSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [generalForm, setGeneralForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [addressForm, setAddressForm] = useState({
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'USA'
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const handleGeneralChange = (e) => {
    setGeneralForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleSecurityChange = (e) => {
    setSecurityForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleAddressChange = (e) => {
    setAddressForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backend-bhp.onrender.com/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(generalForm)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive"
      });
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backend-bhp.onrender.com/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update password');
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully."
      });
      
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://backend-bhp.onrender.com/api/profile/address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update address');
      }
      
      toast({
        title: "Address Updated",
        description: "Your address information has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
          <p className="text-slate-600">Manage your account preferences and information</p>
        </div>
        
        <div className="mb-8 flex justify-center">
          <ProfilePictureUploader />
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="general" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Address</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleGeneralSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={generalForm.name}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={generalForm.email}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={generalForm.phone}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      className="bg-slate-800 hover:bg-slate-900"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSecuritySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                    />
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      className="bg-slate-800 hover:bg-slate-900"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? "Changing Password..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Address Settings */}
          <TabsContent value="address">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={addressForm.zipCode}
                        onChange={handleAddressChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Button 
                      type="submit" 
                      className="bg-slate-800 hover:bg-slate-900"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Update Address"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email_order"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <Label htmlFor="email_order">Order Updates</Label>
                      <p className="text-slate-500">Receive emails about your order status changes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email_promo"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                        defaultChecked
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <Label htmlFor="email_promo">Promotions</Label>
                      <p className="text-slate-500">Receive emails about discounts and special offers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email_news"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <Label htmlFor="email_news">Newsletter</Label>
                      <p className="text-slate-500">Receive our weekly newsletter with new products and trends</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="bg-slate-800 hover:bg-slate-900">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSettings;
