import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart?.length || 0;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  /* =====================================================
     SHOP
  ===================================================== */

  const goToShop = () => {
    closeMenu();

    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document
          .getElementById("product-listing")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 300);

      return;
    }

    setTimeout(() => {
      document
        .getElementById("product-listing")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 80);
  };

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const goToCategories = () => {
    closeMenu();

    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document
          .getElementById("categories")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 300);

      return;
    }

    setTimeout(() => {
      document
        .getElementById("categories")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 80);
  };

  /* =====================================================
     LOCK BACKGROUND WHEN DRAWER IS OPEN
  ===================================================== */

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add(
        "loopmart-menu-open"
      );
    } else {
      document.body.classList.remove(
        "loopmart-menu-open"
      );
    }

    return () => {
      document.body.classList.remove(
        "loopmart-menu-open"
      );
    };
  }, [menuOpen]);

  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="loop-navbar">

        <div className="navbar-inner">

          {/* LOGO */}

          <Link
            to="/"
            className="loop-logo"
            onClick={closeMenu}
          >
            <Logo />
            <span>LoopMart</span>
          </Link>


          {/* DESKTOP LINKS */}

          <nav className="main-nav">

            <button
              type="button"
              onClick={goToShop}
            >
              Shop
            </button>

            <button
              type="button"
              onClick={goToCategories}
            >
              Categories
            </button>

            {user && (
              <Link to="/my-orders">
                My Orders
              </Link>
            )}

          </nav>


          {/* DESKTOP ACTIONS */}

          <div className="nav-actions">

            <Link
              to="/wishlist"
              className="nav-action"
            >
              <span className="heart-icon">
                ♡
              </span>

              <span>
                Wishlist
              </span>
            </Link>


            <Link
              to="/cart"
              className="cart-action"
            >
              <span className="cart-icon">
                🛒
              </span>

              <span className="cart-count">
                {cartCount}
              </span>
            </Link>


            {user ? (
              <span className="account-action">
                ♙
                <span>
                  Account
                </span>
              </span>
            ) : (
              <Link
                to="/login"
                className="nav-action"
              >
                ♙
                <span>
                  Login
                </span>
              </Link>
            )}


            {user?.isAdmin && (
              <Link
                to="/admin"
                className="admin-link"
              >
                Admin
              </Link>
            )}


            {user && (
              <button
                type="button"
                className="desktop-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}

          </div>


          {/* MOBILE THREE DOT */}

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>

        </div>

      </header>


      {/* =================================================
          MOBILE BACKDROP
      ================================================= */}

      <div
        className={
          menuOpen
            ? "mobile-menu-backdrop show"
            : "mobile-menu-backdrop"
        }
        onClick={closeMenu}
      />


      {/* =================================================
          MOBILE PANEL
      ================================================= */}

      <aside
        className={
          menuOpen
            ? "mobile-drawer open"
            : "mobile-drawer"
        }
      >

        <div className="mobile-drawer-header">

          <Link
            to="/"
            className="drawer-logo"
            onClick={closeMenu}
          >
            <Logo />
            <span>
              LoopMart
            </span>
          </Link>

          <button
            type="button"
            className="drawer-close"
            onClick={closeMenu}
          >
            ×
          </button>

        </div>


        <div className="mobile-drawer-content">

          <div className="drawer-section-title">
            SHOP
          </div>


          <button
            type="button"
            className="drawer-link"
            onClick={goToShop}
          >
            <span className="drawer-icon">
              ◇
            </span>

            <span>
              Shop
            </span>

            <span className="drawer-arrow">
              →
            </span>
          </button>


          <button
            type="button"
            className="drawer-link"
            onClick={goToCategories}
          >
            <span className="drawer-icon">
              ▦
            </span>

            <span>
              Categories
            </span>

            <span className="drawer-arrow">
              →
            </span>
          </button>


          <Link
            to="/wishlist"
            className="drawer-link"
            onClick={closeMenu}
          >
            <span className="drawer-icon">
              ♡
            </span>

            <span>
              Wishlist
            </span>

            <span className="drawer-arrow">
              →
            </span>
          </Link>


          <Link
            to="/cart"
            className="drawer-link"
            onClick={closeMenu}
          >
            <span className="drawer-icon">
              🛒
            </span>

            <span>
              Cart
            </span>

            <span className="drawer-badge">
              {cartCount}
            </span>

            <span className="drawer-arrow">
              →
            </span>
          </Link>


          {user && (
            <Link
              to="/my-orders"
              className="drawer-link"
              onClick={closeMenu}
            >
              <span className="drawer-icon">
                ◷
              </span>

              <span>
                My Orders
              </span>

              <span className="drawer-arrow">
                →
              </span>
            </Link>
          )}


          <div className="drawer-divider" />


          <div className="drawer-section-title">
            ACCOUNT
          </div>


          {user ? (
            <div className="drawer-account">

              <div className="drawer-account-icon">
                ♙
              </div>

              <div>
                <strong>
                  Account
                </strong>

                <small>
                  {user.name ||
                    user.email ||
                    "My account"}
                </small>
              </div>

            </div>
          ) : (
            <Link
              to="/login"
              className="drawer-link"
              onClick={closeMenu}
            >
              <span className="drawer-icon">
                ♙
              </span>

              <span>
                Login
              </span>

              <span className="drawer-arrow">
                →
              </span>
            </Link>
          )}


          {user?.isAdmin && (
            <Link
              to="/admin"
              className="drawer-link"
              onClick={closeMenu}
            >
              <span className="drawer-icon">
                ◈
              </span>

              <span>
                Admin Dashboard
              </span>

              <span className="drawer-arrow">
                →
              </span>
            </Link>
          )}


          {user && (
            <button
              type="button"
              className="drawer-logout"
              onClick={handleLogout}
            >
              <span>
                ↪
              </span>

              <span>
                Logout
              </span>
            </button>
          )}

        </div>


        <div className="mobile-drawer-footer">

          <span>
            LoopMart
          </span>

          <small>
            Keep things in loop.
          </small>

        </div>

      </aside>
    </>
  );
}


/* =====================================================
   LOGO
===================================================== */

function Logo() {
  return (
    <svg
      className="loop-logo-icon"
      viewBox="0 0 64 40"
      fill="none"
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