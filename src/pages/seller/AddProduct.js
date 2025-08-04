import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Package, DollarSign, Image, Tag, FileText, Upload, X, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { useToast } from '../../hooks/use-toast';
const BASE_URL = process.env.BASE_URL || 'https://backend-bhp.onrender.com';
// Fallback categories if import fails
const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
  'Beauty',
  'Automotive',
  'Food',
  'Other'
];

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get store ID from navigation state or fallback sources
  const getStoreId = () => {
    // Priority 1: From navigation state (when coming from dashboard)
    if (location.state?.storeId) {
      console.log('Using store ID from navigation state:', location.state.storeId);
      return location.state.storeId;
    }
    
    // Priority 2: From localStorage
    const currentStoreId = localStorage.getItem('currentStoreId');
    if (currentStoreId) {
      console.log('Using store ID from localStorage:', currentStoreId);
      return currentStoreId;
    }
    
    // Priority 3: From user/seller data in localStorage
    try {
      const userData = localStorage.getItem('user');
      const sellerData = localStorage.getItem('seller');
      
      if (userData) {
        const user = JSON.parse(userData);
        if (user.store_id || user.storeId) {
          console.log('Using store ID from user data:', user.store_id || user.storeId);
          return user.store_id || user.storeId;
        }
      }
      
      if (sellerData) {
        const seller = JSON.parse(sellerData);
        if (seller.storeId || seller.store?._id) {
          console.log('Using store ID from seller data:', seller.storeId || seller.store?._id);
          return seller.storeId || seller.store?._id;
        }
      }
    } catch (error) {
      console.error('Error parsing user/seller data:', error);
    }
    
    // Priority 4: Fallback ID (you should replace this with actual logic)
    console.warn('No store ID found, using fallback');
    return "688e040bc4b849772018449e"; // Your fallback store ID
  };

  const storeId = getStoreId();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    saleEndingDate: '',
    category: '',
    images: [], // Changed to array for multiple images
    in_stock: true,
    quantity: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  
  // Get user from localStorage directly
  let user = null;
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error('Failed to get user data:', error);
  }

  // Safe toast hook usage
  let toast = null;
  try {
    const toastHook = useToast();
    toast = toastHook.toast;
  } catch (error) {
    console.error('Toast hook not available:', error);
    toast = (message) => console.log('Toast:', message);
  }

  // Show error if no store ID is available
  if (!storeId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Store Not Found</h1>
          <p className="text-slate-600 mb-6">
            Unable to determine which store to add the product to. Please go back to your dashboard.
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

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const base64Images = await Promise.all(
        files.map(async (file) => {
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`);
          }
          return await convertToBase64(file);
        })
      );

      setImageFiles(prev => [...prev, ...files]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...base64Images]
      }));

      if (toast) {
        toast({
          title: "Success",
          description: `${files.length} image(s) uploaded successfully!`,
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      if (toast) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
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
      if (!formData.quantity || isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
        throw new Error('Valid quantity is required');
      }
      if (formData.images.length === 0) {
        throw new Error('At least one product image is required');
      }
      
      // Validate store ID
      if (!storeId) {
        throw new Error('Store ID is required');
      }
      
      // Get user data
      const userData = user || JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        throw new Error('Authentication required');
      }

      // Get auth token
      const token = localStorage.getItem('token');

      // Prepare API payload with the correct store ID
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        category: formData.category,
        image: formData.images, // Array of base64 images
        in_stock: formData.in_stock,
        quantity: parseInt(formData.quantity),
        store_id: storeId, // Use the store ID we determined above
        saleEndingDate: formData.saleEndingDate ? new Date(formData.saleEndingDate).toISOString() : null
      };

      console.log('Sending payload with store ID:', storeId, payload);

      // API Call
      const response = await fetch(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        if (toast) {
          toast({
            title: "Success",
            description: "Product added successfully!",
            variant: "success"
          });
        }
        
        // Navigate back to dashboard with store ID to ensure consistency
        navigate('/dashboard', { 
          state: { 
            storeId: storeId,
            productAdded: true 
          } 
        });
      } else {
        throw new Error(result.message || 'Failed to add product');
      }
      
    } catch (error) {
      console.error('Error adding product:', error);
      if (toast) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
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
          <Link to="/dashboard" state={{ storeId: storeId }}>
            <Button variant="ghost" className="mb-4 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Add New Product</h1>
          <p className="text-slate-600">
            Add a new product to your store and start selling
          </p>
          {/* Debug info - remove in production */}
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
            <strong>Store ID:</strong> {storeId}
          </div>
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
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your product..."
                        rows={4}
                      />
                    </div>
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
                        {/* <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" /> */}
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
                        min="1"
                        required
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in_stock"
                      name="in_stock"
                      checked={formData.in_stock}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, in_stock: checked }))}
                    />
                    <Label htmlFor="in_stock">Product is in stock</Label>
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
                                {parseFloat(formData.sale_price).toFixed(2)}
                              </span>
                              <span className="text-sm text-slate-500 line-through">
                                {parseFloat(formData.price).toFixed(2)}
                              </span>
                              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                                SALE
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-slate-900">
                              {parseFloat(formData.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {formData.sale_price && (
                          <div className="mt-2">
                            <p className="text-sm text-green-600">
                              Save {(parseFloat(formData.price) - parseFloat(formData.sale_price)).toFixed(2)}!
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
                <Link to="/dashboard" state={{ storeId: storeId }}>
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