import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api.js';

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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from API on mount
  useEffect(() => {
    loadCartFromAPI();
  }, []);

  const loadCartFromAPI = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cart');
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
      }
    } catch (error) {
      console.error('Error loading cart from API:', error);
      // Fallback to localStorage if API fails
      const savedCart = localStorage.getItem('natureLoversCart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (parseError) {
          console.error('Error parsing localStorage cart:', parseError);
          setCartItems([]);
        }
      }
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  const addToCart = async (item, type = 'plant') => {
    try {
      const cartItem = {
        itemId: item.id.toString(),
        name: item.name,
        type,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || item.image_url,
        category: item.category
      };

      const response = await api.post('/api/cart/add', cartItem);
      
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
        // Also save to localStorage as backup
        localStorage.setItem('natureLoversCart', JSON.stringify(response.data.data.items || []));
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to local state
      setCartItems(prevItems => {
        const existingItem = prevItems.find(
          cartItem => cartItem.id === item.id && cartItem.type === type
        );

        if (existingItem) {
          return prevItems.map(cartItem =>
            cartItem.id === item.id && cartItem.type === type
              ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
              : cartItem
          );
        } else {
          return [...prevItems, { ...item, type, quantity: item.quantity || 1 }];
        }
      });
    }
  };

  const removeFromCart = async (id, type) => {
    try {
      const response = await api.delete('/api/cart/remove', {
        data: { itemId: id.toString(), type }
      });
      
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
        localStorage.setItem('natureLoversCart', JSON.stringify(response.data.data.items || []));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback to local state
      setCartItems(prevItems =>
        prevItems.filter(item => !(item.id === id && item.type === type))
      );
    }
  };

  const updateQuantity = async (id, type, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id, type);
      return;
    }

    try {
      const response = await api.put('/api/cart/update', {
        itemId: id.toString(),
        type,
        quantity: newQuantity
      });
      
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
        localStorage.setItem('natureLoversCart', JSON.stringify(response.data.data.items || []));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Fallback to local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id && item.type === type
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const incrementQuantity = async (id, type) => {
    const currentItem = cartItems.find(item => item.id === id && item.type === type);
    if (currentItem) {
      await updateQuantity(id, type, currentItem.quantity + 1);
    }
  };

  const decrementQuantity = async (id, type) => {
    const currentItem = cartItems.find(item => item.id === id && item.type === type);
    if (currentItem) {
      if (currentItem.quantity <= 1) {
        await removeFromCart(id, type);
      } else {
        await updateQuantity(id, type, currentItem.quantity - 1);
      }
    }
  };

  const clearCart = async () => {
    try {
      const response = await api.delete('/api/cart/clear');
      
      if (response.data.success) {
        setCartItems([]);
        localStorage.removeItem('natureLoversCart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Fallback to local state
      setCartItems([]);
      localStorage.removeItem('natureLoversCart');
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.length;
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    loading,
    isInitialized,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getItemCount,
    loadCartFromAPI
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
