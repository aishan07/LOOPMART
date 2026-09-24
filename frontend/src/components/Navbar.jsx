import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header style={styles.nav}>
      <div style={styles.inner}>

        {/* LOGO */}
        <Link to="/" style={styles.brand}>
          <Logo />
          <span>LoopMart</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav style={styles.links}>

          <Link to="/" style={styles.link}>
            Shop
          </Link>

          <a href="/#categories" style={styles.link}>
            Categories
          </a>

          {user && (
            <Link to="/my-orders" style={styles.link}>
              My Orders
            </Link>
          )}

        </nav>

        {/* RIGHT SIDE */}
        <div style={styles.actions}>

          {/* WISHLIST */}
          <Link to="/wishlist" style={styles.actionLink}>
            <span style={styles.icon}>♡</span>
            <span>Wishlist</span>
          </Link>

          {/* CART */}
          <Link to="/cart" style={styles.cart}>
            <span style={styles.cartIcon}>🛒</span>

            <span style={styles.cartCount}>
              {cart?.length || 0}
            </span>
          </Link>

          {/* ACCOUNT / LOGIN */}
          {user ? (
            <span style={styles.account}>
              ♙
              <span>Account</span>
            </span>
          ) : (
            <Link to="/login" style={styles.actionLink}>
              ♙
              <span>Login</span>
            </Link>
          )}

          {/* ADMIN */}
          {user?.isAdmin && (
            <Link to="/admin" style={styles.link}>
              Admin
            </Link>
          )}

          {/* LOGOUT */}
          {user && (
            <button
              style={styles.logout}
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

        </div>

      </div>
    </header>
  );
}


/* =========================================================
   LOOPMART LOGO
========================================================= */

function Logo() {
  return (
    <svg
      style={styles.logoIcon}
      viewBox="0 0 64 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 20C5 11.7 11.7 5 20 5C28.3 5 35 11.7 35 20C35 28.3 41.7 35 50 35C58.3 35 63 28.3 63 20"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M59 20C59 28.3 52.3 35 44 35C35.7 35 29 28.3 29 20C29 11.7 22.3 5 14 5C5.7 5 1 11.7 1 20"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = {

  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,

    width: "100%",

    background: "rgba(250, 250, 248, 0.96)",

    backdropFilter: "blur(12px)",

    borderBottom: "1px solid #e3e7e3",

    color: "#202522",
  },

  inner: {
    width: "min(1440px, calc(100% - 56px))",

    minHeight: "76px",

    margin: "0 auto",

    display: "flex",

    alignItems: "center",

    gap: "30px",
  },

  /* ---------- LOGO ---------- */

  brand: {
    display: "flex",

    alignItems: "center",

    gap: "9px",

    color: "#244c35",

    fontSize: "21px",

    fontWeight: "800",

    letterSpacing: "-0.04em",

    textDecoration: "none",

    whiteSpace: "nowrap",
  },

  logoIcon: {
    width: "34px",
    height: "23px",

    flexShrink: 0,
  },

  /* ---------- MAIN LINKS ---------- */

  links: {
    display: "flex",

    alignItems: "center",

    gap: "25px",

    fontSize: "12px",

    fontWeight: "700",

    whiteSpace: "nowrap",
  },

  link: {
    color: "#202522",

    textDecoration: "none",

    transition: "color 0.2s ease",
  },

  /* ---------- RIGHT ACTIONS ---------- */

  actions: {
    display: "flex",

    alignItems: "center",

    gap: "18px",

    marginLeft: "auto",

    fontSize: "12px",

    fontWeight: "700",

    whiteSpace: "nowrap",
  },

  actionLink: {
    display: "flex",

    alignItems: "center",

    gap: "6px",

    color: "#202522",

    textDecoration: "none",
  },

  account: {
    display: "flex",

    alignItems: "center",

    gap: "6px",

    color: "#202522",
  },

  icon: {
    fontSize: "20px",
    lineHeight: 1,
  },

  /* ---------- CART ---------- */

  cart: {
    position: "relative",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#202522",

    textDecoration: "none",

    width: "28px",
    height: "28px",
  },

  cartIcon: {
    fontSize: "18px",
  },

  cartCount: {
    position: "absolute",

    top: "-5px",
    right: "-5px",

    width: "16px",
    height: "16px",

    display: "grid",

    placeItems: "center",

    borderRadius: "50%",

    background: "#244c35",

    color: "#fff",

    fontSize: "8px",

    fontWeight: "800",
  },

  /* ---------- LOGOUT ---------- */

  logout: {
    border: "1px solid #e3e7e3",

    background: "#fff",

    color: "#244c35",

    padding: "7px 12px",

    borderRadius: "3px",

    cursor: "pointer",

    fontSize: "11px",

    fontWeight: "700",
  },
};