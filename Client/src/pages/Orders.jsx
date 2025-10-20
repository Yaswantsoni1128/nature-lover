import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../utils/ScrollToTop';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, ShoppingBag, Leaf, Eye, Calendar, User, X } from 'lucide-react';
import api from '../api/api.js';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load orders from API
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadStats();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders');
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get('/api/orders/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <ScrollToTop />
        <Header />
        <div className="py-20 pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-green-700 text-lg">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      
      <div className="py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-green-800 mb-2">
                My Orders
              </h1>
              <p className="text-gray-600 text-sm">
                Track your gardening service orders and plant purchases
              </p>
            </div>
            
            {/* User Details Card */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-green-100 max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  No Orders Yet
                </h3>
                
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  You haven't placed any orders yet. Browse our services and plants to get started!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/services')}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Browse Services</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/plants')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Buy Plants</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-4 border border-green-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-base font-semibold text-gray-800">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="text-lg font-bold text-green-600">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleViewOrderDetails(order)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Date</p>
                        <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Items</p>
                        <p className="text-sm font-medium">{order.items.length} items</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Customer</p>
                        <p className="text-sm font-medium">{user?.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Compact Order Items Preview */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">Order Items:</p>
                      <span className="text-xs text-gray-500">{order.items.length} items (Total: {order.totalItems})</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded flex items-center justify-center">
                              {item.type === 'plant' ? (
                                <Leaf className="h-3 w-3 text-green-600" />
                              ) : (
                                <ShoppingBag className="h-3 w-3 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-green-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-500 text-center py-1">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Order #{selectedOrder._id.slice(-8)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Order Status */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1 capitalize">{selectedOrder.status}</span>
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Order Items with Images */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                      {/* Item Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center" style={{ display: item.image ? 'none' : 'flex' }}>
                          {item.type === 'plant' ? (
                            <Leaf className="h-8 w-8 text-green-600" />
                          ) : (
                            <ShoppingBag className="h-8 w-8 text-blue-600" />
                          )}
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                        <p className="text-sm text-gray-500">Category: {item.category || 'General'}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Unit Price</p>
                        <p className="font-semibold text-gray-800">₹{item.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-bold text-green-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({selectedOrder.totalItems})</span>
                    <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Charge</span>
                    <span>₹0</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold text-green-800">
                    <span>Total Amount</span>
                    <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Orders;
