import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, Phone } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ScrollToTop from '../utils/ScrollToTop.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import Toast from '../components/Toast.jsx';

const getModeFromSearch = (search) => {
  const params = new URLSearchParams(search || '');
  const mode = params.get('mode');
  return mode === 'register' ? 'register' : 'login';
};

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();

  const [mode, setMode] = useState(() => getModeFromSearch(location.search));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  useEffect(() => {
    const nextMode = getModeFromSearch(location.search);
    setMode(nextMode);
  }, [location.search]);

  useEffect(() => {
    // If already logged in, redirect based on role
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/orders');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    setError('');
    setLoading(false);
    setShowPassword(false);
  }, [mode]);

  const title = useMemo(() => (mode === 'login' ? 'Welcome Back' : 'Join Nature Lovers'), [mode]);

  const goMode = (nextMode) => {
    navigate(`/auth?mode=${nextMode}`);
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      const pendingAdd = localStorage.getItem('pendingAddToCart');
      if (pendingAdd) {
        try {
          const parsed = JSON.parse(pendingAdd);
          localStorage.removeItem('pendingAddToCart');
          await addToCart(parsed.item, parsed.type);
          localStorage.setItem('toastAfterNav', 'Added to cart successfully!');
          navigate('/cart');
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem('pendingAddToCart');
        }
      }
      const pendingCheckout = localStorage.getItem('pendingCheckout');
      if (pendingCheckout) {
        localStorage.removeItem('pendingCheckout');
        navigate('/cart');
      } else {
        // Redirect based on user role
        if (result.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/orders');
        }
      }
    } else {
      setError(result.message || 'Login failed');
    }
    setLoading(false);
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const result = await register(
      registerData.name,
      registerData.email,
      registerData.password,
      registerData.phone
    );
    if (result.success) {
      const pendingAdd = localStorage.getItem('pendingAddToCart');
      if (pendingAdd) {
        try {
          const parsed = JSON.parse(pendingAdd);
          localStorage.removeItem('pendingAddToCart');
          await addToCart(parsed.item, parsed.type);
          localStorage.setItem('toastAfterNav', 'Added to cart successfully!');
          navigate('/cart');
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem('pendingAddToCart');
        }
      }
      const pendingCheckout = localStorage.getItem('pendingCheckout');
      if (pendingCheckout) {
        localStorage.removeItem('pendingCheckout');
        navigate('/cart');
      } else {
        // Redirect based on user role
        if (result.user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/orders');
        }
      }
    } else {
      setError(result.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <ScrollToTop />
      <Header />

      <div className="py-20 pt-32">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-3 rounded-full">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-green-800">{title}</h1>
              </div>

              <p className="text-gray-600 text-lg">
                {mode === 'login'
                  ? 'Login to your account to place orders, add plants to cart, and track your services.'
                  : 'Create your account to start your gardening journey with us.'}
              </p>

              <div className="inline-flex bg-gray-100 p-1 rounded-2xl border border-gray-200 w-fit">
                <button
                  type="button"
                  onClick={() => goMode('login')}
                  className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-all ${
                    mode === 'login' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-green-700'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => goMode('register')}
                  className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-all ${
                    mode === 'register'
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-green-700'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Right Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {mode === 'login' ? (
                <form onSubmit={onSubmitLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData((p) => ({ ...p, email: e.target.value }))}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-green-700 hover:text-green-800"
                      >
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-bold transition-all"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={onSubmitRegister} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={registerData.name}
                        onChange={(e) => setRegisterData((p) => ({ ...p, name: e.target.value }))}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData((p) => ({ ...p, email: e.target.value }))}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData((p) => ({ ...p, phone: e.target.value }))}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => setRegisterData((p) => ({ ...p, password: e.target.value }))}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-green-700 hover:text-green-800"
                      >
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData((p) => ({ ...p, confirmPassword: e.target.value }))}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-bold transition-all"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
      />
    </div>
  );
};

export default Auth;


