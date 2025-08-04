import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';

const CreateStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categories: [],
    logo: '',
    address: '',
    phone: '',
    email: '',
    social: {
      facebook: '',
      twitter: '',
      instagram: ''
    },
    tags: [],
    color: '#1e293b'
  });
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData(prev => ({ ...prev, categories: [...prev.categories, categoryInput.trim()] }));
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (cat) => {
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Get the current user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Create a mock store
      const mockStore = {
        _id: 'mock-store-' + Date.now(),
        name: formData.name,
        description: formData.description,
        categories: formData.categories,
        logo: formData.logo || 'https://via.placeholder.com/150',
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        social: formData.social,
        tags: formData.tags,
        color: formData.color,
        owner: user._id,
        products: [],
        createdAt: new Date().toISOString()
      };
      
      // Update user with store information
      const updatedUser = {
        ...user,
        store: mockStore._id,
        storeName: formData.name
      };
      
      // Save updated user to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Save mock store to localStorage for persistence
      const existingStores = JSON.parse(localStorage.getItem('mockStores') || '[]');
      existingStores.push(mockStore);
      localStorage.setItem('mockStores', JSON.stringify(existingStores));
      
      // Show success message
      setIsLoading(false);
      alert('Store created successfully!');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Failed to create store');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Create Store</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" value={formData.description} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="social">Social Link</Label>
              <Input id="social" name="social" value={formData.social} onChange={handleChange} placeholder="https://instagram.com/yourstore" />
            </div>
            <div>
              <Label>Categories</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={categoryInput}
                  onChange={e => setCategoryInput(e.target.value)}
                  placeholder="Add category"
                />
                <Button type="button" onClick={handleAddCategory}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.categories.map(cat => (
                  <span key={cat} className="bg-slate-200 px-2 py-1 rounded text-sm flex items-center">
                    {cat}
                    <Button type="button" size="sm" variant="ghost" onClick={() => handleRemoveCategory(cat)}>
                      &times;
                    </Button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  placeholder="Add tag"
                />
                <Button type="button" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="bg-slate-200 px-2 py-1 rounded text-sm flex items-center">
                    {tag}
                    <Button type="button" size="sm" variant="ghost" onClick={() => handleRemoveTag(tag)}>
                      &times;
                    </Button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="logo">Store Logo URL</Label>
              <Input id="logo" name="logo" value={formData.logo} onChange={handleChange} placeholder="https://example.com/logo.png" />
              {formData.logo && (
                <img src={formData.logo} alt="Logo preview" className="mt-2 w-24 h-24 object-cover rounded" />
              )}
            </div>
            <div>
              <Label htmlFor="color">Theme Color</Label>
              <Input id="color" name="color" type="color" value={formData.color} onChange={handleChange} />
              <span className="ml-2">{formData.color}</span>
            </div>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-3">
                {error}
              </div>
            )}
            <Button type="submit" disabled={isLoading} className="w-full bg-slate-800 hover:bg-slate-900">
              {isLoading ? 'Creating...' : 'Create Store'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateStore;
