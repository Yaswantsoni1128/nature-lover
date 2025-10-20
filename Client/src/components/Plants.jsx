import React, { useEffect, useRef } from 'react';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Plants = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

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

  const plants = [
    {
      name: "Premium Roses",
      price: "₹2,100",
      image: "/LandingPage/rose.jpg",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller"
    },
    {
      name: "Money Plant",
      price: "₹1,250",
      image: "/LandingPage/money_plant.jpg",
      rating: 4.9,
      reviews: 89,
      badge: "Popular"
    },
    {
      name: "Indoor Plants",
      price: "₹1,650",
      image: "/LandingPage/indoor_plants.jpg",
      rating: 4.7,
      reviews: 156,
      badge: "New"
    }
  ];

  return (
    <section id="plants" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div ref={sectionRef} className="opacity-0 transform translate-y-8 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
            Premium Plants{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
              Collection
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Beautiful plants for gifting or enhancing your garden
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plants.map((plant, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Plant Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    plant.badge === 'Best Seller' ? 'bg-red-500 text-white' :
                    plant.badge === 'Popular' ? 'bg-blue-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {plant.badge}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-800">{plant.rating}</span>
                </div>

                {/* Add to Cart Button */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Plant Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                  {plant.name}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(plant.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({plant.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">
                    {plant.price}
                  </span>
                  
                  <button 
                    onClick={() => navigate('/plants')}
                    className="group/btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <span>Add to Cart</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Browse All Plants Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/plants')}
            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 mx-auto"
          >
            <span>Browse All Plants</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Plants;
