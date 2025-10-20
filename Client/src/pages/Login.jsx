import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../utils/ScrollToTop';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Leaf } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check if user was redirected from checkout
      const pendingCheckout = localStorage.getItem('pendingCheckout');
      if (pendingCheckout) {
        localStorage.removeItem('pendingCheckout');
        navigate('/cart');
      } else {
        navigate('/orders');
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <ScrollToTop />
      <Header />
      
      <div className="py-20 pt-32">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Information */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-green-500 p-3 rounded-full">
                    <Leaf className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-green-800">
                    Welcome Back
                  </h1>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Sign in to your account to access your orders, 
                  track services, and manage your gardening preferences.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-green-800">What you'll get:</h3>
                <div className="space-y-4">
                  {[
                    'Access to your order history',
                    'Track service appointments',
                    'Get personalized plant care tips',
                    'Exclusive member discounts',
                    'Priority customer support'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">New to Nature Lovers?</h4>
                <p className="text-blue-700 mb-4">
                  Create your account to start your gardening journey with us.
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
                Sign In
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                    Create one here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
