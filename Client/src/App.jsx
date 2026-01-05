import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { AdminProvider } from "./contexts/AdminContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";

import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import Plants from "./pages/Plants.jsx";
import Contact from "./pages/Contact.jsx";
import Auth from "./pages/Auth.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Orders from "./pages/Orders.jsx";
import Cart from "./pages/Cart.jsx";

// Admin imports
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

const App = () => {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/plants" element={<Plants />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<Cart />} />

                {/* Admin Login (Public) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </AdminProvider>
    </ErrorBoundary>
  );
};

export default App;
