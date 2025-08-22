import React, { useState } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Package, DollarSign, Tag, FileText, Upload, X, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { useToast } from '../../hooks/use-toast';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://buyherpower.onrender.com';
const BASE_URL = REACT_APP_API_URL;

const categories = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty & Care',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Food & Beverages',
  'Health & Wellness',
  'Automotive',
  'Pet Supplies',
  'Jewelry & Accessories'
];

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { storeId: urlStoreId } = useParams();
  const { toast } = useToast();
  
  // Get store ID and token from navigation state or fallback sources
  const getStoreId = () => {
    if (urlStoreId) return urlStoreId;
    if (location.state?.storeId) return location.state.storeId;
    
    const currentStoreId = localStorage.getItem('currentStoreId');
    if (currentStoreId) return currentStoreId;
    
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.storeId) return user.storeId;
      }
    } catch (error) {
      // Silent error handling
    }
    
    return null;
  };

  const getAuthToken = () => {
    if (location.state?.token) return location.state.token;
    return localStorage.getItem('token');
  };

  const storeId = getStoreId();
  const authToken = getAuthToken();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    saleEndingDate: '',
    category: '',
    images: [], // Array of base64 strings to match backend schema
    quantity: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Show error if no store ID or token is available
  if (!storeId || !authToken) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            {!storeId ? 'Store Not Found' : 'Authentication Required'}
          </h1>
          <p className="text-slate-600 mb-6">
            {!storeId 
              ? 'Unable to determine which store to add the product to. Please go back to your dashboard.'
              : 'Authentication token is missing. Please log in again.'
            }
          </p>
          <Link to="/dashboard">
            <Button className="bg-slate-800 hover:bg-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle image upload (multiple images)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const base64Images = await Promise.all(
        files.map(async (file) => {
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
          }
          return await convertToBase64(file);
        })
      );

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...base64Images]
      }));

      toast({
        title: "Success",
        description: `${files.length} image(s) uploaded successfully!`,
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Remove image
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Product name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Product description is required');
      }
      if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        throw new Error('Valid price is required');
      }
      if (!formData.category) {
        throw new Error('Category is required');
      }
      if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
        throw new Error('Valid quantity is required');
      }
      if (formData.images.length === 0) {
        throw new Error('At least one product image is required');
      }
      
      // Validate sale price if provided
      if (formData.sale_price && parseFloat(formData.sale_price) >= parseFloat(formData.price)) {
        throw new Error('Sale price must be less than regular price');
      }
      
      // Prepare API payload to match backend schema exactly
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        category: formData.category,
        images: formData.images, // Array of base64 strings
        quantity: parseInt(formData.quantity),
        store_id: storeId,
        saleEndingDate: formData.saleEndingDate ? new Date(formData.saleEndingDate).toISOString() : null
      };

      // API Call
      const response = await fetch(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: "Product added successfully!",
          variant: "success"
        });
        
        navigate('/dashboard', { 
          state: { 
            storeId: storeId,
            token: authToken,
            productAdded: true 
          } 
        });
      } else {
        const result = await response.json();
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to add products to this store.');
        } else if (response.status === 400) {
          throw new Error(result.message || 'Invalid product data provided.');
        } else {
          throw new Error(result.message || `Server error: ${response.status}`);
        }
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      
      // Handle authentication errors
      if (error.message.includes('Authentication failed')) {
        localStorage.removeItem('token');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" state={{ storeId: storeId, token: authToken }}>
            <Button variant="ghost" className="mb-4 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New Product</h1>
          <p className="text-slate-600">
            Add a new product to your store and start selling
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        maxLength={100}
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="Enter product name"
                      />
                      <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <div className="relative mt-1">
                      <Textarea
                        id="description"
                        name="description"
                        required
                        maxLength={1000}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your product..."
                        rows={4}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {formData.description.length}/1000 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Regular Price (Rs) *</Label>
                      <div className="relative mt-1">
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={formData.price}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="0.00"
                        />
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="sale_price">Sale Price (Rs)</Label>
                      <div className="relative mt-1">
                        <Input
                          id="sale_price"
                          name="sale_price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.sale_price}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="0.00 (optional)"
                        />
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Sale Ending Date */}
                  {formData.sale_price && (
                    <div>
                      <Label htmlFor="saleEndingDate">Sale Ending Date</Label>
                      <div className="relative mt-1">
                        <Input
                          id="saleEndingDate"
                          name="saleEndingDate"
                          type="datetime-local"
                          value={formData.saleEndingDate}
                          onChange={handleChange}
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Optional: Set when the sale ends
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => handleSelectChange('category', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        required
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <Label>Product Images *</Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-slate-400" />
                          <p className="mb-2 text-sm text-slate-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB each</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {formData.images.length > 0 && (
                    <div>
                      <Label>Uploaded Images ({formData.images.length})</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Preview */}
                  {formData.price && (
                    <div>
                      <Label>Price Preview</Label>
                      <div className="mt-2 p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          {formData.sale_price ? (
                            <>
                              <span className="text-xl font-bold text-red-600">
                                Rs.{parseFloat(formData.sale_price).toFixed(2)}
                              </span>
                              <span className="text-sm text-slate-500 line-through">
                                Rs.{parseFloat(formData.price).toFixed(2)}
                              </span>
                              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                                SALE
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-slate-900">
                              Rs.{parseFloat(formData.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {formData.sale_price && (
                          <div className="mt-2">
                            <p className="text-sm text-green-600">
                              Save Rs.{(parseFloat(formData.price) - parseFloat(formData.sale_price)).toFixed(2)}!
                            </p>
                            {formData.saleEndingDate && (
                              <p className="text-xs text-slate-500 mt-1">
                                Sale ends: {new Date(formData.saleEndingDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
                <Link to="/dashboard" state={{ storeId: storeId, token: authToken }}>
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900"
                >
                  {isLoading ? 'Adding Product...' : 'Add Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Tips for Better Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Product Images</h4>
                <ul className="space-y-1">
                  <li>• Upload high-quality images (at least 800x800px)</li>
                  <li>• Show multiple angles and details</li>
                  <li>• Use good lighting and clean backgrounds</li>
                  <li>• Keep file sizes under 5MB each</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                <ul className="space-y-1">
                  <li>• Highlight unique selling points</li>
                  <li>• Include specifications and dimensions</li>
                  <li>• Use bullet points for readability</li>
                  <li>• Mention materials and care instructions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Pricing Strategy</h4>
                <ul className="space-y-1">
                  <li>• Research competitor prices</li>
                  <li>• Use sale prices for promotions</li>
                  <li>• Set realistic sale end dates</li>
                  <li>• Consider psychological pricing (Rs.9.99 vs Rs.10)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Inventory</h4>
                <ul className="space-y-1">
                  <li>• Set accurate quantity levels</li>
                  <li>• Mark out-of-stock items appropriately</li>
                  <li>• Update inventory regularly</li>
                  <li>• Consider safety stock levels</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;