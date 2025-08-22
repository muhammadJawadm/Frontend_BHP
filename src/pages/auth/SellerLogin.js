import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
// import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://buyherpower.onrender.com';

const BASE_URL = REACT_APP_API_URL;

const SellerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // const { login } = useAuth(); // Commented out to avoid AuthProvider dependency
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}/api/seller/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const result = await response.json();

      if (response.ok && result.seller) {
        // Store seller data
        localStorage.setItem('seller', JSON.stringify(result.seller));
        localStorage.setItem('token', result.token);
        
        // Update auth context if available (optional)
        // if (login) {
        //   login(result.seller, null, 'seller');
        // }
        
        toast({
          title: "Login Successful!",
          description: `Welcome back, ${result.seller.name}!`
        });
        

        const sellerData = await fetch(`${BASE_URL}/api/stores/seller/my-stores`, {
          headers: {
            Authorization: `Bearer ${result.token}`
          }
        });
        if (sellerData.ok) {
          const stores = await sellerData.json();


          localStorage.setItem('stores', JSON.stringify(stores));

          var storeId = stores.stores[0]?._id ;
        }

        // Navigate to dashboard
        navigate('/dashboard', { 
          state: {
            storeId: storeId,
            seller: result.seller,
            token: result.token
          },
          replace: true // Replace current history entry
      });
      } else {
        // Handle specific error messages from API
        if (result.message && result.message.includes('Invalid credentials')) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login Failed",
            description: result.message || "An error occurred during login.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = () => {
    setFormData({
      email: 'seller@tech.com',
      password: 'sellerpass'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-slate-800 to-slate-600 text-white p-3 rounded-lg">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-slate-800">BuyHerPower</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Seller Portal</h1>
          <p className="text-slate-600">Sign in to your seller account</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={fillDemoCredentials}
                    className="text-slate-600 hover:text-slate-800 p-0 h-auto font-normal"
                  >
                    Use demo credentials
                  </Button>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-slate-600 hover:text-slate-800">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-900"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">New seller?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/seller/signup"
                  className="font-medium text-slate-600 hover:text-slate-800"
                >
                  Create a seller account
                </Link>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600">
                Just want to shop?{' '}
                <Link
                  to="/customer/login"
                  className="font-medium text-slate-800 hover:text-slate-600"
                >
                  Customer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerLogin;