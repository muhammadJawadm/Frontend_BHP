import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Store, Upload, X, Building } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../hooks/use-toast';

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
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get seller data from previous step
  const seller = location.state?.seller;

  useEffect(() => {
    // Redirect if no seller data
    if (!seller) {
      toast({
        title: "Session Expired",
        description: "Please complete step 1 first.",
        variant: "destructive",
      });
      navigate('/seller/signup');
      return;
    }

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
  }, [seller, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    
    // Validation
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
        name: formData.store_name,
        category: formData.store_category,
        description: formData.store_description,
        user_id: seller._id
      };

      // Add base64 encoded images if available
      if (files.store_logo) {
        requestBody.logo = files.store_logo;
      }
      
      if (files.store_banner) {
        requestBody.banner = files.store_banner;
      }

      console.log('Request Body:', requestBody);

      const response = await fetch('http://localhost:5000/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Store creation response:', result);

      // Extract store ID from the response
      const storeId = result.store?._id;
      console.log('Store ID:', storeId);
      if (!storeId) {
        throw new Error('Store ID not found in response');
      }

      // Update seller data with store information
      const updatedSeller = {
        ...seller,
        storeId: storeId,
        store: result.store
      };
      
      // Store updated seller data in localStorage
      try {
        localStorage.setItem('seller', JSON.stringify(updatedSeller));
        localStorage.setItem('currentStoreId', storeId);
      } catch (storageError) {
        console.warn('Could not save to localStorage:', storageError);
      }
      
      toast({
        title: "Registration Complete!",
        description: `Welcome to MarketHub, ${seller.name}! Your store "${formData.store_name}" is ready.`
      });
      
      // Navigate to dashboard with store ID
      navigate('/dashboard', { 
        state: { 
          storeId: storeId,
          seller: updatedSeller 
        }
      });

    } catch (error) {
      console.error('Store setup error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('store name already exists')) {
        toast({
          title: "Store Name Taken",
          description: "A store with this name already exists. Please choose a different store name.",
          variant: "destructive"
        });
      } else if (error.message?.includes('HTTP error')) {
        toast({
          title: "Server Error",
          description: "The server returned an error. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the server. Please try again.",
          variant: "destructive"
        });
      }
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
  };

  const generateStoreUrl = (storeName) => {
    if (!storeName) return 'your-store-name';
    return storeName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Show loading or redirect state
  if (!seller) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting...</p>
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