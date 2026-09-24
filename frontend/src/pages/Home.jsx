import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const productRowRef = useRef(null);
  const collectionRowRef = useRef(null);

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

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=85",
      label: "FASHION",
      title: "Give Pre-Loved Fashion a New Life",
      text: "Discover clothes, shoes and accessories at great prices.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85",
      label: "TIMELESS",
      title: "Find Your Next Watch",
      text: "Unique pre-owned pieces ready for their next owner.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85",
      label: "HOME",
      title: "Beautiful Things Live Again",
      text: "Give quality furniture and home pieces another life.",
    },
  ];

  const [heroIndex, setHeroIndex] = useState(0);

  const collections = [
    {
      title: "Everyday Essentials",
      text: "Useful pieces for everyday life.",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
      category: "Accessories",
    },
    {
      title: "Tech Finds",
      text: "Smart devices at better prices.",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
      category: "Electronics",
    },
    {
      title: "Home Stories",
      text: "Furniture with another story to tell.",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
      category: "Furniture",
    },
    {
      title: "Style Reborn",
      text: "Pre-loved fashion worth discovering.",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
      category: "Clothing",
    },
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

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchProducts(search, category);
  };

  const handleCategory = (value) => {
    setCategory(value);
    setMobileCategoriesOpen(false);
    fetchProducts(search, value);

    setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const previousHero = () => {
    setHeroIndex(
      (current) => (current - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const nextHero = () => {
    setHeroIndex((current) => (current + 1) % heroSlides.length);
  };

  const scrollRow = (ref, direction) => {
    if (!ref.current) return;

    ref.current.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  const resetProducts = () => {
    setSearch("");
    setCategory("");
    fetchProducts("", "");
  };

  return (
    <div className="loopmart-home">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="loop-navbar">
        <div className="navbar-inner">

          <Link to="/" className="loop-logo">
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
          </Link>

          <nav className="main-nav">
            <Link to="/">Shop</Link>
            <a href="#categories">Categories</a>
            <Link to="/my-orders">My Orders</Link>
          </nav>

          <form className="nav-search" onSubmit={handleSearch}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
              <path d="M16 16L21 21" strokeWidth="1.8" />
            </svg>

            <input
              type="text"
              placeholder="Search for products, brands, or keywords..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>

          <div className="nav-actions">

            <Link to="/wishlist" className="nav-action">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.8 8.8C20.8 13.7 12 19 12 19S3.2 13.7 3.2 8.8C3.2 5.9 5.4 4 8 4C9.7 4 11.2 4.8 12 6.1C12.8 4.8 14.3 4 16 4C18.6 4 20.8 5.9 20.8 8.8Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Wishlist</span>
            </Link>

            <Link to="/cart" className="cart-button">
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
            </Link>

            <Link to="/login" className="account-button">
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
            </Link>
          </div>

          <button
            className="mobile-category-button"
            onClick={() => setMobileCategoriesOpen((value) => !value)}
            aria-label="Open categories"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <form className="mobile-search" onSubmit={handleSearch}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
            <path d="M16 16L21 21" strokeWidth="1.8" />
          </svg>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </form>

        {mobileCategoriesOpen && (
          <div className="mobile-category-menu">
            <div className="mobile-category-title">
              <span>Categories</span>

              <button
                type="button"
                onClick={() => setMobileCategoriesOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="mobile-category-grid">
              {categories.map((item) => (
                <button
                  key={item.value}
                  className={category === item.value ? "selected" : ""}
                  onClick={() => handleCategory(item.value)}
                >
                  <span>
                    {renderCategoryIcon(item.icon)}
                  </span>

                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-copy">
          <small>PRE-LOVED • PREMIUM • SUSTAINABLE</small>

          <h1>
            Great Things
            <br />
            <em>Live Again.</em>
          </h1>

          <p>
            Discover quality second-hand products at better prices.
            Same value, a brighter tomorrow.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
              <path d="M16 16L21 21" strokeWidth="1.8" />
            </svg>

            <input
              type="text"
              placeholder="Search for products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit">Search</button>
          </form>

          <div className="hero-benefits">

            <div className="hero-benefit">
              <strong>01</strong>
              <span>Sustainable<br />Choices</span>
            </div>

            <div className="hero-benefit">
              <strong>02</strong>
              <span>Better<br />Prices</span>
            </div>

            <div className="hero-benefit">
              <strong>03</strong>
              <span>Trusted<br />Marketplace</span>
            </div>

          </div>
        </div>

        <div className="hero-image">

          {heroSlides.map((slide, index) => (
            <div
              key={slide.image}
              className={`hero-slide ${
                index === heroIndex ? "active" : ""
              }`}
            >
              <img src={slide.image} alt={slide.title} />

              <div className="hero-image-overlay"></div>

              <div className="hero-side-copy">
                <span>{slide.label}</span>
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
          ))}

          <button
            type="button"
            className="hero-arrow hero-arrow-left"
            onClick={previousHero}
            aria-label="Previous hero"
          >
            ‹
          </button>

          <button
            type="button"
            className="hero-arrow hero-arrow-right"
            onClick={nextHero}
            aria-label="Next hero"
          >
            ›
          </button>

          <div className="hero-dots">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={index === heroIndex ? "active" : ""}
                onClick={() => setHeroIndex(index)}
                aria-label={`Hero slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="section categories-desktop" id="categories">

        <div className="heading">
          <small>EXPLORE</small>
          <h2>Shop by Category</h2>
          <p>Find something useful, beautiful or simply worth keeping.</p>
        </div>

        <div className="row-shell">
          <button
            className="row-arrow"
            onClick={() => scrollRow(collectionRowRef, -1)}
          >
            ←
          </button>

          <div className="category-row" ref={collectionRowRef}>
            {categories.map((item) => (
              <button
                key={item.value}
                className={category === item.value ? "selected" : ""}
                onClick={() => handleCategory(item.value)}
              >
                <span>{renderCategoryIcon(item.icon)}</span>
                {item.name}
              </button>
            ))}
          </div>

          <button
            className="row-arrow"
            onClick={() => scrollRow(collectionRowRef, 1)}
          >
            →
          </button>
        </div>
      </section>

      {/* =====================================================
          COLLECTIONS
      ===================================================== */}

      <section className="section">

        <div className="heading">
          <small>CURATED FOR YOU</small>
          <h2>Explore Collections</h2>
          <p>Thoughtfully grouped finds from the LoopMart marketplace.</p>
        </div>

        <div className="row-shell">

          <button
            className="row-arrow"
            onClick={() => scrollRow(collectionRowRef, -1)}
          >
            ←
          </button>

          <div className="collection-row" ref={collectionRowRef}>
            {collections.map((item) => (
              <article key={item.title}>

                <img src={item.image} alt={item.title} />

                <div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>

                  <button onClick={() => handleCategory(item.category)}>
                    Explore →
                  </button>
                </div>

              </article>
            ))}
          </div>

          <button
            className="row-arrow"
            onClick={() => scrollRow(collectionRowRef, 1)}
          >
            →
          </button>

        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="section products" id="products">

        <div className="heading-line">

          <div className="heading">
            <small>{category ? "CATEGORY" : "FEATURED"}</small>

            <h2>
              {category || "Featured Items"}
            </h2>

            <p>
              Handpicked quality products just for you.
            </p>
          </div>

          <button
            className="view-all-button"
            onClick={resetProducts}
          >
            View All →
          </button>

        </div>

        {loading ? (
          <div className="loading">
            <div className="loader"></div>
            <span>Finding great pieces...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="empty">
            <h3>No items found</h3>

            <p>
              Try another category or search for something else.
            </p>

            <button onClick={resetProducts}>
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="row-shell product-shell">

            <button
              className="row-arrow"
              onClick={() => scrollRow(productRowRef, -1)}
            >
              ←
            </button>

            <div className="product-row" ref={productRowRef}>
              {products.map((product, index) => (
                <div
                  className="product-slide"
                  key={product._id}
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <button
              className="row-arrow"
              onClick={() => scrollRow(productRowRef, 1)}
            >
              →
            </button>

          </div>
        )}
      </section>

      {/* =====================================================
          SECOND LIFE
      ===================================================== */}

      <section className="second-life">

        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85"
          alt="Second life furniture"
        />

        <div>
          <small>THE LOOPMART IDEA</small>

          <h2>
            Give Things
            <br />
            a <em>Second Life.</em>
          </h2>

          <p>
            Every product deserves more than one story.
            LoopMart makes it easier to discover quality
            pre-loved products and keep useful things in circulation.
          </p>

          <a href="#products">
            Discover Products →
          </a>
        </div>

      </section>

      {/* =====================================================
          WHY LOOPMART
      ===================================================== */}

      <section className="section why">

        <div className="heading">
          <small>WHY LOOPMART</small>
          <h2>A Better Way to Shop</h2>
        </div>

        <div className="why-grid">

          <article>
            <b>01</b>
            <h3>Save More</h3>
            <p>
              Find useful products without paying full retail prices.
            </p>
          </article>

          <article>
            <b>02</b>
            <h3>Reuse More</h3>
            <p>
              Keep good products in use instead of letting them go to waste.
            </p>
          </article>

          <article>
            <b>03</b>
            <h3>Shop Smarter</h3>
            <p>
              Discover unique second-hand products from different categories.
            </p>
          </article>

        </div>
      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section className="about">

        <div>
          <small>ABOUT LOOPMART</small>

          <h2>
            Second-hand,
            <br />
            <em>redefined.</em>
          </h2>
        </div>

        <div>
          <p>
            LoopMart is a marketplace built around a simple idea:
            great products should not have only one life.
          </p>

          <p>
            We bring buyers and useful pre-loved products together
            in one simple marketplace designed for discovery,
            value and reuse.
          </p>

          <a href="#categories">
            Explore LoopMart →
          </a>
        </div>

      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section className="contact">

        <div>
          <small>GET IN TOUCH</small>

          <h2>
            Have a question?
          </h2>
        </div>

        <div className="contact-details">

          <p>
            <strong>Email</strong>
            <br />
            <a href="mailto:loopmart.admin@gmail.com">
              loopmart.admin@gmail.com
            </a>
          </p>

          <p>
            <strong>Phone</strong>
            <br />
            <a href="tel:+919769351949">
              +91 97693 51949
            </a>
            <br />
            <a href="tel:+919076116989">
              +91 90761 16989
            </a>
          </p>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer>

        <div className="footer-top">

          <div>
            <div className="footer-logo">

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

              <span>LoopMart</span>
            </div>

            <p>Second-hand, redefined.</p>
          </div>

          <nav>
            <Link to="/">Shop</Link>
            <a href="#categories">Categories</a>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
          </nav>

          <div className="footer-contact">
            <strong>Contact Us</strong>

            <a href="mailto:loopmart.admin@gmail.com">
              loopmart.admin@gmail.com
            </a>

            <a href="tel:+919769351949">
              +91 97693 51949
            </a>

            <a href="tel:+919076116989">
              +91 90761 16989
            </a>
          </div>

        </div>

        <div className="copyright">
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