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
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setError("");
    setPlacing(true);
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
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={{ padding: "32px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "24px" }}>Checkout</h1>

      <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-start" }}>
        <div
          style={{
            flex: "1 1 420px",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "24px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Shipping Details</h3>

          {error && (
            <p style={{ color: "#ef4444", background: "#fef2f2", padding: "10px 12px", borderRadius: "6px", marginBottom: "12px" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Field label="Full Name">
              <input name="fullName" placeholder="e.g. Priya Sharma" value={form.fullName} onChange={handleChange} required style={inputStyle} />
            </Field>

            <Field label="Phone Number">
              <input name="phone" placeholder="e.g. 9876543210" value={form.phone} onChange={handleChange} required style={inputStyle} />
            </Field>

            <Field label="Address">
              <input name="addressLine" placeholder="House no., street, area" value={form.addressLine} onChange={handleChange} required style={inputStyle} />
            </Field>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <Field label="City">
                  <input name="city" placeholder="e.g. Mumbai" value={form.city} onChange={handleChange} required style={inputStyle} />
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="Pincode">
                  <input name="pincode" placeholder="e.g. 400001" value={form.pincode} onChange={handleChange} required style={inputStyle} />
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={placing}
              style={{
                marginTop: "8px",
                padding: "14px",
                background: "#1f2937",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "1rem",
                opacity: placing ? 0.6 : 1,
              }}
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        <div
          style={{
            flex: "0 1 320px",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "24px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Order Summary</h3>

          {cart.map((item) => (
            <div
              key={item.product}
              style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "14px" }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  flexShrink: 0,
                  background: "#f3f4f6",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.image || "https://placehold.co/56x56?text=No+Image"}
                  alt={item.title}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontSize: "0.9rem", fontWeight: "500" }}>{item.title}</p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem" }}>₹{item.price}</p>
            </div>
          ))}

          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginTop: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "#6b7280" }}>
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "1.1rem" }}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <p style={{ marginTop: "16px", marginBottom: 0, fontSize: "0.85rem", color: "#6b7280" }}>
            💵 Payment: Cash on Delivery
          </p>
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>{label}</span>
    {children}
  </label>
);

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "0.95rem",
};