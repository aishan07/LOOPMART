import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={{ padding: "32px" }}>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "600px" }}>
      <h1>Your Cart</h1>
      {cart.map((item) => (
        <div key={item.product} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #e5e7eb" }}>
          <span>{item.title}</span>
          <span>₹{item.price}</span>
          <button onClick={() => removeFromCart(item.product)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>
            Remove
          </button>
        </div>
      ))}
      <h3 style={{ marginTop: "20px" }}>Total: ₹{total}</h3>
      <button
        onClick={() => navigate("/checkout")}
        style={{ padding: "12px 24px", background: "#1f2937", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
