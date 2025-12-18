import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../utils/ScrollToTop';
import CheckoutModal from '../components/CheckoutModal';
import Toast from '../components/Toast';
import { ShoppingCart, Plus, Minus, Trash2, Leaf, Wrench, ArrowLeft } from 'lucide-react';
import api from '../api/api.js';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    incrementQuantity, 
    decrementQuantity, 
    getTotalItems, 
    getTotalPrice,
    clearCart,
    isInitialized,
    loading: cartLoading
  } = useCart();
  
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  useEffect(() => {
    const msg = localStorage.getItem('toastAfterNav');
    if (msg) {
      localStorage.removeItem('toastAfterNav');
      setToast({ isVisible: true, message: msg, type: 'success' });
    }
  }, [location.key]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Store current cart and redirect to login
      localStorage.setItem('pendingCheckout', 'true');
      navigate('/login');
      return;
    }

    // Show confirmation modal
    setShowCheckoutModal(true);
  };

  const handleConfirmOrder = async () => {
    setCheckoutLoading(true);
    
    try {
      // Create order in backend
      const orderData = {
        deliveryAddress: {
          street: "To be provided",
          city: "To be provided",
          state: "To be provided",
          pincode: "To be provided"
        },
        contactInfo: {
          phone: user?.phone || "To be provided",
          email: user?.email || "To be provided"
        },
        notes: "Order placed via website"
      };

      const response = await api.post('/api/orders/create', orderData);
      
      if (response.data.success) {
        // Generate order details for WhatsApp
        const orderDetails = generateOrderDetails();
        const whatsappMessage = encodeURIComponent(orderDetails);
        const whatsappUrl = `https://wa.me/919509899906?text=${whatsappMessage}`;
        
        // Close modal
        setShowCheckoutModal(false);
        
        // Show success toast
        setToast({
          isVisible: true,
          message: 'Order confirmed and placed! Redirecting to WhatsApp...',
          type: 'success'
        });
        
        // Open WhatsApp after a short delay
        setTimeout(() => {
          window.open(whatsappUrl, '_blank');
        }, 1000);
        
        // Clear cart after successful checkout
        await clearCart();
        
        // Redirect to orders page after another delay
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      // Fallback to WhatsApp only
      const orderDetails = generateOrderDetails();
      const whatsappMessage = encodeURIComponent(orderDetails);
      const whatsappUrl = `https://wa.me/919509899906?text=${whatsappMessage}`;
      
      // Close modal
      setShowCheckoutModal(false);
      
      // Show error toast
      setToast({
        isVisible: true,
        message: 'Order created with fallback. Opening WhatsApp...',
        type: 'warning'
      });
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
      
      await clearCart();
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!checkoutLoading) {
      setShowCheckoutModal(false);
    }
  };

  const generateOrderDetails = () => {
    const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN');
    
    let orderText = `🌱 *Nature Lovers - Confirmed Order* 🌱\n\n`;
    orderText += `📅 Date: ${currentDate}\n`;
    orderText += `⏰ Time: ${currentTime}\n`;
    orderText += `✅ Status: CONFIRMED\n\n`;
    
    if (user) {
      orderText += `👤 *Customer Details:*\n`;
      orderText += `Name: ${user.name}\n`;
      orderText += `Email: ${user.email}\n`;
      if (user.phone) {
        orderText += `Phone: ${user.phone}\n`;
      }
      orderText += `\n`;
    }
    
    orderText += `🛒 *Order Items:*\n`;
    cartItems.forEach((item, index) => {
      const hasNumericPrice = typeof item.price === 'number' && item.price > 0;
      orderText += `${index + 1}. ${item.name}\n`;
      orderText += `   Type: ${item.type}\n`;
      orderText += `   Quantity: ${item.quantity}\n`;
      if (!hasNumericPrice) {
        orderText += `   Price: to be discussed with the owner\n`;
        orderText += `   Subtotal: to be discussed with the owner\n\n`;
      } else {
        orderText += `   Price: ₹${item.price.toLocaleString()}\n`;
        orderText += `   Subtotal: ₹${(item.price * item.quantity).toLocaleString()}\n\n`;
      }
    });
    
    orderText += `💰 *Order Summary:*\n`;
    orderText += `Total Items: ${getTotalItems()}\n`;
    orderText += `Total Amount: ₹${getTotalPrice().toLocaleString()}\n`;
    orderText += `Delivery: FREE\n`;
    orderText += `Service Charge: ₹0\n\n`;
    
    orderText += `📞 *Contact Information:*\n`;
    orderText += `Nature Lovers\n`;
    orderText += `Phone: +91 9509899906\n`;
    orderText += `Email: naturelovers636@gmail.com\n\n`;
    
    orderText += `Thank you for choosing Nature Lovers! 🌿`;
    
    return orderText;
  };

  // Show loading state while cart is initializing
  if (!isInitialized || cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <ScrollToTop />
        <Header />
        <div className="py-20 pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-green-700 text-lg">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <ScrollToTop />
        <Header />
        
        <div className="py-20 pt-32">
          <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
            <ShoppingCart className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-green-800 mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start exploring our services and plants!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/services"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 shadow-md flex items-center justify-center space-x-2"
              >
                <Wrench className="h-5 w-5" />
                <span>Browse Services</span>
              </Link>
              <Link
                to="/plants"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300 shadow-md flex items-center justify-center space-x-2"
              >
                <Leaf className="h-5 w-5" />
                <span>Buy Plants</span>
              </Link>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <ScrollToTop />
      <Header />
      
      <div className="py-12 pt-24">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <Link
                to="/"
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-300 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="truncate">Continue Shopping</span>
              </Link>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-green-800">Shopping Cart</h1>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold shrink-0">
                {getTotalItems()} items
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 font-medium transition-colors duration-300 flex items-center space-x-2 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.type}`} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center space-x-3">
        {/* Item Image */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            {item.image || item.image_url ? (
              <img
                src={item.image || item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center" style={{ display: item.image || item.image_url ? 'none' : 'flex' }}>
              {item.type === 'plant' ? (
                <Leaf className="h-6 w-6 text-green-600" />
              ) : (
                <Wrench className="h-6 w-6 text-blue-600" />
              )}
            </div>
          </div>
        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-800 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-600 capitalize">
                            {item.type} • {item.category || 'General'}
                          </p>
                          <p className="text-sm font-bold text-green-600">
                            {typeof item.price !== 'number' || item.price <= 0
                              ? 'to be discussed with the owner'
                              : `₹${item.price.toLocaleString()}`}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => decrementQuantity(item.id, item.type)}
                            className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300"
                          >
                            <Minus className="h-3 w-3 text-gray-600" />
                          </button>
                          
                          <span className="w-6 text-center font-semibold text-gray-800 text-sm">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => incrementQuantity(item.id, item.type)}
                            className="w-6 h-6 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors duration-300"
                          >
                            <Plus className="h-3 w-3 text-green-600" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id, item.type)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-300 p-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Item Total:</span>
                          <span className="text-sm font-bold text-green-600">
                            {typeof item.price !== 'number' || item.price <= 0
                              ? 'to be discussed with the owner'
                              : `₹${(item.price * item.quantity).toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-4 sticky top-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Items ({getTotalItems()})</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Delivery</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Service Charge</span>
                    <span>₹0</span>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between text-lg font-bold text-green-800">
                    <span>Total</span>
                    <span>₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Proceed to Checkout</span>
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure checkout with SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Confirmation Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmOrder}
        cartItems={cartItems}
        totalAmount={getTotalPrice()}
        totalItems={getTotalItems()}
        user={user}
        loading={checkoutLoading}
      />

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
      />

      <Footer />
    </div>
  );
};

export default Cart;
