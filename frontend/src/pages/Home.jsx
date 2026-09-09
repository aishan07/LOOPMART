import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "All", value: "", icon: "grid" },
    { name: "Electronics", value: "Electronics", icon: "laptop" },
    { name: "Furniture", value: "Furniture", icon: "chair" },
    { name: "Fashion", value: "Clothing", icon: "hanger" },
    { name: "Books", value: "Books", icon: "books" },
    { name: "Gaming", value: "Gaming", icon: "game" },
    { name: "Home & Living", value: "Home & Living", icon: "home" },
    { name: "Sports", value: "Sports", icon: "sports" },
    { name: "Automotive", value: "Automotive", icon: "car" },
    { name: "Other", value: "Other", icon: "dots" },
  ];

  const fetchProducts = async (
    currentSearch = search,
    currentCategory = category
  ) => {
    setLoading(true);

    try {
      const { data } = await api.get("/products", {
        params: {
          search: currentSearch,
          category: currentCategory,
        },
      });

      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search, category);
  };

  const handleCategory = (value) => {
    setCategory(value);
    fetchProducts(search, value);
  };

  return (
    <div className="loopmart-home">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}
      <header className="loop-navbar">
        <div className="navbar-inner">

          {/* LOGO */}
          <a href="/" className="loop-logo">
            <svg
              className="loop-logo-icon"
              viewBox="0 0 64 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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

            <span>LoopMart</span>
          </a>

          {/* NAV LINKS */}
          <nav className="main-nav">
            <a href="/">Shop</a>
            <a href="#categories">Categories</a>
            <a href="/orders">My Orders</a>
          </nav>

          {/* NAV SEARCH */}
          <form className="nav-search" onSubmit={handleSearch}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
              <path d="M16 16L21 21" strokeWidth="1.8" />
            </svg>

            <input
              type="text"
              placeholder="Search for products, brands, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* RIGHT NAV */}
          <div className="nav-actions">

            <a href="/wishlist" className="nav-action">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.8 8.8C20.8 13.7 12 19 12 19S3.2 13.7 3.2 8.8C3.2 5.9 5.4 4 8 4C9.7 4 11.2 4.8 12 6.1C12.8 4.8 14.3 4 16 4C18.6 4 20.8 5.9 20.8 8.8Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Wishlist</span>
            </a>

            <a href="/cart" className="cart-button">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 4H5L7.2 15.2C7.4 16.2 8.3 17 9.3 17H18.2C19.2 17 20 16.3 20.3 15.3L22 8H6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9.5" cy="20" r="1.4" fill="currentColor" />
                <circle cx="18" cy="20" r="1.4" fill="currentColor" />
              </svg>

              <span className="cart-count">0</span>
            </a>

            <a href="/login" className="account-button">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="7"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M5 21C5.5 16.8 8.1 14.5 12 14.5C15.9 14.5 18.5 16.8 19 21"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>

              <span>Account</span>

              <span className="account-arrow">⌄</span>
            </a>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-eyebrow">
            PRE-LOVED&nbsp;&nbsp;•&nbsp;&nbsp;PREMIUM&nbsp;&nbsp;•&nbsp;&nbsp;SUSTAINABLE
          </div>

          <h1>
            Great Things
            <br />
            <span>Live Again</span>
          </h1>

          <p className="hero-description">
            Discover high-quality second-hand products
            <br />
            at better prices. Same value, a brighter tomorrow.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
              <path d="M16 16L21 21" strokeWidth="1.8" />
            </svg>

            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">
              Search
            </button>
          </form>

          <div className="hero-benefits">

            <div className="benefit">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21C7 17.5 4 13.7 4 9.5C4 6.5 6.2 4 9 4C10.4 4 11.6 4.7 12 5.8C12.4 4.7 13.6 4 15 4C17.8 4 20 6.5 20 9.5C20 13.7 17 17.5 12 21Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 6C10 9 9 12 9 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <strong>Sustainable</strong>
                <span>Choices</span>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 10L12 4L21 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 10V19H19V10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 14H15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <div>
                <strong>Better</strong>
                <span>Prices</span>
              </div>
            </div>

            <div className="benefit">
              <div className="benefit-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3L20 6V11C20 16 16.5 19.5 12 21C7.5 19.5 4 16 4 11V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9 12L11 14L15 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <strong>Trusted</strong>
                <span>Marketplace</span>
              </div>
            </div>

          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85"
            alt="Premium second-hand furniture"
          />

          <div className="hero-image-overlay"></div>

          <div className="hero-side-copy">
            <span>GOOD</span>
            <span>THINGS</span>
            <span>CIRCULATE</span>

            <div className="side-line"></div>

            <small>
              A MORE SUSTAINABLE
              <br />
              TOMORROW
            </small>
          </div>
        </div>

        <div className="hero-dots">
          <span className="active"></span>
          <span></span>
          <span></span>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <section
        className="categories-section"
        id="categories"
      >
        <div className="category-list">

          {categories.map((item) => (
            <button
              key={item.value}
              className={`category-item ${
                category === item.value ? "selected" : ""
              }`}
              onClick={() => handleCategory(item.value)}
            >
              <div className="category-circle">
                {renderCategoryIcon(item.icon)}
              </div>

              <span>{item.name}</span>
            </button>
          ))}

        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}
      <section className="featured-section">

        <div className="featured-header">

          <div>
            <h2>
              {category ? category : "Featured Items"}
            </h2>

            <p>
              Handpicked quality products just for you.
            </p>
          </div>

          <button
            className="view-all"
            onClick={() => handleCategory("")}
          >
            View All <span>→</span>
          </button>

        </div>

        {loading ? (
          <div className="loading-state">
            <div className="premium-loader"></div>
            <p>Finding great pieces...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No items found</h3>
            <p>
              Try a different search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                fetchProducts("", "");
              }}
            >
              Browse all products
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => (
              <div
                className="product-wrapper"
                key={product._id}
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

      </section>

      {/* =====================================================
          TRUST STRIP
      ===================================================== */}
      <section className="trust-section">

        <div className="trust-item">

          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21C7 17.5 4 13.7 4 9.5C4 6.5 6.2 4 9 4C10.4 4 11.6 4.7 12 5.8C12.4 4.7 13.6 4 15 4C17.8 4 20 6.5 20 9.5C20 13.7 17 17.5 12 21Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>

          <div>
            <strong>A Greener Planet</strong>
            <span>Give products a longer life.</span>
          </div>

        </div>

        <div className="trust-divider"></div>

        <div className="trust-item">

          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="8"
              cy="8"
              r="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <circle
              cx="16"
              cy="8"
              r="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <path
              d="M2 20C2.5 16.5 4.5 15 8 15C11.5 15 13.5 16.5 14 20"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <path
              d="M10 20C10.5 16.5 12.5 15 16 15C19.5 15 21.5 16.5 22 20"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>

          <div>
            <strong>A Smarter Way to Shop</strong>
            <span>Quality products at better prices.</span>
          </div>

        </div>

        <div className="trust-divider"></div>

        <div className="trust-item">

          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L20 6V11C20 16 16.5 19.5 12 21C7.5 19.5 4 16 4 11V6L12 3Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 8V16"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M9 11H15"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>

          <div>
            <strong>A Trusted Marketplace</strong>
            <span>Shop with confidence.</span>
          </div>

        </div>

        <div className="trust-signature">
          Keep
          <br />
          Things in Loop
        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="loop-footer">

        <div className="footer-brand">
          <div className="footer-logo">
            <svg
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

            <span>LoopMart</span>
          </div>

          <p>
            Second-hand, redefined.
          </p>
        </div>

        <div className="footer-links">
          <a href="/">Shop</a>
          <a href="#categories">Categories</a>
          <a href="/orders">My Orders</a>
          <a href="/wishlist">Wishlist</a>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} LoopMart. All rights reserved.
        </div>

      </footer>

    </div>
  );
}


