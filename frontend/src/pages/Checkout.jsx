import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", phone: "", addressLine: "", city: "", pincode: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    try {
      await api.post("/orders", {
        items: cart,
        shippingAddress: form,
        paymentMethod: "COD",
      });
      clearCart();
      navigate("/my-orders");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: "500px" }}>
      <h1>Checkout</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required style={inputStyle} />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required style={inputStyle} />
        <input name="addressLine" placeholder="Address" value={form.addressLine} onChange={handleChange} required style={inputStyle} />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required style={inputStyle} />
        <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required style={inputStyle} />
        <h3>Total: ₹{total} (Cash on Delivery)</h3>
        <button type="submit" style={{ padding: "12px", background: "#1f2937", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Place Order
        </button>
      </form>
    </div>
  );
}

const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" };
