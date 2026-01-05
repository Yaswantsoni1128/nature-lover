import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef(null);
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

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/LandingPage/animated_bg.mp4" type="video/mp4" />
        </video>
        {/* Option 1: Light overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Option 2: Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/40"></div>
        
        {/* Option 3: Subtle green tint overlay */}
        <div className="absolute inset-0 bg-green-900/20"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 animate-float">
          <Sparkles className="h-8 w-8 text-green-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <Sparkles className="h-6 w-6 text-yellow-400 opacity-40" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float-slow">
          <Sparkles className="h-10 w-10 text-green-300 opacity-50" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 lg:px-8 text-center">
        <div ref={heroRef} className="opacity-0 transform translate-y-8">
          {/* Option 1: White text with shadow for contrast */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            Bring the Nature to Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
              Home
            </span>
          </h1>
          
          {/* Option 2: Dark text with light background */}
          {/* <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Transform Your Garden Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
              Paradise
            </span>
          </h1> */}
          
          <p className="text-lg md:text-xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Professional gardening services and premium plants to create your perfect outdoor sanctuary. 
            Let nature's beauty flourish in your space.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Option 1: Green gradient buttons */}
            <button 
              onClick={() => navigate('/services')}
              className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 drop-shadow-lg"
            >
              <span>Our Services</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            {/* Option 2: White button with green border */}
            <button 
              onClick={() => navigate('/plants')}
              className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 drop-shadow-lg"
            >
              <span>Buy Plants</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            {/* Option 3: Alternative button styles for better contrast */}
            {/* <button className="group bg-white/90 hover:bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2">
              <span>Our Services</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="group bg-green-600/90 hover:bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <span>Buy Plants</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
