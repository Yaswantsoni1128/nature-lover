import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = isAuthenticated 
    ? [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Buy Plants', href: '/plants' },
        { name: 'Contact', href: '/contact' },
        { name: 'Orders', href: '/orders' }
      ]
    : [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Buy Plants', href: '/plants' },
        { name: 'Contact', href: '/contact' },
        { name: 'Login', href: '/login' },
        { name: 'Register', href: '/register' }
      ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    }`}>
      {/* Top Bar */}
      <div className="bg-green-900 h-1"></div>
      
      {/* Main Navigation */}
      <nav className="bg-white px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 p-2 rounded-full">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-600">Nature Lovers</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors duration-200 font-medium ${
                    isActive 
                      ? 'text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {/* Logout Button for Authenticated Users */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block py-2 transition-colors duration-200 ${
                      isActive 
                        ? 'text-green-600 font-semibold border-l-4 border-green-600 pl-2' 
                        : 'text-gray-700 hover:text-green-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Mobile Logout Button for Authenticated Users */}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200 w-full py-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
