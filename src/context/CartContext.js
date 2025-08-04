import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProductById } from '../data/mock';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart from localStorage on app start
    const storedCart = localStorage.getItem('markethub_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('markethub_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      
      // If user is logged in, use API to add to cart
      if (token) {
        const response = await fetch('https://backend-bhp.onrender.com/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId, quantity })
        });
  
        if (!response.ok) {
          throw new Error('Failed to add item to cart');
        }
  
        const updatedCart = await response.json();
        setCartItems(updatedCart.items);
      } else {
        // If no token, use local storage cart
        const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
        
        if (existingItemIndex !== -1) {
          // Update quantity if item already in cart
          setCartItems(prev => 
            prev.map((item, index) => 
              index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
            )
          );
        } else {
          // Add new item to cart
          setCartItems(prev => [...prev, { productId, quantity }]);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fall back to local storage if API fails
      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex !== -1) {
        setCartItems(prev => 
          prev.map((item, index) => 
            index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
          )
        );
      } else {
        setCartItems(prev => [...prev, { productId, quantity }]);
      }
      
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      
      // If user is logged in, use API to remove from cart
      if (token) {
        const response = await fetch(`https://backend-bhp.onrender.com/api/cart/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to remove item from cart');
        }
  
        const updatedCart = await response.json();
        setCartItems(updatedCart.items);
      } else {
        // If no token, use local storage cart
        setCartItems(prev => prev.filter(item => item.productId !== productId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fall back to local storage if API fails
      setCartItems(prev => prev.filter(item => item.productId !== productId));
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartItemsWithDetails = () => {
    return cartItems.map(item => {
      const product = getProductById(item.productId);
      return {
        ...item,
        product,
        totalPrice: (product?.sale_price || product?.price || 0) * item.quantity
      };
    }).filter(item => item.product); // Filter out items where product wasn't found
  };

  const getCartTotal = () => {
    return getCartItemsWithDetails().reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsWithDetails,
    getCartTotal,
    getCartCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};