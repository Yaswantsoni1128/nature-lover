import React, { useEffect, useRef } from 'react';
import { Sprout, Wrench, Heart } from 'lucide-react';

const WhyChooseUs = () => {
  const sectionRef = useRef(null);

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

  const features = [
    {
      icon: Sprout,
      title: "Expert Care",
      description: "Professional gardening with years of experience",
      color: "from-green-400 to-green-500"
    },
    {
      icon: Wrench,
      title: "Quality Tools",
      description: "Modern equipment for perfect results",
      color: "from-blue-400 to-blue-500"
    },
    {
      icon: Heart,
      title: "Passionate Service",
      description: "We love what we do and it shows",
      color: "from-pink-400 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div ref={sectionRef} className="opacity-0 transform translate-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
              Why Choose{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                Nature Lovers?
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With years of experience in gardening and landscaping, we bring your vision to life 
              with professional expertise and passion for nature.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
              <img
                src="/LandingPage/tree_work.jpg"
                alt="Professional gardening"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
