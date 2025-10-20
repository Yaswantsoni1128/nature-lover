import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Plants from "./pages/Plants.jsx";
import Contact from "./pages/Contact.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Orders from "./pages/Orders.jsx";
import Cart from "./pages/Cart.jsx";

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/plants" element={<Plants />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
