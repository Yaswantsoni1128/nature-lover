import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Star, Zap, Check, Search, Filter, ShoppingCart } from 'lucide-react';
import ScrollToTop from '../utils/ScrollToTop';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [quantities, setQuantities] = useState({});
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterPanelRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  useEffect(() => {
    if (!showFilters) return;

    const onPointerDown = (e) => {
      const target = e.target;
      if (filterButtonRef.current?.contains(target)) return;
      if (filterPanelRef.current?.contains(target)) return;
      setShowFilters(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [showFilters]);

  const requireAuthOrOpenModal = (pendingItem, pendingType) => {
    if (isAuthenticated) return true;
    localStorage.setItem(
      'pendingAddToCart',
      JSON.stringify({ item: pendingItem, type: pendingType, ts: Date.now() })
    );
    navigate('/auth?mode=login');
    return false;
  };

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
    // ========================================
    // PARK & LAWN SERVICES
    // For parks, societies, farmhouses, large gardens
    // ========================================
    {
      id: 1,
      title: "Grass Cutting",
      description: "Professional lawn mowing service for parks, societies, and large gardens. Regular cutting keeps your grass healthy, uniform, and beautifully manicured.",
      image: "/LandingPage/grass_cutting.jpg",
      features: [
        "Professional mowing",
        "Edge trimming",
        "Grass collection & disposal"
      ],
      period: "per service",
      badge: "Popular",
      category: "park-lawn"
    },
    {
      id: 2,
      title: "Lawn Care & Maintenance",
      description: "Complete lawn care including fertilization, weed control, aeration, and seasonal treatments. Keep your lawn lush, green, and healthy year-round.",
      image: "/LandingPage/grass_cutting.jpg",
      features: [
        "Fertilization & feeding",
        "Weed & pest control",
        "Aeration & overseeding"
      ],
      period: "per treatment",
      badge: "Best Value",
      category: "park-lawn"
    },
    {
      id: 3,
      title: "Tree Pruning & Trimming",
      description: "Expert tree care services including pruning, trimming, and health assessments. Our certified arborists ensure your trees remain healthy, safe, and beautiful.",
      image: "/LandingPage/tree_work.jpg",
      features: [
        "Professional pruning",
        "Safety trimming",
        "Health assessments"
      ],
      period: "per service",
      badge: "Expert",
      category: "park-lawn"
    },
    {
      id: 4,
      title: "Hedge Cutting & Shaping",
      description: "Professional hedge trimming and shaping services to maintain neat, attractive boundaries and privacy screens around your property.",
      image: "/LandingPage/land_scaping.jpg",
      features: [
        "Precision trimming",
        "Creative shaping",
        "Debris cleanup"
      ],
      period: "per service",
      badge: "Popular",
      category: "park-lawn"
    },
    {
      id: 5,
      title: "Landscaping Design & Execution",
      description: "Complete landscape design and installation services to transform your outdoor space into a stunning garden paradise tailored to your vision.",
      image: "/LandingPage/land_scaping.jpg",
      features: [
        "Custom design plans",
        "Professional installation",
        "Hardscape & softscape"
      ],
      period: "per project",
      badge: "Premium",
      category: "park-lawn"
    },
    {
      id: 6,
      title: "Seasonal Outdoor Planting",
      description: "Professional seasonal planting services for flowers, shrubs, and trees. We select the right plants for your climate to ensure vibrant, year-round beauty.",
      image: "/LandingPage/tree_work.jpg",
      features: [
        "Seasonal plant selection",
        "Soil preparation",
        "Professional planting"
      ],
      period: "per service",
      badge: "Seasonal",
      category: "park-lawn"
    },
    {
      id: 7,
      title: "Monthly Garden Maintenance Contract",
      description: "Premium monthly maintenance package for parks and large gardens. Includes grass cutting, pruning, fertilization, pest control, and seasonal care. Hassle-free garden management.",
      image: "/LandingPage/land_scaping.jpg",
      features: [
        "Regular grass cutting",
        "Pruning & trimming",
        "Fertilization & pest control",
        "Seasonal planting"
      ],
      period: "monthly contract",
      badge: "Popular",
      category: "park-lawn"
    },

    // ========================================
    // HOME, BALCONY & POT SERVICES
    // For flats, homes, balconies, indoor plants
    // ========================================
    {
      id: 8,
      title: "Indoor & Balcony Garden Setup",
      description: "Transform your balcony or indoor space into a green paradise. Complete setup with plant selection, pot arrangement, and design consultation.",
      image: "/LandingPage/grass_cutting.jpg",
      features: [
        "Space planning & design",
        "Plant & pot selection",
        "Complete installation"
      ],
      period: "per project",
      badge: "Popular",
      category: "home-balcony"
    },
    {
      id: 9,
      title: "Flower Pot Planting",
      description: "Professional pot planting service for your home, balcony, or terrace. We bring the right plants, soil, and expertise to create beautiful potted gardens.",
      image: "/LandingPage/tree_work.jpg",
      features: [
        "Plant selection advice",
        "Quality soil & fertilizer",
        "Professional planting"
      ],
      period: "per service",
      badge: "Best Value",
      category: "home-balcony"
    },
    {
      id: 10,
      title: "Pot & Plant Maintenance Service",
      description: "Complete plant care service including repotting, soil replacement, fertilizer application, pruning, and pest control. Keep your plants healthy and thriving.",
      image: "/LandingPage/grass_cutting.jpg",
      features: [
        "Repotting & soil change",
        "Fertilizer management",
        "Pruning & pest control"
      ],
      period: "per visit",
      badge: "Comprehensive",
      category: "home-balcony"
    },
    {
      id: 11,
      title: "Repotting & Soil Replacement",
      description: "Expert repotting service with fresh, nutrient-rich soil. Perfect for plants that have outgrown their pots or need soil rejuvenation.",
      image: "/LandingPage/land_scaping.jpg",
      features: [
        "Careful repotting",
        "Premium soil mix",
        "Root health check"
      ],
      period: "per pot",
      badge: "Essential",
      category: "home-balcony"
    },
    {
      id: 12,
      title: "Plant Health Check & Treatment",
      description: "Professional plant diagnosis and treatment service. We identify diseases, pests, and nutrient deficiencies, and provide targeted solutions.",
      image: "/LandingPage/tree_work.jpg",
      features: [
        "Health diagnosis",
        "Pest & disease treatment",
        "Care recommendations"
      ],
      period: "per visit",
      badge: "Expert",
      category: "home-balcony"
    },
    {
      id: 13,
      title: "Monthly Home Plant Care Service",
      description: "Premium monthly care package for your home plants. Includes watering guidance, fertilization, pruning, pest control, repotting, and health monitoring. Worry-free plant care.",
      image: "/LandingPage/land_scaping.jpg",
      features: [
        "Regular health checks",
        "Fertilization & pruning",
        "Pest control & treatment",
        "Repotting when needed"
      ],
      period: "monthly contract",
      badge: "Popular",
      category: "home-balcony"
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

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory]);

  const updateQuantity = (serviceId, change) => {
    setQuantities(prev => ({
      ...prev,
      [serviceId]: Math.max(1, (prev[serviceId] || 1) + change)
    }));
  };

  const handleOrderNow = async (service) => {
    const quantity = quantities[service.id] || 1;
    // Add the service with the correct quantity (not in a loop)
    const serviceWithQuantity = {
      ...service,
      quantity: quantity
    };
    if (!requireAuthOrOpenModal(serviceWithQuantity, 'service')) return;
    const result = await addToCart(serviceWithQuantity, 'service');
    setToast({
      isVisible: true,
      message: result?.success ? 'Added to cart successfully!' : (result?.message || 'Failed to add to cart'),
      type: result?.success ? 'success' : 'error'
    });
    
    // Reset quantity after adding to cart
    setQuantities(prev => ({
      ...prev,
      [service.id]: 1
    }));
  };

  return (
    <div className="min-h-screen bg-white lazy-load">
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
          {/* Category Selection Bar */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
              {[
                { value: 'all', label: 'All Services', icon: '🌿' },
                { value: 'park-lawn', label: 'Park & Lawn', icon: '🌳' },
                { value: 'home-balcony', label: 'Home & Balcony', icon: '🏡' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    selectedCategory === tab.value
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-green-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

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
                ref={filterButtonRef}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors duration-300"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>

              {/* Compact Filter Popup */}
              {showFilters && (
                <>
                  {/* Mobile backdrop (tap outside to close) */}
                  <button
                    type="button"
                    aria-label="Close filters"
                    className="md:hidden fixed inset-0 z-40 bg-black/30"
                    onClick={() => setShowFilters(false)}
                  />

                  {/* Panel: bottom sheet on mobile, anchored dropdown on md+ */}
                  <div
                    ref={filterPanelRef}
                    className="fixed z-50 left-4 right-4 bottom-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[80vh]
                           md:absolute md:inset-auto md:left-auto md:right-0 md:bottom-auto md:top-full md:mt-2 md:w-80 md:rounded-xl md:max-h-none"
                  >
                  {/* Filter Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
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
                  <div className="p-4 space-y-4 overflow-auto">
                    {/* Category Filter */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Service Category</h4>
                      <div className="space-y-2">
                        {[
                          { value: 'all', label: 'All Services' },
                          { value: 'park-lawn', label: '🌳 Park & Lawn Services' },
                          { value: 'home-balcony', label: '🏡 Home, Balcony & Pot Services' }
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
                  </div>
                  </div>
                </>
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
                  {selectedCategory === 'all' && 'All Services'}
                  {selectedCategory === 'park-lawn' && '🌳 Park & Lawn Services'}
                  {selectedCategory === 'home-balcony' && '🏡 Home, Balcony & Pot Services'}
                </h2>
                <p className="text-gray-600">
                  {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden relative border border-gray-100"
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

                    {/* Quantity Controls */}
                    {/* <div className="flex items-center justify-between mb-4">
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
                    </div> */}

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

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ isVisible: false, message: '', type: 'success' })}
      />
    </div>
  );
};

export default Services;
