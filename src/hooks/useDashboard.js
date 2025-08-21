import { useState, useMemo, useEffect } from 'react';
import { get } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000';

export const useDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('name');
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seller, setSeller] = useState(null);

  // Function to fetch products for a store ID
  const fetchProductsForStore = async (storeId) => {
    if (!storeId) return;
    
    try {
    //   console.log('Fetching products for store:', storeId);
      const productsResponse = await fetch(`${BASE_URL}/api/products/store/${storeId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (productsResponse.ok) {
        const productsResult = await productsResponse.json();
        // console.log('Products API response:', productsResult);
        
        const productsData = productsResult.data || productsResult.products || productsResult || [];
        setProducts(Array.isArray(productsData) ? productsData : []);
      } else {
        console.warn('Failed to fetch products:', productsResponse.status);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  // Mock toast function
  const toast = ({ title, description, variant }) => {
    console.log(`${variant === 'destructive' ? 'ERROR' : 'SUCCESS'}: ${title} - ${description}`);
  };

  // Get store ID from navigation state or localStorage
  const getStoreId = () => {
    if (location.state?.storeId) {
      console.log('Using store ID from navigation state:', location.state.token);
      return location.state.storeId;
    }
    

    if (location.state?.store && (location.state.store._id || location.state.store.id)) {
      const storeIdFromState = location.state.store._id || location.state.store.id;
    //   console.log('Extracted store ID from state store object:', storeIdFromState);
      return storeIdFromState;
    }
    
    const currentStoreId = localStorage.getItem('currentStoreId');
    if (currentStoreId) {
    //   console.log('Using store ID from localStorage:', currentStoreId);
      return currentStoreId;
    }
    
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const sellerData = JSON.parse(localStorage.getItem('seller') || '{}');
      
      const storeIdFromUser = userData?.storeId || sellerData?.storeId;
      if (storeIdFromUser) {
        // console.log('Using store ID from user/seller data:', storeIdFromUser);
        return storeIdFromUser;
      }
    } catch (e) {
      console.error('Error parsing user/seller data:', e);
    }
    
    const defaultStoreId = '68990b1cd73ae91970d9e3f4';
    // console.log('Using default store ID for testing:', defaultStoreId);
    return defaultStoreId;
  };

  const getSellerToken=()=>{
    if(location.state?.token){
      return location.state.token;
    }
    return localStorage.getItem('token');
  }
  const storeId = getStoreId();
  const sellerToken = getSellerToken();

  useEffect(() => {
    if (location.state?.store && location.state?.storeId) {
    //   console.log('Using store data directly from navigation');
      setStore(location.state.store);
      setLoading(false);
      fetchProductsForStore(location.state.storeId);
      return;
    }
    
    async function fetchStoreAndProducts() {
      if (!storeId) {
        console.log('No store ID available');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching store with ID:', storeId);
        const storeResponse = await fetch(`${BASE_URL}/api/stores/${storeId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!storeResponse.ok) {
          const errorText = await storeResponse.text();
          console.error('Store API Error:', storeResponse.status, errorText);
          throw new Error(`Failed to fetch store: ${storeResponse.status}`);
        }

        const storeResult = await storeResponse.json();
        console.log('Store API response:', storeResult);

        const storeData = storeResult.store || storeResult.data || storeResult;
        
        if (storeData && (storeData._id || storeData.id)) {
          const normalizedStore = {
            ...storeData,
            seller: storeData.seller_id ? {
              id: storeData.seller_id._id,
              name: storeData.seller_id.name,
              email: storeData.seller_id.email
            } : null
          };
          
          setStore(normalizedStore);
          console.log('Normalized store data:', normalizedStore);
          
          const storeIdForProducts = storeData._id || storeData.id;
          await fetchProductsForStore(storeIdForProducts);
          
          if (typeof Storage !== 'undefined') {
            localStorage.setItem('currentStoreId', storeIdForProducts);
          }
        } else {
          throw new Error('Store data not found in response');
        }

      } catch (error) {
        console.error('Error fetching store data:', error);
        setError(error.message);
        
        if (location.state?.store) {
          console.log('Using store data from navigation state as fallback');
          setStore(location.state.store);
        } else {
          setStore({
            _id: storeId,
            name: "Your Store (Demo Mode)",
            category: "Electronics",
            description: "Demo store - API connection needed"
          });
        }
        
        setProducts([]);
        
        toast({
          title: "API Connection Issue",
          description: "Dashboard loaded in demo mode. Check your API connection.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    async function fetchSellerProfile() {
      try {
        const response = await fetch(`${BASE_URL}/api/seller/profile`, {
          headers: {
            Authorization: `Bearer ${sellerToken}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Seller profile data:', data);
          setSeller(data);
        } else {
          throw new Error('Failed to fetch seller profile');
        }
      } catch (error) {
        console.error('Error fetching seller profile:', error);
        setError(error.message);
      } 
    }
    
    fetchStoreAndProducts();
    fetchSellerProfile();
  }, [location.state, storeId, sellerToken]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const sorted = [...products];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = a.sale_price || a.price || 0;
          const priceB = b.sale_price || b.price || 0;
          return priceB - priceA;
        case 'rating':
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        case 'name':
        default:
          const nameA = a.name || '';
          const nameB = b.name || '';
          return nameA.localeCompare(nameB);
      }
    });
    return sorted;
  }, [products, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalRevenue = products.reduce((sum, product) => {
      const price = product.sale_price || product.price || 0;
      return sum + (price * 10);
    }, 0);
    
    const averageRating = products.length > 0 
      ? (products.reduce((sum, product) => sum + (product.rating || 0), 0) / products.length).toFixed(1)
      : '0.0';
    
    const productsOnSale = products.filter(product => product.sale_price).length;

    return {
      totalProducts,
      totalRevenue,
      averageRating,
      productsOnSale
    };
  }, [products]);

  const handleDeleteProduct = async (productId, productName) => {
    if (!productId) return;
    
    try {
      const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProducts(prev => prev.filter(product => (product._id || product.id) !== productId));
        
        toast({
          title: "Product Deleted",
          description: `${productName || 'Product'} has been removed from your store.`,
        });
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleViewStore = () => {
    // console.log('Navigate to store view with storeId:', storeId);
  };

  const handleEditProduct = (productId) => {
    console.log('Navigate to edit product page with productId:', productId);
  };


  return {
    store,
    products,
    sortedProducts,
    seller,
    loading,
    error,
    stats,
    sortBy,
    setSortBy,
    storeId,
    handleDeleteProduct,
    handleViewStore,
    handleEditProduct,
    toast
  };
};
