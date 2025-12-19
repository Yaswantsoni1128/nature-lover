import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Star, ShoppingCart, Sun, Droplets, Leaf, Sparkles } from 'lucide-react';
import ScrollToTop from '../utils/ScrollToTop';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

// Static plants data outside component for better performance on mobile
const PLANTS = [
    {
      id: 1,
      name: "Hibiscus",
      description: "Bright and vibrant flowers. Ideal for small gardens.",
      price: 250,
      size: "small",
      image_url: "/image/Hibiscus.jpg",
      details: ["Flowering", "Full Sun", "Regular Water", "Colorful"],
      category: "outdoor"
    },
    {
      id: 2,
      name: "Premium Roses",
      description: "Beautiful, fragrant roses in various colors. Perfect for gifts or gardens.",
      price: 150,
      size: "small",
      image_url: "/LandingPage/rose.jpg",
      details: ["Flowering", "Full Sun", "Moderate Water", "Colorful"],
      category: "outdoor"
    },
    {
      id: 3,
      name: "Aparajita",
      description: "Beautiful flowering vine for medium gardens and trellises.",
      price: 150,
      size: "medium",
      image_url: "/image/Aparajita.jpg",
      details: ["Climbing", "Full Sun", "Regular Water", "Colorful"],
      category: "outdoor"
    },
    {
      id: 4,
      name: "Lantana",
      description: "Colorful flowering shrub, ideal for small gardens.",
      price: 50,
      size: "small",
      image_url: "/image/Lantana.jpg",
      details: ["Flowering", "Full Sun", "Regular Water", "Colorful"],
      category: "outdoor"
    },
    {
      id: 5,
      name: "Portulaca",
      description: "Drought-tolerant flowering plant with colorful blooms.",
      price: 50,
      size: "small",
      image_url: "/image/Portulaca.jpg",
      details: ["Flowering", "Full Sun", "Regular Water", "Colorful"],
      category: "outdoor"
    },
    {
      id: 6,
      name: "Ixora",
      description: "Compact flowering shrub with bright clusters of blooms.",
      price: 230,
      size: "small",
      image_url: "/image/Ixora.jpg",
      details: ["Flowering", "Full Sun", "Moderate Water", "Colorful"],
      category: "outdoor"
    },
    {
      id: 7,
      name: "Coleus",
      description: "Vibrant foliage plant, perfect for adding color to your garden.",
      price: 230,
      size: "small",
      image_url: "/image/Aglaonema.jpg",
      details: ["Foliage", "Full Sun", "Regular Water", "Colorful"],
      category: "outdoor"
    },
    {
      id: 8,
      name: "Jasmine",
      description: "Fragrant flowering vine, perfect for balconies and trellises.",
      price: 80,
      size: "small",
      image_url: "/image/Jasmine.jpg",
      details: ["Climbing", "Full Sun", "Regular Water"],
      category: "outdoor"
    },
    {
      id: 9,
      name: "Areca Palm",
      description: "A lush, air-purifying plant with feathery fronds. Ideal for living rooms or hallways.",
      price: 140,
      size: "medium",
      image_url: "/image/Arecapalm.jpg",
      details: ["Partial Shade", "Low Water", "Indoor", "Air Purifying"],
      category: "indoor"
    },
    {
      id: 10,
      name: "Snake Plant",
      description: "A variety of beautiful indoor plants that purify air and add life to your living spaces.",
      price: 50,
      size: "small",
      image_url: "/image/Snakeplant.jpg",
      details: ["Low Light", "Low Water", "Air Purifier"],
      category: "indoor"
    },
    {
      id: 11,
      name: "ZZ Plant",
      description: "Glossy, hardy leaves, perfect for small indoor spaces.",
      price: 240,
      size: "small",
      image_url: "/image/ZZPlant.jpg",
      details: ["Low Light", "Moderate Watering", "Easy Care"],
      category: "indoor"
    },
    {
      id: 12,
      name: "Peace Lily",
      description: "Beautiful white blooms. Purifies air and adds elegance to interiors.",
      price: 240,
      size: "medium",
      image_url: "/image/Peacelily.jpg",
      details: ["Bright Light", "Minimal Water"],
      category: "indoor"
    },
    {
      id: 13,
      name: "Money Plant",
      description: "Brings prosperity and good fortune. Easy to care for indoor spaces.",
      price: 50,
      size: "small",
      image_url: "/image/Moneyplant1.png",
      details: ["Partial Shade", "Low Water", "Indoor"],
      category: "indoor"
    },
    {
      id: 14,
      name: "Rubber Plant",
      description: "Bold dark green leaves, ideal for decorative corners.",
      price: 250,
      size: "medium",
      image_url: "/image/Rubbervariegatedplant.jpg",
      details: ["Shade", "High Humidity", "Indoor/Outdoor"],
      category: "both"
    },
    {
      id: 15,
      name: "Spider Plant",
      description: "Elegant arching leaves and baby offshoots. Very easy to care for.",
      price: 50,
      size: "small",
      image_url: "/image/Spiderplant.jpg",
      details: ["Climbing", "Full Sun", "Regular Water"],
      category: "both" // can grow indoor & outdoor
    },
    {
      id: 16,
      name: "Chinese Evergreen",
      description: "Colorful foliage that thrives in low light. Great for beginners.",
      price: 240,
      size: "medium",
      image_url: "/image/Aglaonema.jpg",
      details: ["Low Light", "Moderate Watering", "Air Purifier"],
      category: "indoor"
    },
    {
      id: 17,
      name: "Monstera Deliciosa",
      description: "A stunning tropical plant known for its large, unique leaves. Perfect for home decoration.",
      price: 400,
      size: "small",
      image_url: "/image/Philodendron.jpg",
      details: ["Bright Indirect", "Careful Watering", "Zen"],
      category: "indoor"
    },
    {
      id: 18,
      name: "Aloe Vera",
      description: "Healing plant with a clean look. Needs very little water.",
      price: 50,
      size: "small",
      image_url: "/image/Aloevera.jpg",
      details: ["Low Light", "Moderate Watering", "Air Purifier"],
      category: "both" // can easily grow indoor or outdoor
    },
    {
      id: 19,
      name: "Boston Fern",
      description: "Feathery foliage. Excellent air purifier and indoor greenery.",
      price: 240,
      size: "medium",
      image_url: "/image/Bostonfern.jpg",
      details: ["Bright Indirect", "Regular Water", "Air Purifier"],
      category: "indoor"
    },
    {
      id: 20,
      name: "Bamboo Palm",
      description: "Compact, elegant palm. Adds freshness to any room.",
      price: 150,
      size: "small",
      image_url: "/image/Bamboopalm.webp",
      details: ["Full Sun", "Regular Water", "Climbing"],
      category: "outdoor"
    },
    {
      id: 21,
      name: "Sedum",
      description: "Succulent plant, drought-tolerant, perfect for low-maintenance greenery.",
      price: 50,
      size: "small",
      image_url: "/image/Scullent.webp",
      details: ["Full Sun", "Minimal Water", "Easy Care"],
      category: "outdoor"
    },
    {
      id: 22,
      name: "Sansevieria Hahnii",
      description: "Compact succulent with easy care. Great for desktops and indoor corners.",
      price: 50,
      size: "small",
      image_url: "/image/Snakeplant.jpg",
      details: ["Bright Light", "Minimal Water", "Easy Care"],
      category: "indoor"
    },
    {
      id: 23,
      name: "Cactus",
      description: "Low-maintenance succulent. Ideal for sunny spots and easy care.",
      price: 50,
      size: "small",
      image_url: "/image/Scullent.webp",
      details: ["Full Sun", "Minimal Water", "Easy Care"],
      category: "outdoor"
    },
    {
      id: 24,
      name: "Haworthia",
      description: "Compact succulent with spiky leaves. Very low maintenance and indoor-friendly.",
      price: 50,
      size: "small",
      image_url: "/image/Scullent.webp",
      details: ["Bright Light", "Minimal Water", "Easy Care"],
      category: "indoor"
    }
  ];

