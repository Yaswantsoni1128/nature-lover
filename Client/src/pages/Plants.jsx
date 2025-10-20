import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Star, ShoppingCart, Sun, Droplets, Leaf, Home, ArrowRight, Sparkles, Plus, Minus } from 'lucide-react';
import ScrollToTop from '../utils/ScrollToTop';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext.jsx';

const Plants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedCare, setSelectedCare] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [quantities, setQuantities] = useState({});
  const sectionRef = useRef(null);
  const { addToCart } = useCart();

  const plants = [
    {
      id: 1,
      name: "Hibiscus",
      description: "Bright and vibrant flowers. Ideal for small gardens.",
      price: 250,
      size: "small",
      image_url: "/image/hibiscus.png",
      details: ["Flowering", "Full Sun", "Regular Water", "Colorful"]
    },
    {
      id: 2,
      name: "Premium Roses",
      description: "Beautiful, fragrant roses in various colors. Perfect for gifts or gardens.",
      price: 150,
      size: "small",
      image_url: "/LandingPage/rose.jpg",
      details: ["Flowering", "Full Sun", "Moderate Water", "Colorful"]
    },
    {
      id: 3,
      name: "Aparajita",
      description: "Beautiful flowering vine for medium gardens and trellises.",
      price: 150,
      size: "medium",
      image_url: "/image/aparajita.jpg",
      details: ["Climbing", "Full Sun", "Regular Water", "Colorful"]
    },
    {
      id: 4,
      name: "Lantana",
      description: "Colorful flowering shrub, ideal for small gardens.",
      price: 50,
      size: "small",
      image_url: "/image/lantana.png",
      details: ["Flowering", "Full Sun", "Regular Water", "Colorful"]
    },
    {
      id: 5,
      name: "Portulaca",
      description: "Drought-tolerant flowering plant with colorful blooms.",
      price: 50,
      size: "small",
      image_url: "/image/portulaca.png",
      details: ["Flowering", "Full Sun", "Regular Water", "Colorful"]
    },
    {
      id: 6,
      name: "Ixora",
      description: "Compact flowering shrub with bright clusters of blooms.",
      price: 230,
      size: "small",
      image_url: "/image/ixora.png",
      details: ["Flowering", "Full Sun", "Moderate Water", "Colorful"]
    },
    {
      id: 7,
      name: "Coleus",
      description: "Vibrant foliage plant, perfect for adding color to your garden.",
      price: 230,
      size: "small",
      image_url: "/image/coleus.png",
      details: ["Foliage", "Full Sun", "Regular Water", "Colorful"]
    },
    {
      id: 8,
      name: "Jasmine",
      description: "Fragrant flowering vine, perfect for balconies and trellises.",
      price: 80,
      size: "small",
      image_url: "/image/jasmine.png",
      details: ["Climbing", "Full Sun", "Regular Water"]
    },
    {
      id: 9,
      name: "Areca Palm",
      description: "A lush, air-purifying plant with feathery fronds. Ideal for living rooms or hallways.",
      price: 140,
      size: "medium",
      image_url: "/image/bomboo-palm.png",
      details: ["Partial Shade", "Low Water", "Indoor", "Air Purifying"]
    },
    {
      id: 10,
      name: "Snake Plant",
      description: "A variety of beautiful indoor plants that purify air and add life to your living spaces.",
      price: 50,
      size: "small",
      image_url: "/image/sansevieria-hahnii.png",
      details: ["Low Light", "Low Water", "Air Purifier"]
    },
    {
      id: 11,
      name: "ZZ Plant",
      description: "Glossy, hardy leaves, perfect for small indoor spaces.",
      price: 240,
      size: "small",
      image_url: "/image/zzplant.png",
      details: ["Low Light", "Moderate Watering", "Easy Care"]
    },
    {
      id: 12,
      name: "Peace Lily",
      description: "Beautiful white blooms. Purifies air and adds elegance to interiors.",
      price: 240,
      size: "medium",
      image_url: "/image/zzplant.png",
      details: ["Bright Light", "Minimal Water"]
    },
    {
      id: 13,
      name: "Money Plant",
      description: "Brings prosperity and good fortune. Easy to care for indoor spaces.",
      price: 50,
      size: "small",
      image_url: "/LandingPage/money_plant.jpg",
      details: ["Partial Shade", "Low Water", "Indoor"]
    },
    {
      id: 14,
      name: "Rubber Plant",
      description: "Bold dark green leaves, ideal for decorative corners.",
      price: 250,
      size: "medium",
      image_url: "/image/zzplant.png",
      details: ["Shade", "High Humidity", "Indoor/Outdoor"]
    },
    {
      id: 15,
      name: "Spider Plant",
      description: "Elegant arching leaves and baby offshoots. Very easy to care for.",
      price: 50,
      size: "small",
      image_url: "/image/zzplant.png",
      details: ["Climbing", "Full Sun", "Regular Water"]
    },
    {
      id: 16,
      name: "Chinese Evergreen",
      description: "Colorful foliage that thrives in low light. Great for beginners.",
      price: 240,
      size: "medium",
      image_url: "/image/coleus.png",
      details: ["Low Light", "Moderate Watering", "Air Purifier"]
    },
    {
      id: 17,
      name: "Monstera Deliciosa",
      description: "A stunning tropical plant known for its large, unique leaves. Perfect for home decoration.",
      price: 400,
      size: "small",
      image_url: "/image/zzplant.png",
      details: ["Bright Indirect", "Careful Watering", "Zen"]
    },
    {
      id: 18,
      name: "Aloe Vera",
      description: "Healing plant with a clean look. Needs very little water.",
      price: 50,
      size: "small",
      image_url: "/image/cactus.png",
      details: ["Low Light", "Moderate Watering", "Air Purifier"]
    },
    {
      id: 19,
      name: "Boston Fern",
      description: "Feathery foliage. Excellent air purifier and indoor greenery.",
      price: 240,
      size: "medium",
      image_url: "/image/boston-fern.png",
      details: ["Bright Indirect", "Regular Water", "Air Purifier"]
    },
    {
      id: 20,
      name: "Bamboo Palm",
      description: "Compact, elegant palm. Adds freshness to any room.",
      price: 150,
      size: "small",
      image_url: "/image/bomboo-palm.png",
      details: ["Full Sun", "Regular Water", "Climbing"]
    },
    {
      id: 21,
      name: "Sedum",
      description: "Succulent plant, drought-tolerant, perfect for low-maintenance greenery.",
      price: 50,
      size: "small",
      image_url: "/image/sedum.png",
      details: ["Full Sun", "Minimal Water", "Easy Care"]
    },
    {
      id: 22,
      name: "Sansevieria Hahnii",
      description: "Compact succulent with easy care. Great for desktops and indoor corners.",
      price: 50,
      size: "small",
      image_url: "/image/sansevieria-hahnii.png",
      details: ["Bright Light", "Minimal Water", "Easy Care"]
    },
    {
      id: 23,
      name: "Cactus",
      description: "Low-maintenance succulent. Ideal for sunny spots and easy care.",
      price: 50,
      size: "small",
      image_url: "/image/cactus.png",
      details: ["Full Sun", "Minimal Water", "Easy Care"]
    },
    {
      id: 24,
      name: "Haworthia",
      description: "Compact succulent with spiky leaves. Very low maintenance and indoor-friendly.",
      price: 50,
      size: "small",
      image_url: "/image/haworthia.png",
      details: ["Bright Light", "Minimal Water", "Easy Care"]
    }
  ];

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
    let filtered = plants;

    // Debug: Log initial plants count
    console.log('Total plants available:', plants.length);

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('After search filter:', filtered.length);
    }

    // Size filter
    if (selectedSize !== 'all') {
      filtered = filtered.filter(plant => plant.size === selectedSize);
      console.log('After size filter:', filtered.length);
    }

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
      console.log('After price filter:', filtered.length);
    }


    setFilteredPlants(filtered);
  }, [searchTerm, selectedSize, selectedCare]);

  const updateQuantity = (plantId, change) => {
    setQuantities(prev => ({
      ...prev,
      [plantId]: Math.max(1, (prev[plantId] || 1) + change)
    }));
  };

  const handleOrderNow = (plant) => {
    const quantity = quantities[plant.id] || 1;
    // Add the plant with the correct quantity (not in a loop)
    const plantWithQuantity = {
      ...plant,
      quantity: quantity
    };
    addToCart(plantWithQuantity, 'plant');
    
    // Reset quantity after adding to cart
    setQuantities(prev => ({
      ...prev,
      [plant.id]: 1
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-green-500 p-2 rounded-full">
                <span className="text-white font-bold text-lg">🌿</span>
              </div>
              <span className="text-2xl font-bold text-green-600">Nature Lovers</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-green-600 transition-colors duration-200">Home</a>
              <a href="/services" className="text-gray-700 hover:text-green-600 transition-colors duration-200">Services</a>
              <a href="/plants" className="text-green-600 border-b-2 border-green-600 font-medium">Buy Plants</a>
              <a href="/register" className="text-gray-700 hover:text-green-600 transition-colors duration-200">Register</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors duration-200">Contact</a>
            </nav>
          </div>
        </div>
      </header> */}
      <Header/>

      {/* Hero Section with Video Background */}
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
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
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
                    setSelectedSize('all');
                    setSelectedCare('all');
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Plants Grid */}
      <section className="relative py-2 bg-white min-h-[60vh] overflow-hidden pb-20">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
          <div ref={sectionRef} className="opacity-0 transform translate-y-8">
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlants.map((plant, index) => (
                <div
                  key={plant.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 relative"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Plant Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={plant.image_url}
                      alt={plant.name}
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
                        {plant.details.slice(0, 3).map((detail, idx) => (
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
                        <span className="text-gray-500 ml-1 text-sm">{plant.size}</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mb-4">
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
                    </div>

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
    </div>
  );
};

export default Plants;
