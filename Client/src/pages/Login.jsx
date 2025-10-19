import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ScrollToTop from '../utils/ScrollToTop'

const Login = () => {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      <div className="py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Login</h2>
          <p className="text-gray-600">Login form will be implemented here</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Login
