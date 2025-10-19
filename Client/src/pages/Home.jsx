import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WhyChooseUs from '../components/WhyChooseUs';
import Services from '../components/Services';
import Plants from '../components/Plants';
import Footer from '../components/Footer';
import ScrollToTop from '../utils/ScrollToTop';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      <Hero />
      <WhyChooseUs />
      <Services />
      <Plants />
      <Footer />
    </div>
  );
};

export default Home;
