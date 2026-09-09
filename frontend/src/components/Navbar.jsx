import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>SecondLife Market</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Shop</Link>
        <Link to="/cart" style={styles.link}>Cart ({cart.length})</Link>
        {user ? (
          <>
            <Link to="/my-orders" style={styles.link}>My Orders</Link>
            {user.isAdmin && <Link to="/admin" style={styles.link}>Admin</Link>}
            <button
              style={styles.button}
              onClick={() => { logout(); navigate("/"); }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    background: "#1f2937",
    color: "#fff",
  },
  brand: { color: "#fff", fontSize: "1.25rem", fontWeight: "bold", textDecoration: "none" },
  links: { display: "flex", gap: "20px", alignItems: "center" },
  link: { color: "#fff", textDecoration: "none" },
  button: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