const Plants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedCare, setSelectedCare] = useState('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState('all'); // all | indoor | outdoor
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [quantities, setQuantities] = useState({});
  const sectionRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterPanelRef = useRef(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

    useEffect(() => {
    setFilteredPlants(PLANTS);
  }, []);


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

  const matchesEnvironment = (plant) => {
    if (selectedEnvironment === 'all') return true;
    // show "both" in both tabs
    if (selectedEnvironment === 'indoor') return plant.category === 'indoor' || plant.category === 'both';
    if (selectedEnvironment === 'outdoor') return plant.category === 'outdoor' || plant.category === 'both';
    return true;
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

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let filtered = PLANTS;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Size filter
    if (selectedSize !== 'all') {
      filtered = filtered.filter(plant => plant.size === selectedSize);
    }

    // Indoor / Outdoor filter (includes "both" in both)
    filtered = filtered.filter(matchesEnvironment);

    // Price category filter
    if (selectedCare !== 'all') {
      filtered = filtered.filter(plant => {
        const price = plant.price;
        switch (selectedCare) {
          case 'budget':
            return price >= 0 && price <= 100;
          case 'affordable':
            return price > 100 && price <= 250;
          case 'premium':
            return price > 250 && price <= 500;
          case 'luxury':
            return price > 500;
          default:
            return true;
        }
      });
    }


    setFilteredPlants(filtered);
  }, [searchTerm, selectedSize, selectedCare, selectedEnvironment]);

  const updateQuantity = (plantId, change) => {
    setQuantities(prev => ({
      ...prev,
      [plantId]: Math.max(1, (prev[plantId] || 1) + change)
    }));
  };

  const handleOrderNow = async (plant) => {
    const quantity = quantities[plant.id] || 1;
    // Add the plant with the correct quantity (not in a loop)
    const plantWithQuantity = {
      ...plant,
      quantity: quantity
    };
    if (!requireAuthOrOpenModal(plantWithQuantity, 'plant')) return;
    const result = await addToCart(plantWithQuantity, 'plant');
    setToast({
      isVisible: true,
      message: result?.success ? 'Added to cart successfully!' : (result?.message || 'Failed to add to cart'),
      type: result?.success ? 'success' : 'error'
    });
    
    // Reset quantity after adding to cart
    setQuantities(prev => ({
      ...prev,
      [plant.id]: 1
    }));
  };

  return (
    <div className="min-h-screen bg-white lazy-load">
      <ScrollToTop />
      
      <Header/>

      {/* Hero Section with Video Background */}
      <section className="relative h-[60vh] md:h-[75vh] overflow-hidden pt-10">
        {/* Video Background with Fallback */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/LandingPage/land_scaping.jpg"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.log('Video failed to load, using fallback image');
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }}
          >
            <source src="/BuyPlants/buy_plants_hero.mp4" type="video/mp4" />
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
            <Leaf className="h-8 w-8 text-green-300 opacity-50" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <div className="inline-block mb-4">
                <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  🌱 Premium Plants
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-400">
                  Premium Plants
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-green-300">
                  Collection
                </span>
              </h1>
              
              <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                Beautiful plants for gifting or enhancing your garden. Discover our curated collection of premium plants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-100 lazy-load">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Indoor / Outdoor Bar */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
              {[
                { value: 'all', label: 'All Plants' },
                { value: 'indoor', label: 'Indoor Plants' },
                { value: 'outdoor', label: 'Outdoor Plants' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedEnvironment(tab.value)}
                  className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    selectedEnvironment === tab.value
                      ? 'bg-white text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-green-700'
                  }`}
                >
                  {tab.label}
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
                placeholder="Search plants by name..."
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
                    setSelectedSize('all');
                    setSelectedCare('all');
                    setSelectedEnvironment('all');
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
              <div className="p-4 space-y-4 overflow-auto lazy-load">
                {/* Indoor / Outdoor Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Plant Type</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Plants' },
                      { value: 'indoor', label: 'Indoor Plants' },
                      { value: 'outdoor', label: 'Outdoor Plants' }
                    ].map((env) => (
                      <label key={env.value} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="environment"
                          value={env.value}
                          checked={selectedEnvironment === env.value}
                          onChange={(e) => setSelectedEnvironment(e.target.value)}
                          className="w-4 h-4 text-green-500 focus:ring-green-300"
                        />
                        <span className={`text-sm transition-colors duration-200 group-hover:text-green-600 ${
                          selectedEnvironment === env.value ? 'text-green-600 font-medium' : 'text-gray-600'
                        }`}>
                          {env.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Plant Size</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Sizes' },
                      { value: 'small', label: 'Small Plants' },
                      { value: 'medium', label: 'Medium Plants' },
                      { value: 'large', label: 'Large Plants' }
                    ].map((size) => (
                      <label key={size.value} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="size"
                          value={size.value}
                          checked={selectedSize === size.value}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="w-4 h-4 text-green-500 focus:ring-green-300"
                        />
                        <span className={`text-sm transition-colors duration-200 group-hover:text-green-600 ${
                          selectedSize === size.value ? 'text-green-600 font-medium' : 'text-gray-600'
                        }`}>
                          {size.label}
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
                      { value: 'budget', label: 'Budget (₹0 - ₹100)' },
                      { value: 'affordable', label: 'Affordable (₹100 - ₹250)' },
                      { value: 'premium', label: 'Premium (₹250 - ₹500)' },
                      { value: 'luxury', label: 'Luxury (₹500+)' }
                    ].map((price) => (
                      <label key={price.value} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="price"
                          value={price.value}
                          checked={selectedCare === price.value}
                          onChange={(e) => setSelectedCare(e.target.value)}
                          className="w-4 h-4 text-green-500 focus:ring-green-300"
                        />
                        <span className={`text-sm transition-colors duration-200 group-hover:text-green-600 ${
                          selectedCare === price.value ? 'text-green-600 font-medium' : 'text-gray-600'
                        }`}>
                          {price.label}
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

      {/* Plants Grid */}
      <section className="relative py-2 bg-white min-h-[60vh] overflow-hidden pb-20 lazy-load">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <Sparkles className="h-6 w-6 text-green-200 opacity-30" />
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <Star className="h-4 w-4 text-yellow-200 opacity-20" />
          </div>
          <div className="absolute bottom-40 left-20 animate-float-slow">
            <Leaf className="h-8 w-8 text-green-100 opacity-25" />
          </div>
          <div className="absolute top-60 left-1/4 animate-float">
            <Sparkles className="h-5 w-5 text-green-300 opacity-20" />
          </div>
          <div className="absolute bottom-60 right-1/4 animate-float-delayed">
            <Leaf className="h-6 w-6 text-green-200 opacity-30" />
          </div>
          <div className="absolute top-80 right-10 animate-float-slow">
            <Star className="h-5 w-5 text-yellow-300 opacity-25" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 lazy-load">
          <div ref={sectionRef} >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-green-800 mb-2">
                  Our Plant Collection
                </h2>
                <p className="text-gray-600">
                  {filteredPlants.length} plants found
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlants.map((plant, index) => (
                <div
                  key={plant.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 relative"
                >
                  {/* Plant Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={plant.image_url}
                      alt={plant.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        console.log(`Image failed to load for ${plant.name}:`, plant.image_url);
                        e.target.src = '/LandingPage/land_scaping.jpg'; // Fallback image
                      }}
                    />
                    
                    {/* Size Badge */}
                    <div className="absolute top-3 right-3 z-20">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                        {plant.size}
                      </span>
                    </div>
                  </div>

                  {/* Plant Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {plant.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 leading-relaxed text-sm">
                      {plant.description}
                    </p>

                    {/* Care Details */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {plant.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center space-x-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                            {detail.includes('Sun') || detail.includes('Light') ? (
                              <Sun className="h-3 w-3 text-yellow-500" />
                            ) : detail.includes('Water') ? (
                              <Droplets className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Leaf className="h-3 w-3 text-green-500" />
                            )}
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price and Order */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-green-600">₹{plant.price.toLocaleString()}</span>
                        <span className="text-gray-500 ml-2 text-sm capitalize">{plant.size}</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700 capitalize border border-green-100">
                        {plant.category === 'both' ? 'indoor & outdoor' : plant.category}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    {/* <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(plant.id, -1)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        
                        <span className="w-8 text-center font-semibold text-gray-800">
                          {quantities[plant.id] || 1}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(plant.id, 1)}
                          className="w-8 h-8 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors duration-300"
                        >
                          <Plus className="h-4 w-4 text-green-600" />
                        </button>
                      </div>
                    </div> */}

                    <button
                      onClick={() => handleOrderNow(plant)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-md"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Order Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPlants.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No plants found</h3>
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

export default Plants;
