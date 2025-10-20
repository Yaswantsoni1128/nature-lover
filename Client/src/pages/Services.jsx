import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Phone, Mail, Sparkles, Star, Zap, Shield, Award, Check, Search, Filter, ShoppingCart, Plus, Minus } from 'lucide-react';
import ScrollToTop from '../utils/ScrollToTop';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext.jsx';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [quantities, setQuantities] = useState({});
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { addToCart } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const services = [
    {
      id: 1,
      title: "Grass Cutting",
      description: "Professional lawn mowing and maintenance services to keep your grass healthy and perfectly manicured. We use quality equipment and techniques for the best results.",
      image: "/LandingPage/grass_cutting.jpg",
      features: [
        "Regular mowing schedules",
        "Edge trimming", 
        "Grass collection"
      ],
      price: 2500,
      period: "per service",
      badge: "Popular",
      category: "maintenance"
    },
    {
      id: 2,
      title: "Tree Work",
      description: "Expert tree care services including pruning, removal, and health assessments. Our certified arborists ensure your trees remain healthy and safe.",
      image: "/LandingPage/tree_work.jpg",
      features: [
        "Tree pruning & trimming",
        "Tree removal",
        "Health assessments"
      ],
      price: 6200,
      period: "per service",
      badge: "Expert",
      category: "tree"
    },
    {
      id: 3,
      title: "Planting",
      description: "Professional planting services for flowers, shrubs, and trees. We select the right plants for your soil and climate conditions to ensure optimal growth.",
      image: "/LandingPage/tree_work.jpg",
      features: [
        "Plant selection advice",
        "Soil preparation",
        "Professional planting"
      ],
      price: 4200,
      period: "per service",
      badge: "New",
      category: "planting"
    },
    {
      id: 4,
      title: "Lawn Care",
      description: "Comprehensive lawn care including fertilization, weed control, and aeration. Keep your lawn lush, green, and healthy throughout the seasons.",
      image: "/LandingPage/grass_cutting.jpg",
      features: [
        "Fertilization programs",
        "Weed control",
        "Lawn aeration"
      ],
      price: 3300,
      period: "per treatment",
      badge: "Best Value",
      category: "maintenance"
    },
    {
      id: 5,
      title: "Hedge Cutting",
      description: "Professional hedge trimming and shaping services to maintain neat, attractive boundaries and privacy screens around your property.",
      image: "/LandingPage/land_scaping.jpg",
      features: [
        "Precision trimming",
        "Shape maintenance",
        "Debris cleanup"
      ],
      price: 2900,
      period: "per service",
      badge: "Popular",
      category: "maintenance"
    },
    {
      id: 6,
      title: "Tidying Up",
      description: "Complete garden cleanup services including leaf removal, debris clearing, and seasonal maintenance to keep your outdoor space pristine.",
      image: "/LandingPage/grass_cutting.jpg",
      features: [
        "Leaf removal",
        "Debris clearing",
        "Seasonal cleanup"
      ],
      price: 3800,
      period: "per visit",
      badge: "Seasonal",
      category: "maintenance"
    },
    {
      id: 7,
      title: "Landscaping",
      description: "Complete landscape design and installation services to transform your outdoor space into a stunning garden paradise tailored to your vision.",
      image: "/LandingPage/land_scaping.jpg",
      features: [
        "Custom design",
        "Plant installation",
        "Hardscape features"
      ],
      price: 16500,
      period: "per project",
      badge: "Premium",
      category: "design"
    }
  ];

  useEffect(() => {
    let filtered = services;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Price filter
    if (selectedPrice !== 'all') {
      filtered = filtered.filter(service => {
        const price = service.price;
        switch (selectedPrice) {
          case 'budget':
            return price >= 0 && price <= 3000;
          case 'affordable':
            return price > 3000 && price <= 6000;
          case 'premium':
            return price > 6000 && price <= 12000;
          case 'luxury':
            return price > 12000;
          default:
            return true;
        }
      });
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, selectedPrice]);

  const updateQuantity = (serviceId, change) => {
    setQuantities(prev => ({
      ...prev,
      [serviceId]: Math.max(1, (prev[serviceId] || 1) + change)
    }));
  };

  const handleOrderNow = (service) => {
    const quantity = quantities[service.id] || 1;
    // Add the service with the correct quantity (not in a loop)
    const serviceWithQuantity = {
      ...service,
      quantity: quantity
    };
    addToCart(serviceWithQuantity, 'service');
    
    // Reset quantity after adding to cart
    setQuantities(prev => ({
      ...prev,
      [service.id]: 1
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      
      <Header />

          {/* Services Hero Section */}
          <section className="relative h-[75vh] overflow-hidden pt-10">
            {/* Video Background with Fallback */}
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('Video failed to load, using fallback image');
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              >
                <source src="/Services/services_bg.mp4" type="video/mp4" />
              </video>
              {/* Fallback Image */}
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat hidden"
                style={{
                  backgroundImage: `url('/LandingPage/land_scaping.jpg')`
                }}
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
            </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-10 left-10 animate-float">
            <Sparkles className="h-6 w-6 text-green-400 opacity-60" />
          </div>
          <div className="absolute top-20 right-20 animate-float-delayed">
            <Star className="h-4 w-4 text-yellow-400 opacity-40" />
          </div>
          <div className="absolute bottom-20 left-20 animate-float-slow">
            <Zap className="h-8 w-8 text-green-300 opacity-50" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <div className="inline-block mb-4">
                <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  🌟 Premium Services
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-400">
                  Our Gardening
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-green-300">
                  Services
                </span>
              </h1>
              
              <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                Professional gardening services to keep your outdoor space beautiful and healthy year-round.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Filter Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors duration-300"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>

              {/* Compact Filter Popup */}
              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                  {/* Filter Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedPrice('all');
                        setSearchTerm('');
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Clear
                    </button>
                    <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-sm bg-gray-800 text-white px-4 py-1 rounded-lg hover:bg-gray-900 transition-colors duration-200"
                    >
                      Done
                    </button>
                  </div>

                  {/* Filter Options */}
                  <div className="p-4 space-y-4">
                    {/* Category Filter */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Service Category</h4>
                      <div className="space-y-2">
                        {[
                          { value: 'all', label: 'All Categories' },
                          { value: 'maintenance', label: 'Maintenance' },
                          { value: 'tree', label: 'Tree Work' },
                          { value: 'planting', label: 'Planting' },
                          { value: 'design', label: 'Design' }
                        ].map((category) => (
                          <label key={category.value} className="flex items-center space-x-3 cursor-pointer group">
                            <input
                              type="radio"
                              name="category"
                              value={category.value}
                              checked={selectedCategory === category.value}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="w-4 h-4 text-green-500 focus:ring-green-300"
                            />
                            <span className={`text-sm transition-colors duration-200 group-hover:text-green-600 ${
                              selectedCategory === category.value ? 'text-green-600 font-medium' : 'text-gray-600'
                            }`}>
                              {category.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range</h4>
                      <div className="space-y-2">
                        {[
                          { value: 'all', label: 'All Prices' },
                          { value: 'budget', label: 'Budget (₹0 - ₹3,000)' },
                          { value: 'affordable', label: 'Affordable (₹3,000 - ₹6,000)' },
                          { value: 'premium', label: 'Premium (₹6,000 - ₹12,000)' },
                          { value: 'luxury', label: 'Luxury (₹12,000+)' }
                        ].map((price) => (
                          <label key={price.value} className="flex items-center space-x-3 cursor-pointer group">
                            <input
                              type="radio"
                              name="price"
                              value={price.value}
                              checked={selectedPrice === price.value}
                              onChange={(e) => setSelectedPrice(e.target.value)}
                              className="w-4 h-4 text-green-500 focus:ring-green-300"
                            />
                            <span className={`text-sm transition-colors duration-200 group-hover:text-green-600 ${
                              selectedPrice === price.value ? 'text-green-600 font-medium' : 'text-gray-600'
                            }`}>
                              {price.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-2 bg-white min-h-[60vh] overflow-hidden pb-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
          <div ref={sectionRef} className="opacity-0 transform translate-y-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-green-800 mb-2">
                  Our Services Collection
                </h2>
                <p className="text-gray-600">
                  {filteredServices.length} services found
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 relative"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Service Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                        {service.badge}
                      </span>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price and Order */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-green-600">₹{service.price.toLocaleString()}</span>
                        <span className="text-gray-500 ml-1 text-sm">{service.period}</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(service.id, -1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        
                        <span className="w-8 text-center font-semibold text-gray-800">
                          {quantities[service.id] || 1}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(service.id, 1)}
                          className="w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors duration-300"
                        >
                          <Plus className="h-4 w-4 text-green-600" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOrderNow(service)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-md"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Order Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No services found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Services;
