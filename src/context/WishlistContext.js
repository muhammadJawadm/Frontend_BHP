import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { isAuthenticated } = useAuth();

  // Load wishlist from localStorage or API on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (isAuthenticated() && token) {
      // If user is authenticated, fetch wishlist from API
      fetchWishlistFromAPI();
    } else {
      // Otherwise, load from localStorage
      const storedWishlist = localStorage.getItem('markethub_wishlist');
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      }
    }
  }, [isAuthenticated]);

  // Save wishlist to localStorage whenever it changes (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem('markethub_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated]);

  // Fetch wishlist from API
  const fetchWishlistFromAPI = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      const response = await fetch('https://backend-bhp.onrender.com/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      setWishlistItems(data.wishlist?.products || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    try {
      if (isAuthenticated()) {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // If user is authenticated, add to API
        const response = await fetch('https://backend-bhp.onrender.com/api/wishlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        });

        if (!response.ok) {
          throw new Error('Failed to add item to wishlist');
        }

        const data = await response.json();
        setWishlistItems(data.items);
      } else {
        // Otherwise, add to local state
        if (!wishlistItems.includes(productId)) {
          setWishlistItems([...wishlistItems, productId]);
        }
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Fall back to local storage if API fails
      if (!wishlistItems.includes(productId)) {
        setWishlistItems([...wishlistItems, productId]);
      }
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      if (isAuthenticated()) {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // If user is authenticated, remove via API
        const response = await fetch(`https://backend-bhp.onrender.com/api/wishlist/item/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to remove item from wishlist');
        }

        const data = await response.json();
        setWishlistItems(data.items);
      } else {
        // Otherwise, remove from local state
        setWishlistItems(wishlistItems.filter(id => id !== productId));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Fall back to local storage if API fails
      setWishlistItems(wishlistItems.filter(id => id !== productId));
    }
  };

  // Check if an item is in the wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // Toggle item in wishlist (add if not present, remove if present)
  const toggleWishlistItem = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  // Clear the entire wishlist
  const clearWishlist = async () => {
    try {
      if (isAuthenticated()) {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        // If user is authenticated, clear via API
        const response = await fetch('https://backend-bhp.onrender.com/api/wishlist', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to clear wishlist');
        }

        setWishlistItems([]);
      } else {
        // Otherwise, clear local state
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      // Fall back to clearing local state if API fails
      setWishlistItems([]);
    }
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlistItem,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
