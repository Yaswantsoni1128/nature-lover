import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../utils/ScrollToTop';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      
      <div className="py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-4">
              My Orders
            </h1>
            <p className="text-gray-600">
              Track your gardening service orders and plant purchases
            </p>
          </div>

          {/* Orders Content */}
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

          {/* User Info */}
          <div className="mt-8 bg-green-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-green-800 mb-2">
              Welcome back, {user?.name}!
            </h4>
            <p className="text-green-700">
              Email: {user?.email} | Phone: {user?.phone}
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Orders;