/* ============================================================
   CATEGORY ICONS
============================================================ */

function renderCategoryIcon(type) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
  };

  switch (type) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );

    case "laptop":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="10" rx="1" />
          <path d="M3 18H21" />
        </svg>
      );

    case "chair":
      return (
        <svg {...common}>
          <path d="M6 13V7C6 5.9 6.9 5 8 5H16C17.1 5 18 5.9 18 7V13" />
          <path d="M4 13H20V16H4Z" />
          <path d="M6 16V20" />
          <path d="M18 16V20" />
        </svg>
      );

    case "hanger":
      return (
        <svg {...common}>
          <path d="M12 5C12 3.9 12.9 3 14 3C15.1 3 16 3.9 16 5C16 6.2 15 7 14 7" />
          <path d="M14 7L4 14H20L14 7Z" />
        </svg>
      );

    case "books":
      return (
        <svg {...common}>
          <path d="M5 5H18V8H5Z" />
          <path d="M4 9H19V12H4Z" />
          <path d="M5 13H18V16H5Z" />
          <path d="M4 17H20V20H4Z" />
        </svg>
      );

    case "game":
      return (
        <svg {...common}>
          <path d="M7 9H17C19 9 21 11 21 14L20 18C19.7 19.2 18.2 19.5 17.4 18.6L15 16H9L6.6 18.6C5.8 19.5 4.3 19.2 4 18L3 14C3 11 5 9 7 9Z" />
          <path d="M7 12V15" />
          <path d="M5.5 13.5H8.5" />
          <circle cx="16.5" cy="13" r=".7" fill="currentColor" />
          <circle cx="18.5" cy="15" r=".7" fill="currentColor" />
        </svg>
      );

    case "home":
      return (
        <svg {...common}>
          <path d="M4 11L12 4L20 11V20H4V11Z" />
          <path d="M9 20V14H15V20" />
        </svg>
      );

    case "sports":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4C12 7 14 9 17 9" />
          <path d="M5 8C8 9 10 11 10 14" />
          <path d="M7 18C10 16 13 17 15 20" />
        </svg>
      );

    case "car":
      return (
        <svg {...common}>
          <path d="M4 15L6 9H18L20 15" />
          <path d="M3 15H21V19H3Z" />
          <circle cx="7" cy="19" r="1.5" />
          <circle cx="17" cy="19" r="1.5" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="6" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="18" cy="12" r="1" fill="currentColor" />
        </svg>
      );
  }
}