import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/checkout"
              element={<ProtectedRoute><Checkout /></ProtectedRoute>}
            />
            <Route
              path="/my-orders"
              element={<ProtectedRoute><MyOrders /></ProtectedRoute>}
            />
            <Route
              path="/admin"
              element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>}
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
