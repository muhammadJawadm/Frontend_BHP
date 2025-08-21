import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Store, Upload, X, Building, Key, User, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../hooks/use-toast';

const BASE_URL = 'http://localhost:5000';

const CreateStore = () => {
  const [formData, setFormData] = useState({
    store_name: '',
    store_category: '',
    store_description: ''
  });
  const [files, setFiles] = useState({
    store_logo: null,
    store_banner: null
  });
  const [previews, setPreviews] = useState({
    store_logo: null,
    store_banner: null
  });
  const [ContactInfo, setContactInfo] = useState({
    phone: '',
    email: ''
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: ''
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [seller, setSeller] = useState(null);
  const [token, setToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeSellerData = () => {
      console.log('Location state:', location.state);
      
      let sellerData = null;
      let authToken = null;

      // Priority 1: From location state (navigation from previous step)
      if (location.state?.seller) {
        sellerData = location.state.seller;
        authToken = location.state.token;
        console.log('✓ Got seller from location state:', sellerData);
      }
      
      // Priority 2: From sessionStorage (more reliable than localStorage)
      if (!sellerData) {
        try {
          const storedSeller = sessionStorage.getItem('seller');
          const storedToken = sessionStorage.getItem('token');
          
          if (storedSeller) {
            sellerData = JSON.parse(storedSeller);
            authToken = storedToken;
            console.log('✓ Got seller from sessionStorage:', sellerData);
          }
        } catch (error) {
          console.error('Error parsing sessionStorage seller data:', error);
        }
      }

      // Priority 3: From localStorage as fallback
      if (!sellerData) {
        try {
          const storedSeller = localStorage.getItem('seller');
          const storedToken = localStorage.getItem('token');
          
          if (storedSeller) {
            sellerData = JSON.parse(storedSeller);
            authToken = storedToken;
            console.log('✓ Got seller from localStorage:', sellerData);
          }
        } catch (error) {
          console.error('Error parsing localStorage seller data:', error);
        }
      }

      // Priority 4: From user data as last resort
      if (!sellerData) {
        try {
          const userData = localStorage.getItem('user');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            // Check if this user data has seller properties
            if (parsedUser._id || parsedUser.id) {
              sellerData = parsedUser;
              authToken = localStorage.getItem('token');
              console.log('✓ Got seller from user data:', sellerData);
            }
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      // Debug logging
     
      // Validate seller data - check for both _id and id fields
      const sellerId = sellerData?._id || sellerData?.id;
      console.log('🔍 Final seller ID:', sellerId);
      
      if (!sellerData || !sellerId) {
        console.error('❌ No valid seller data found - sellerData:', !!sellerData, 'sellerId:', sellerId);
        toast({
          title: "Session Expired",
          description: "Please complete seller registration first.",
          variant: "destructive",
        });
        navigate('/seller/signup');
        return;
      }

      // Validate seller data structure
      if (!sellerData.name || !sellerData.email) {
        console.error('❌ Incomplete seller data - name:', sellerData.name, 'email:', sellerData.email);
        toast({
          title: "Invalid Session Data",
          description: "Please complete seller registration again.",
          variant: "destructive",
        });
        navigate('/seller/signup');
        return;
      }

      // Normalize seller data to use _id field consistently
      if (sellerData.id && !sellerData._id) {
        sellerData._id = sellerData.id;
        console.log('✓ Normalized seller data - added _id field');
      }

      // Set seller and token state
      setSeller(sellerData);
      setToken(authToken);
      setIsInitialized(true);
      
      console.log('✓ Final seller data:', sellerData);
      console.log('✓ Final token:', authToken);

      // Store in sessionStorage for reliability
      try {
        sessionStorage.setItem('seller', JSON.stringify(sellerData));
        if (authToken) {
          sessionStorage.setItem('token', authToken);
        }
      } catch (error) {
        console.warn('Could not save to sessionStorage:', error);
      }
    };

    // Set default categories
    setCategories([
      "Fashion & Clothing",
      "Electronics", 
      "Home & Garden",
      "Beauty & Personal Care",
      "Sports & Outdoors",
      "Books & Media",
      "Toys & Games",
      "Food & Beverages",
      "Health & Wellness",
      "Art & Crafts",
      "Automotive",
      "Pet Supplies",
      "Office Supplies",
      "Jewelry & Accessories",
      "Other"
    ]);

    // Initialize seller data
    initializeSellerData();
  }, [location.state, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fixed: Changed 'phone' to 'name' to properly destructure the event target
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // New handler for social media links
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      store_category: value
    }));
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      
      setFiles(prev => ({
        ...prev,
        [fileType]: base64
      }));

      // Create preview
      setPreviews(prev => ({
        ...prev,
        [fileType]: base64
      }));
    } catch (error) {
      console.error('File processing error:', error);
      toast({
        title: "Error processing file",
        description: "Unable to process the selected file.",
        variant: "destructive"
      });
    }
  };

  const removeFile = (fileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: null
    }));
    setPreviews(prev => ({
      ...prev,
      [fileType]: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Double-check seller data before submission - check for both _id and id
    const sellerId = seller?._id || seller?.id;
    if (!seller || !sellerId) {
      console.error('❌ No seller data at submission time');
      toast({
        title: "Session Error",
        description: "Seller information is missing. Please try again.",
        variant: "destructive",
      });
      navigate('/seller/signup');
      return;
    }

    console.log('✓ Submitting with seller ID:', sellerId);
    
    // Form validation
    if (!formData.store_name.trim()) {
      toast({
        title: "Store name required",
        description: "Please enter your store name.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.store_category) {
      toast({
        title: "Category required",
        description: "Please select a store category.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.store_description.trim()) {
      toast({
        title: "Description required",
        description: "Please enter a store description.",
        variant: "destructive",
      });
      return;
    }

    if (formData.store_description.length < 20) {
      toast({
        title: "Description too short",
        description: "Store description must be at least 20 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare the request body
      const requestBody = {
        name: formData.store_name.trim(),
        category: formData.store_category,
        description: formData.store_description.trim(),
        contactInfo: {
          phone: ContactInfo.phone.trim(),
          email: ContactInfo.email.trim()
        },
        socialLinks: {
          facebook: socialLinks.facebook.trim(),
          instagram: socialLinks.instagram.trim(),
          twitter: socialLinks.twitter.trim()
        },
        user_id: sellerId // Use the normalized seller ID
      };

      // Add base64 encoded images if available
      if (files.store_logo) {
        requestBody.logo = files.store_logo;
      }
      
      if (files.store_banner) {
        requestBody.banner = files.store_banner;
      }

      console.log('📤 Sending request:', {
        ...requestBody,
        logo: files.store_logo ? '[BASE64_DATA]' : null,
        banner: files.store_banner ? '[BASE64_DATA]' : null
      });

      // Create headers
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add Authorization header if token is available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📤 Request headers:', headers);
      
      const response = await fetch(`${BASE_URL}/api/stores`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ API Error:', errorData);
        
        // Try to parse as JSON for better error handling
        let errorMessage = errorData;
        try {
          const errorJson = JSON.parse(errorData);
          errorMessage = errorJson.message || errorJson.error || errorData;
        } catch (parseError) {
          // Keep original error text if not JSON
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Store creation response:', result);

      // Extract store ID from response
      const storeId = result.store?._id || result.data?._id || result._id || result.storeId;
      console.log('✅ Store ID:', storeId);
      
      if (!storeId) {
        console.error('❌ No store ID in response:', result);
        throw new Error('Store was created but ID not returned');
      }

      // Update seller data with store information
      const updatedSeller = {
        ...seller,
        storeId: storeId,
        store: result.store || result.data || result
      };
      
      // Store updated data
      try {
        localStorage.setItem('seller', JSON.stringify(updatedSeller));
        localStorage.setItem('user', JSON.stringify(updatedSeller));
        localStorage.setItem('currentStoreId', storeId);
        sessionStorage.setItem('seller', JSON.stringify(updatedSeller));
        sessionStorage.setItem('currentStoreId', storeId);
        
        if (token) {
          localStorage.setItem('token', token);
          sessionStorage.setItem('token', token);
        }
      } catch (storageError) {
        console.warn('Storage warning:', storageError);
      }
      
      toast({
        title: "Registration Complete!",
        description: `Welcome to MarketHub, ${seller.name}! Your store "${formData.store_name}" is ready.`
      });
      
      // Navigate to dashboard with all necessary data
      navigate('/dashboard', { 
        state: { 
          storeId: storeId,
          seller: updatedSeller,
          token: token
        },
        replace: true // Replace current history entry
      });

    } catch (error) {
      console.error('❌ Store setup error:', error);
      
      // Handle specific error cases
      let errorTitle = "Setup Error";
      let errorDescription = "Unable to create your store. Please try again.";
      
      if (error.message?.toLowerCase().includes('name') && error.message?.toLowerCase().includes('exists')) {
        errorTitle = "Store Name Taken";
        errorDescription = "A store with this name already exists. Please choose a different store name.";
      } else if (error.message?.toLowerCase().includes('unauthorized')) {
        errorTitle = "Authentication Error";
        errorDescription = "Your session has expired. Please sign up again.";
        // Redirect to signup after showing error
        setTimeout(() => navigate('/seller/signup'), 2000);
      } else if (error.message?.toLowerCase().includes('network') || error.message?.toLowerCase().includes('fetch')) {
        errorTitle = "Connection Error";
        errorDescription = "Unable to connect to the server. Please check your internet connection and try again.";
      } else if (error.message?.includes('500')) {
        errorTitle = "Server Error";
        errorDescription = "The server is experiencing issues. Please try again in a few minutes.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoData = () => {
    setFormData({
      store_name: "Tech World",
      store_category: "Electronics",
      store_description: "Best gadgets and electronics in town. We offer the latest technology products with competitive prices and excellent customer service."
    });
    setContactInfo({
      phone: "+1-555-0123",
      email: "contact@techworld.com"
    });
    setSocialLinks({
      facebook: "https://facebook.com/techworld",
      instagram: "https://instagram.com/techworld",
      twitter: "https://twitter.com/techworld"
    });
  };

  const generateStoreUrl = (storeName) => {
    if (!storeName) return 'your-store-name';
    return storeName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Show loading while initializing
  if (!isInitialized || !seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading seller information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="bg-gradient-to-r from-slate-800 to-slate-600 text-white p-3 rounded-lg">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-slate-800">MarketHub</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Store Setup</h1>
          <p className="text-slate-600">Step 2: Set up your store information</p>
          <p className="text-sm text-slate-500 mt-1">Welcome, {seller.name}!</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
            ✓
          </div>
          <div className="w-16 h-1 bg-slate-800"></div>
          <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-medium">
            2
          </div>
        </div>

        {/* Store Setup Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="store_name">Store Name</Label>
                <div className="relative mt-1">
                  <Input
                    id="store_name"
                    name="store_name"
                    type="text"
                    required
                    value={formData.store_name}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Enter your store name"
                  />
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Your store URL will be: markethub.com/store/{generateStoreUrl(formData.store_name)}
                </p>
              </div>

              <div>
                <Label htmlFor="store_category">Store Category</Label>
                <Select onValueChange={handleCategoryChange} value={formData.store_category}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your store category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="store_description">Store Description</Label>
                <Textarea
                  id="store_description"
                  name="store_description"
                  required
                  value={formData.store_description}
                  onChange={handleChange}
                  placeholder="Describe what your store sells..."
                  className="mt-1"
                  rows={4}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.store_description.length}/20 characters minimum
                </p>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
                  Store Contact Information
                </h3>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-1">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={ContactInfo.phone}
                      onChange={handleContactChange}
                      className="pl-10"
                      placeholder="Enter your store phone number"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Store Email</Label>
                  <div className="relative mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={ContactInfo.email}
                      onChange={handleContactChange}
                      className="pl-10"
                      placeholder="Enter your store email"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Social Media Links Section (Optional) */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
                  Social Media Links (Optional)
                </h3>
                
                <div>
                  <Label htmlFor="facebook">Facebook Page</Label>
                  <div className="relative mt-1">
                    <Input
                      id="facebook"
                      name="facebook"
                      type="url"
                      value={socialLinks.facebook}
                      onChange={handleSocialChange}
                      className="pl-10"
                      placeholder="https://facebook.com/yourstore"
                    />
                    <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram Profile</Label>
                  <div className="relative mt-1">
                    <Input
                      id="instagram"
                      name="instagram"
                      type="url"
                      value={socialLinks.instagram}
                      onChange={handleSocialChange}
                      className="pl-10"
                      placeholder="https://instagram.com/yourstore"
                    />
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="twitter">Twitter/X Profile</Label>
                  <div className="relative mt-1">
                    <Input
                      id="twitter"
                      name="twitter"
                      type="url"
                      value={socialLinks.twitter}
                      onChange={handleSocialChange}
                      className="pl-10"
                      placeholder="https://twitter.com/yourstore"
                    />
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">
                  Store Images (Optional)
                </h3>
                
                {/* Store Logo */}
                <div>
                  <Label>Store Logo</Label>
                  <div className="mt-1">
                    {previews.store_logo ? (
                      <div className="relative inline-block">
                        <img
                          src={previews.store_logo}
                          alt="Store logo preview"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                          onClick={() => removeFile('store_logo')}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-slate-500" />
                          <p className="mb-2 text-sm text-slate-500">
                            <span className="font-semibold">Click to upload</span> store logo
                          </p>
                          <p className="text-xs text-slate-500">PNG, JPG (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'store_logo')}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Store Banner */}
                <div>
                  <Label>Store Banner</Label>
                  <div className="mt-1">
                    {previews.store_banner ? (
                      <div className="relative inline-block w-full">
                        <img
                          src={previews.store_banner}
                          alt="Store banner preview"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                          onClick={() => removeFile('store_banner')}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-slate-500" />
                          <p className="mb-2 text-sm text-slate-500">
                            <span className="font-semibold">Click to upload</span> store banner
                          </p>
                          <p className="text-xs text-slate-500">PNG, JPG (MAX. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'store_banner')}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={fillDemoData}
                  className="text-slate-600 hover:text-slate-800 p-0 h-auto font-normal text-sm"
                >
                  Fill demo data
                </Button>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/seller/signup')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-slate-800 hover:bg-slate-900"
                >
                  {isLoading ? 'Setting up store...' : 'Complete Registration'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateStore;