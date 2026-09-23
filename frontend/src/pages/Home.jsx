import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  /* =====================================================
     HERO SLIDES
  ===================================================== */

  const heroSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85",
      category: "Furniture",
      eyebrow: "SECOND LIFE • SMARTER SHOPPING",
      title: "Great Things",
      highlight: "Live Again",
      description:
        "Discover quality pre-owned products at better prices.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=85",
      category: "Clothing",
      eyebrow: "STYLE • VALUE • REUSE",
      title: "Style That",
      highlight: "Keeps Moving",
      description:
        "Find clothing and fashion pieces ready for their next chapter.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85",
      category: "Watches",
      eyebrow: "TIMELESS • PRE-LOVED • UNIQUE",
      title: "Timeless Pieces.",
      highlight: "Better Value.",
      description:
        "Explore watches and accessories with stories of their own.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1600&q=85",
      category: "Electronics",
      eyebrow: "USEFUL • AFFORDABLE • CIRCULAR",
      title: "Technology That",
      highlight: "Lives On",
      description:
        "Useful electronics deserve more than one owner.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=85",
      category: "Shoes",
      eyebrow: "PRE-LOVED • READY • FOR YOU",
      title: "Find Your Next",
      highlight: "Favorite Pair",
      description:
        "Discover shoes and everyday essentials ready for another journey.",
    },
  ];

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = [
    {
      name: "All",
      value: "",
      icon: "grid",
    },
    {
      name: "Shoes",
      value: "Shoes",
      icon: "shoe",
    },
    {
      name: "Clothes",
      value: "Clothing",
      icon: "clothing",
    },
    {
      name: "Watches",
      value: "Watches",
      icon: "watch",
    },
    {
      name: "Accessories",
      value: "Accessories",
      icon: "bag",
    },
    {
      name: "Electronics",
      value: "Electronics",
      icon: "electronics",
    },
    {
      name: "Furniture",
      value: "Furniture",
      icon: "furniture",
    },
    {
      name: "Books",
      value: "Books",
      icon: "books",
    },
    {
      name: "Other",
      value: "Other",
      icon: "other",
    },
  ];

  /* =====================================================
     HERO SLIDER
  ===================================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextHero = () => {
    setHeroIndex((current) => (current + 1) % heroSlides.length);
  };

  const previousHero = () => {
    setHeroIndex(
      (current) =>
        (current - 1 + heroSlides.length) % heroSlides.length
    );
  };

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

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
      console.error(
        "Error fetching products:",
        error.response?.data || error.message
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = (event) => {
    event.preventDefault();
    fetchProducts(search, category);
  };

  /* =====================================================
     CATEGORY
  ===================================================== */

  const handleCategory = (value) => {
    setCategory(value);
    fetchProducts(search, value);
  };

  /* =====================================================
     CATEGORY ICONS
  ===================================================== */

  const renderCategoryIcon = (type) => {
    const props = {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    };

    switch (type) {
      case "grid":
        return (
          <svg {...props}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        );

      case "shoe":
        return (
          <svg {...props}>
            <path d="M4 17.5c2.5 0 4.5-.7 5.8-2.2l2-2.4 2.2 2.1c1.1 1 2.5 1.5 4 1.5H21v3H4c-1.1 0-2-.9-2-2Z" />
            <path d="M9.8 15.3c-.5-1.8-.7-3.7-.4-5.5l.3-2.1 2.5 1.5c.7.4 1.3 1 1.6 1.7" />
          </svg>
        );

      case "clothing":
        return (
          <svg {...props}>
            <path d="M9 4 6 6l-4 3 3 4 3-2v9h8v-9l3 2 3-4-4-3-3-2" />
            <path d="M9 4c.5 2 1.5 3 3 3s2.5-1 3-3" />
          </svg>
        );

      case "watch":
        return (
          <svg {...props}>
            <path d="M9 2h6l1 4H8l1-4Z" />
            <rect x="6.5" y="6" width="11" height="12" rx="5" />
            <path d="M8 18h8l-1 4H9l-1-4Z" />
            <path d="M12 9v3l2 1" />
          </svg>
        );

      case "bag":
        return (
          <svg {...props}>
            <path d="M5 8h14l1 12H4L5 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
        );

      case "electronics":
        return (
          <svg {...props}>
            <rect x="4" y="3" width="16" height="13" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 16v5" />
            <path d="M2 18h20" />
          </svg>
        );

      case "furniture":
        return (
          <svg {...props}>
            <path d="M6 10V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5" />
            <path d="M4 10h16v5H4z" />
            <path d="M6 15v6" />
            <path d="M18 15v6" />
          </svg>
        );

      case "books":
        return (
          <svg {...props}>
            <path d="M5 4h5v16H5z" />
            <path d="M10 4h5v16h-5z" />
            <path d="M15 6h4v14h-4z" />
          </svg>
        );

      default:
        return (
          <svg {...props}>
            <circle cx="5" cy="12" r="1.2" fill="currentColor" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
            <circle cx="19" cy="12" r="1.2" fill="currentColor" />
          </svg>
        );
    }
  };

  const currentSlide = heroSlides[heroIndex];

  return (
    <div className="loopmart-new-home">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="lm-navbar">
        <div className="lm-navbar-inner">

          {/* ORIGINAL LOOPMART LOGO */}
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

          <nav className="lm-nav-links">
            <a href="#shop">Shop</a>
            <a href="#categories">Categories</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="/orders">Orders</a>
          </nav>

          <form
            className="lm-nav-search"
            onSubmit={handleSearch}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                strokeWidth="1.8"
              />
              <path
                d="M16 16L21 21"
                strokeWidth="1.8"
              />
            </svg>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </form>

          <div className="lm-nav-actions">

            <a
              href="/wishlist"
              className="lm-nav-action"
              title="Wishlist"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.8 8.8C20.8 13.7 12 19 12 19S3.2 13.7 3.2 8.8C3.2 5.9 5.4 4 8 4C9.7 4 11.2 4.8 12 6.1C12.8 4.8 14.3 4 16 4C18.6 4 20.8 5.9 20.8 8.8Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <a
              href="/cart"
              className="lm-cart"
              title="Cart"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 4H5L7.2 15.2C7.4 16.2 8.3 17 9.3 17H18.2C19.2 17 20 16.3 20.3 15.3L22 8H6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx="9.5"
                  cy="20"
                  r="1.4"
                  fill="currentColor"
                />

                <circle
                  cx="18"
                  cy="20"
                  r="1.4"
                  fill="currentColor"
                />
              </svg>

              <span>0</span>
            </a>

            <a
              href="/login"
              className="lm-account"
            >
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
            </a>

          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="lm-hero">

        <div className="lm-hero-inner">

          <div className="lm-hero-content">

            <div className="lm-hero-eyebrow">
              {currentSlide.eyebrow}
            </div>

            <h1>
              {currentSlide.title}
              <br />
              <span>{currentSlide.highlight}</span>
            </h1>

            <p>
              {currentSlide.description}
            </p>

            <div className="lm-hero-buttons">

              <a
                href="#shop"
                className="lm-primary-button"
              >
                Shop Now

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </a>

              <a
                href="#categories"
                className="lm-outline-button"
              >
                Browse Categories
              </a>

            </div>

            <div className="lm-hero-feature">

              <span className="lm-feature-dot"></span>

              <strong>
                {currentSlide.category}
              </strong>

              <span>
                Featured category
              </span>

            </div>

          </div>

          <div className="lm-hero-visual">

            <img
              key={currentSlide.image}
              src={currentSlide.image}
              alt={currentSlide.category}
              className="lm-hero-image"
            />

            <div className="lm-hero-image-overlay"></div>

            <div className="lm-hero-category-card">
              <span>FEATURED CATEGORY</span>

              <strong>
                {currentSlide.category}
              </strong>
            </div>

            <button
              type="button"
              className="lm-hero-arrow lm-arrow-left"
              onClick={previousHero}
              aria-label="Previous hero image"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              className="lm-hero-arrow lm-arrow-right"
              onClick={nextHero}
              aria-label="Next hero image"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

          </div>

        </div>

        <div className="lm-hero-controls">

          <div className="lm-hero-dots">
            {heroSlides.map((slide, index) => (
              <button
                type="button"
                key={slide.image}
                className={
                  heroIndex === index
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setHeroIndex(index)
                }
                aria-label={`Hero slide ${index + 1}`}
              />
            ))}
          </div>

          <span>
            {String(heroIndex + 1).padStart(2, "0")}
            {" / "}
            {String(heroSlides.length).padStart(2, "0")}
          </span>

        </div>

      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section
        className="lm-categories"
        id="categories"
      >
        <div className="lm-container">

          <div className="lm-section-heading">

            <div>
              <span>EXPLORE</span>

              <h2>
                Shop by Category
              </h2>
            </div>

            <p>
              Find something useful, unique,
              or simply worth giving a second life.
            </p>

          </div>

          <div className="lm-category-grid">

            {categories.map((item) => (
              <button
                type="button"
                key={item.value || "all"}
                className={`lm-category-card ${
                  category === item.value
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleCategory(item.value)
                }
              >

                <div className="lm-category-icon">
                  {renderCategoryIcon(item.icon)}
                </div>

                <strong>
                  {item.name}
                </strong>

                <svg
                  className="lm-category-arrow"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>

              </button>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section
        className="lm-products"
        id="shop"
      >
        <div className="lm-container">

          <div className="lm-section-heading">

            <div>
              <span>OUR COLLECTION</span>

              <h2>
                {category
                  ? categories.find(
                      (item) =>
                        item.value === category
                    )?.name || category
                  : "Featured Products"}
              </h2>
            </div>

            <button
              type="button"
              className="lm-view-all"
              onClick={() =>
                handleCategory("")
              }
            >
              View All
              <span>→</span>
            </button>

          </div>

          {loading ? (
            <div className="lm-loading">
              <div className="lm-spinner"></div>
              <p>
                Finding great products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="lm-empty">

              <div className="lm-empty-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />
                  <path d="m20 20-4-4" />
                </svg>
              </div>

              <h3>
                No products found
              </h3>

              <p>
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  fetchProducts("", "");
                }}
              >
                View All Products
              </button>

            </div>
          ) : (
            <div className="lm-product-grid">

              {products.map((product) => (
                <div
                  key={
                    product._id ||
                    product.id
                  }
                >
                  <ProductCard
                    product={product}
                  />
                </div>
              ))}

            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          ABOUT US
      ===================================================== */}

      <section
        className="lm-about"
        id="about"
      >
        <div className="lm-container">

          <div className="lm-about-grid">

            <div className="lm-about-image-wrap">

              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85"
                alt="LoopMart marketplace"
                className="lm-about-image"
              />

              <div className="lm-about-badge">
                <strong>LOOP</strong>
                <span>
                  Keep useful things
                  in circulation.
                </span>
              </div>

            </div>

            <div className="lm-about-content">

              <span>
                ABOUT LOOPMART
              </span>

              <h2>
                Good products
                <br />
                deserve{" "}
                <em>another story.</em>
              </h2>

              <p className="large">
                LoopMart is a second-hand
                marketplace created to make
                buying pre-owned products
                simple, accessible and worthwhile.
              </p>

              <p>
                From clothing and watches to
                electronics, furniture and books,
                LoopMart connects people with
                products that are ready for their
                next chapter.
              </p>

              <p>
                Our goal is simple — make it easier
                to discover useful products at
                better prices while giving those
                products a longer life.
              </p>

              <a
                href="#categories"
                className="lm-primary-button"
              >
                Explore LoopMart

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          WHY LOOPMART
      ===================================================== */}

      <section className="lm-why">

        <div className="lm-container">

          <div className="lm-centered-heading">

            <span>
              WHY LOOPMART
            </span>

            <h2>
              Simple shopping.
              Better choices.
            </h2>

            <p>
              A straightforward way to
              discover pre-owned products.
            </p>

          </div>

          <div className="lm-why-grid">

            <div className="lm-why-card">

              <div className="lm-why-icon">
                ♻
              </div>

              <h3>
                Give Products
                a Second Life
              </h3>

              <p>
                Keep useful products in
                circulation and give them
                another chapter.
              </p>

            </div>

            <div className="lm-why-card">

              <div className="lm-why-icon">
                ₹
              </div>

              <h3>
                Better Value
              </h3>

              <p>
                Discover products at
                prices that make sense
                for everyday shopping.
              </p>

            </div>

            <div className="lm-why-card">

              <div className="lm-why-icon">
                ✓
              </div>

              <h3>
                Simple & Trusted
              </h3>

              <p>
                A straightforward
                marketplace designed
                around convenient shopping.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        className="lm-contact"
        id="contact"
      >
        <div className="lm-container">

          <div className="lm-contact-box">

            <div className="lm-contact-intro">

              <span>
                GET IN TOUCH
              </span>

              <h2>
                Have a question?
              </h2>

              <p>
                Need help with an order,
                product, or anything else?
                Get in touch with the
                LoopMart team.
              </p>

            </div>

            <div className="lm-contact-details">

              <a
                href="mailto:loopmart.admin@gmail.com"
                className="lm-contact-item"
              >
                <div className="lm-contact-icon">
                  ✉
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    loopmart.admin@gmail.com
                  </strong>
                </div>
              </a>

              <a
                href="tel:+919769351949"
                className="lm-contact-item"
              >
                <div className="lm-contact-icon">
                  ☎
                </div>

                <div>
                  <span>
                    Phone
                  </span>

                  <strong>
                    +91 97693 51949
                  </strong>
                </div>
              </a>

              <a
                href="tel:+919076116989"
                className="lm-contact-item"
              >
                <div className="lm-contact-icon">
                  ☎
                </div>

                <div>
                  <span>
                    Phone
                  </span>

                  <strong>
                    +91 90761 16989
                  </strong>
                </div>
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="lm-footer">

        <div className="lm-container">

          <div className="lm-footer-grid">

            <div className="lm-footer-brand">

              {/* ORIGINAL LOOP LOGO */}
              <a
                href="/"
                className="loop-logo footer-loop-logo"
              >
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

                <span>
                  LoopMart
                </span>
              </a>

              <p>
                Second-hand, redefined.
                <br />
                Give good things another life.
              </p>

            </div>

            <div className="lm-footer-column">

              <h4>
                Shop
              </h4>

              <a href="#shop">
                Products
              </a>

              <a href="#categories">
                Categories
              </a>

              <a href="/wishlist">
                Wishlist
              </a>

              <a href="/cart">
                Cart
              </a>

            </div>

            <div className="lm-footer-column">

              <h4>
                LoopMart
              </h4>

              <a href="#about">
                About Us
              </a>

              <a href="#contact">
                Contact
              </a>

              <a href="/orders">
                My Orders
              </a>

              <a href="/login">
                Account
              </a>

            </div>

            <div className="lm-footer-column">

              <h4>
                Contact
              </h4>

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

          <div className="lm-footer-bottom">

            <span>
              © {new Date().getFullYear()} LoopMart.
              All rights reserved.
            </span>

            <div>
              <a href="/privacy">
                Privacy Policy
              </a>

              <a href="/terms">
                Terms & Conditions
              </a>
            </div>

          </div>

        </div>

      </footer>

      {/* =====================================================
          ALL PAGE STYLES
      ===================================================== */}

      <style>{`

        /* ================================================
           BASE
        ================================================ */

        .loopmart-new-home {
          --green: #244c35;
          --green-dark: #183325;
          --green-soft: #eaf0eb;
          --text: #25372c;
          --muted: #707d75;
          --border: #dfe6e0;
          --light: #f5f7f5;
          --white: #ffffff;

          width: 100%;
          min-height: 100vh;

          background: #ffffff;
          color: var(--text);

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .loopmart-new-home *,
        .loopmart-new-home *::before,
        .loopmart-new-home *::after {
          box-sizing: border-box;
        }

        .loopmart-new-home a {
          color: inherit;
          text-decoration: none;
        }

        .loopmart-new-home button,
        .loopmart-new-home input {
          font-family: inherit;
        }

        .lm-container {
          width: min(1340px, calc(100% - 64px));
          margin: 0 auto;
        }

        /* ================================================
           NAVBAR
        ================================================ */

        .loopmart-new-home .lm-navbar {
          width: 100%;
          min-height: 74px;

          background: #ffffff;
          border-bottom: 1px solid var(--border);

          position: relative;
          z-index: 20;
        }

        .lm-navbar-inner {
          width: min(1420px, calc(100% - 48px));
          min-height: 74px;

          margin: 0 auto;

          display: flex;
          align-items: center;

          gap: 28px;
        }

        /* ORIGINAL LOGO */

        .loop-logo {
          display: flex;
          align-items: center;
          gap: 9px;

          flex-shrink: 0;

          color: var(--green);
        }

        .loop-logo-icon {
          width: 42px;
          height: 29px;

          display: block;
        }

        .loop-logo > span {
          color: var(--green-dark);

          font-size: 19px;
          font-weight: 700;

          letter-spacing: -0.6px;
        }

        .lm-nav-links {
          display: flex;
          align-items: center;

          gap: 23px;
          margin-left: 18px;
        }

        .lm-nav-links a {
          color: #526058;

          font-size: 12px;
          font-weight: 600;

          transition: color 0.2s ease;
        }

        .lm-nav-links a:hover {
          color: var(--green);
        }

        .lm-nav-search {
          height: 41px;

          flex: 1;
          min-width: 180px;

          display: flex;
          align-items: center;

          gap: 9px;

          padding: 0 13px;

          background: #f5f7f5;

          border: 1px solid #e2e8e3;
          border-radius: 5px;
        }

        .lm-nav-search svg {
          width: 17px;
          height: 17px;

          color: #77847c;

          flex-shrink: 0;
        }

        .lm-nav-search input {
          width: 100%;

          border: 0;
          outline: 0;

          background: transparent;

          color: var(--text);

          font-size: 12px;
        }

        .lm-nav-search input::placeholder {
          color: #9ba49e;
        }

        .lm-nav-actions {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .lm-nav-action,
        .lm-cart {
          display: flex;
          align-items: center;
          justify-content: center;

          color: #526058;

          transition: color 0.2s ease;
        }

        .lm-nav-action:hover,
        .lm-cart:hover {
          color: var(--green);
        }

        .lm-nav-action svg {
          width: 21px;
          height: 21px;
        }

        .lm-cart {
          position: relative;
        }

        .lm-cart svg {
          width: 21px;
          height: 21px;
        }

        .lm-cart span {
          position: absolute;

          top: -7px;
          right: -8px;

          min-width: 15px;
          height: 15px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: var(--green);
          color: #ffffff;

          font-size: 8px;
          font-weight: 700;
        }

        .lm-account {
          height: 38px;

          display: flex;
          align-items: center;

          gap: 7px;

          padding: 0 12px;

          border: 1px solid var(--border);
          border-radius: 5px;

          color: var(--green);

          font-size: 11px;
          font-weight: 700;
        }

        .lm-account svg {
          width: 17px;
          height: 17px;
        }

        /* ================================================
           HERO
        ================================================ */

        .lm-hero {
          padding: 52px 0 30px;

          background: #f4f6f3;
        }

        .lm-hero-inner {
          width: min(1340px, calc(100% - 64px));

          margin: 0 auto;

          display: grid;
          grid-template-columns: 0.86fr 1.14fr;

          gap: 55px;

          align-items: center;
        }

        .lm-hero-content {
          padding: 25px 0;
        }

        .lm-hero-eyebrow {
          margin-bottom: 16px;

          color: #54735f;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 2px;
        }

        .lm-hero-content h1 {
          margin: 0;

          color: var(--green-dark);

          font-size: clamp(43px, 4.3vw, 65px);

          line-height: 1.03;

          letter-spacing: -2.7px;

          font-weight: 600;
        }

        .lm-hero-content h1 span {
          color: #6d8976;
        }

        .lm-hero-content > p {
          max-width: 490px;

          margin: 25px 0 0;

          color: #68756d;

          font-size: 15px;

          line-height: 1.75;
        }

        .lm-hero-buttons {
          display: flex;

          flex-wrap: wrap;

          gap: 11px;

          margin-top: 30px;
        }

        .lm-primary-button,
        .lm-outline-button {
          min-height: 47px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 9px;

          padding: 0 20px;

          border-radius: 5px;

          font-size: 12px;

          font-weight: 700;

          transition: all 0.25s ease;
        }

        .lm-primary-button {
          background: var(--green);

          border: 1px solid var(--green);

          color: #ffffff;
        }

        .lm-primary-button:hover {
          background: var(--green-dark);

          transform: translateY(-2px);
        }

        .lm-outline-button {
          background: transparent;

          border: 1px solid #c7d2ca;

          color: var(--green);
        }

        .lm-outline-button:hover {
          background: #ffffff;

          border-color: #9faf9f;
        }

        .lm-hero-feature {
          display: flex;
          align-items: center;

          gap: 8px;

          margin-top: 38px;

          padding-top: 20px;

          border-top: 1px solid #dce3dd;

          color: #758179;

          font-size: 10px;
        }

        .lm-hero-feature strong {
          color: var(--green-dark);

          font-size: 11px;
        }

        .lm-feature-dot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: var(--green);
        }

        /* HERO IMAGE */

        .lm-hero-visual {
          position: relative;

          height: 540px;

          overflow: hidden;

          border-radius: 8px;

          background: #dfe5df;

          box-shadow:
            0 20px 55px rgba(24, 51, 37, 0.12);
        }

        .lm-hero-image {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          display: block;

          object-fit: cover;

          animation: lmHeroFade 0.65s ease;
        }

        @keyframes lmHeroFade {
          from {
            opacity: 0.35;
            transform: scale(1.025);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .lm-hero-image-overlay {
          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.02) 35%,
              rgba(0, 0, 0, 0.28) 100%
            );

          pointer-events: none;
        }

        .lm-hero-category-card {
          position: absolute;

          left: 24px;
          bottom: 24px;

          min-width: 185px;

          padding: 15px 18px;

          border-radius: 5px;

          background: rgba(255, 255, 255, 0.94);

          backdrop-filter: blur(10px);
        }

        .lm-hero-category-card span {
          display: block;

          margin-bottom: 5px;

          color: #78847c;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 1.5px;
        }

        .lm-hero-category-card strong {
          color: var(--green-dark);

          font-size: 19px;
        }

        .lm-hero-arrow {
          position: absolute;

          top: 50%;

          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 0;
          border-radius: 50%;

          background: rgba(255, 255, 255, 0.92);

          color: var(--green-dark);

          cursor: pointer;

          transform: translateY(-50%);

          transition: all 0.2s ease;
        }

        .lm-hero-arrow:hover {
          background: #ffffff;

          transform:
            translateY(-50%)
            scale(1.07);
        }

        .lm-arrow-left {
          left: 18px;
        }

        .lm-arrow-right {
          right: 18px;
        }

        .lm-hero-controls {
          width: min(1340px, calc(100% - 64px));

          margin: 16px auto 0;

          display: flex;

          align-items: center;
          justify-content: space-between;
        }

        .lm-hero-dots {
          display: flex;

          align-items: center;

          gap: 6px;
        }

        .lm-hero-dots button {
          width: 23px;
          height: 3px;

          padding: 0;

          border: 0;
          border-radius: 4px;

          background: #c5cec7;

          cursor: pointer;

          transition: all 0.3s ease;
        }

        .lm-hero-dots button.active {
          width: 42px;

          background: var(--green);
        }

        .lm-hero-controls > span {
          color: #7d8881;

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 1px;
        }

        /* ================================================
           CATEGORIES
        ================================================ */

        .lm-categories {
          padding: 82px 0 76px;

          background: #ffffff;
        }

        .lm-section-heading {
          display: flex;

          align-items: flex-end;
          justify-content: space-between;

          gap: 30px;

          margin-bottom: 30px;
        }

        .lm-section-heading > div > span,
        .lm-about-content > span,
        .lm-contact-intro > span,
        .lm-centered-heading > span {
          display: block;

          margin-bottom: 13px;

          color: #597663;

          font-size: 10px;

          font-weight: 800;

          letter-spacing: 2px;
        }

        .lm-section-heading h2 {
          margin: 0;

          color: var(--green-dark);

          font-size: 34px;

          line-height: 1.1;

          letter-spacing: -1.3px;

          font-weight: 600;
        }

        .lm-section-heading > p {
          max-width: 430px;

          margin: 0;

          color: #77827b;

          font-size: 13px;

          line-height: 1.7;
        }

        .lm-category-grid {
          display: grid;

          grid-template-columns:
            repeat(9, minmax(0, 1fr));

          gap: 11px;
        }

        .lm-category-card {
          position: relative;

          min-height: 145px;

          padding: 19px 15px;

          display: flex;

          flex-direction: column;

          align-items: flex-start;

          justify-content: space-between;

          text-align: left;

          border: 1px solid var(--border);

          border-radius: 6px;

          background: #ffffff;

          color: var(--text);

          cursor: pointer;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .lm-category-card:hover {
          transform: translateY(-4px);

          border-color: #b7c6bb;

          box-shadow:
            0 12px 28px rgba(24, 51, 37, 0.07);
        }

        .lm-category-card.selected {
          background: var(--green-soft);

          border-color: #8da493;
        }

        .lm-category-icon {
          width: 45px;
          height: 45px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #f0f4f1;

          color: #355d43;
        }

        .lm-category-icon svg {
          width: 26px;
          height: 26px;
        }

        .lm-category-card.selected
        .lm-category-icon {
          background: #dce9df;
        }

        .lm-category-card strong {
          color: #20372a;

          font-size: 12px;
        }

        .lm-category-arrow {
          position: absolute;

          top: 18px;
          right: 14px;

          color: #8e9992;

          opacity: 0;

          transform: translateX(-3px);

          transition: all 0.2s ease;
        }

        .lm-category-card:hover
        .lm-category-arrow,
        .lm-category-card.selected
        .lm-category-arrow {
          opacity: 1;

          transform: translateX(0);
        }

        /* ================================================
           PRODUCTS
        ================================================ */

        .lm-products {
          padding: 72px 0 90px;

          background: #f7f8f6;
        }

        .lm-view-all {
          display: flex;

          align-items: center;

          gap: 8px;

          padding: 10px 0;

          border: 0;

          background: transparent;

          color: var(--green);

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;
        }

        .lm-view-all span {
          font-size: 17px;
        }

        .lm-product-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 21px;
        }

        .lm-loading {
          min-height: 280px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-direction: column;

          gap: 12px;

          color: #758078;

          font-size: 12px;
        }

        .lm-spinner {
          width: 32px;
          height: 32px;

          border: 2px solid #d8e0da;

          border-top-color: var(--green);

          border-radius: 50%;

          animation: lmSpin 0.8s linear infinite;
        }

        @keyframes lmSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .lm-empty {
          min-height: 290px;

          padding: 45px 20px;

          display: flex;

          align-items: center;
          justify-content: center;

          flex-direction: column;

          text-align: center;

          background: #ffffff;

          border: 1px solid var(--border);

          border-radius: 7px;
        }

        .lm-empty-icon {
          width: 65px;
          height: 65px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 15px;

          border-radius: 50%;

          background: #edf2ee;

          color: var(--green);
        }

        .lm-empty h3 {
          margin: 0 0 7px;

          color: var(--green-dark);

          font-size: 18px;
        }

        .lm-empty p {
          margin: 0 0 20px;

          color: #77827b;

          font-size: 12px;
        }

        .lm-empty button {
          min-height: 42px;

          padding: 0 18px;

          border: 0;

          border-radius: 5px;

          background: var(--green);

          color: #ffffff;

          font-size: 11px;

          font-weight: 700;

          cursor: pointer;
        }

        /* ================================================
           ABOUT
        ================================================ */

        .lm-about {
          padding: 105px 0;

          background: #ffffff;
        }

        .lm-about-grid {
          display: grid;

          grid-template-columns:
            0.95fr 1.05fr;

          gap: 85px;

          align-items: center;
        }

        .lm-about-image-wrap {
          position: relative;

          padding:
            0
            35px
            35px
            0;
        }

        .lm-about-image {
          width: 100%;
          height: 520px;

          display: block;

          object-fit: cover;

          border-radius: 7px;
        }

        .lm-about-badge {
          position: absolute;

          right: 0;
          bottom: 0;

          width: 180px;

          padding: 21px;

          background: var(--green);

          color: #ffffff;

          border-radius: 6px;

          box-shadow:
            0 15px 35px rgba(24, 51, 37, 0.18);
        }

        .lm-about-badge strong {
          display: block;

          font-size: 28px;

          letter-spacing: 2px;
        }

        .lm-about-badge span {
          display: block;

          margin-top: 7px;

          color: rgba(255,255,255,0.7);

          font-size: 10px;

          line-height: 1.5;
        }

        .lm-about-content h2 {
          margin: 0;

          color: var(--green-dark);

          font-size: clamp(39px, 4vw, 55px);

          line-height: 1.04;

          letter-spacing: -2px;

          font-weight: 600;
        }

        .lm-about-content h2 em {
          color: #6b8774;

          font-style: normal;
        }

        .lm-about-content p {
          max-width: 570px;

          color: #6d7871;

          font-size: 14px;

          line-height: 1.85;
        }

        .lm-about-content p.large {
          margin-top: 25px;

          color: #3f5045;

          font-size: 16px;
        }

        .lm-about-content
        .lm-primary-button {
          margin-top: 12px;
        }

        /* ================================================
           WHY LOOPMART
        ================================================ */

        .lm-why {
          padding: 88px 0;

          background: #f6f8f6;
        }

        .lm-centered-heading {
          max-width: 600px;

          margin: 0 auto 42px;

          text-align: center;
        }

        .lm-centered-heading h2 {
          margin: 0;

          color: var(--green-dark);

          font-size: 34px;

          line-height: 1.1;

          letter-spacing: -1.2px;
        }

        .lm-centered-heading p {
          margin: 13px 0 0;

          color: #77827b;

          font-size: 13px;
        }

        .lm-why-grid {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 18px;
        }

        .lm-why-card {
          padding: 30px;

          background: #ffffff;

          border: 1px solid var(--border);

          border-radius: 7px;

          transition: all 0.25s ease;
        }

        .lm-why-card:hover {
          transform: translateY(-4px);

          box-shadow:
            0 13px 30px rgba(24,51,37,0.07);
        }

        .lm-why-icon {
          width: 48px;
          height: 48px;

          display: flex;

          align-items: center;
          justify-content: center;

          margin-bottom: 18px;

          border-radius: 50%;

          background: #edf2ee;

          color: var(--green);

          font-size: 20px;

          font-weight: 700;
        }

        .lm-why-card h3 {
          margin: 0 0 9px;

          color: var(--green-dark);

          font-size: 15px;
        }

        .lm-why-card p {
          margin: 0;

          color: #758078;

          font-size: 12px;

          line-height: 1.7;
        }

        /* ================================================
           CONTACT
        ================================================ */

        .lm-contact {
          padding: 88px 0;

          background: #ffffff;
        }

        .lm-contact-box {
          padding: 48px 52px;

          display: grid;

          grid-template-columns:
            0.9fr 1.1fr;

          gap: 50px;

          align-items: center;

          background: #f0f4f0;

          border: 1px solid #dce5de;

          border-radius: 8px;
        }

        .lm-contact-intro h2 {
          margin: 0;

          color: var(--green-dark);

          font-size: 38px;

          letter-spacing: -1.5px;
        }

        .lm-contact-intro p {
          max-width: 410px;

          margin: 14px 0 0;

          color: #6f7b73;

          font-size: 13px;

          line-height: 1.75;
        }

        .lm-contact-details {
          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 11px;
        }

        .lm-contact-item {
          min-height: 126px;

          padding: 17px;

          display: flex;

          flex-direction: column;

          justify-content: space-between;

          background: #ffffff;

          border: 1px solid #dfe6e0;

          border-radius: 6px;

          transition: all 0.2s ease;
        }

        .lm-contact-item:hover {
          transform: translateY(-3px);

          border-color: #b4c5b9;

          box-shadow:
            0 10px 25px rgba(24,51,37,0.06);
        }

        .lm-contact-icon {
          width: 38px;
          height: 38px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #edf2ee;

          color: var(--green);

          font-size: 17px;
        }

        .lm-contact-item span {
          display: block;

          margin-bottom: 4px;

          color: #87918a;

          font-size: 8px;

          text-transform: uppercase;

          letter-spacing: 1px;
        }

        .lm-contact-item strong {
          display: block;

          color: var(--green-dark);

          font-size: 10px;

          line-height: 1.4;

          word-break: break-word;
        }

        /* ================================================
           FOOTER
        ================================================ */

        .lm-footer {
          padding: 62px 0 0;

          background: #173225;

          color: #ffffff;
        }

        .footer-loop-logo {
          color: #ffffff;
        }

        .footer-loop-logo > span {
          color: #ffffff;
        }

        .lm-footer-grid {
          display: grid;

          grid-template-columns:
            1.8fr 0.8fr 0.9fr 1.4fr;

          gap: 50px;

          padding-bottom: 50px;
        }

        .lm-footer-brand p {
          margin: 18px 0 0;

          color: rgba(255,255,255,0.53);

          font-size: 12px;

          line-height: 1.8;
        }

        .lm-footer-column {
          display: flex;

          flex-direction: column;

          gap: 10px;
        }

        .lm-footer-column h4 {
          margin: 0 0 7px;

          color: #ffffff;

          font-size: 10px;

          text-transform: uppercase;

          letter-spacing: 1.4px;
        }

        .lm-footer-column a {
          width: fit-content;

          color: rgba(255,255,255,0.57);

          font-size: 11px;

          transition: color 0.2s ease;
        }

        .lm-footer-column a:hover {
          color: #ffffff;
        }

        .lm-footer-bottom {
          min-height: 65px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          border-top:
            1px solid
            rgba(255,255,255,0.1);

          color: rgba(255,255,255,0.4);

          font-size: 10px;
        }

        .lm-footer-bottom div {
          display: flex;

          gap: 20px;
        }

        .lm-footer-bottom a:hover {
          color: #ffffff;
        }

        /* ================================================
           TABLET
        ================================================ */

        @media (max-width: 1200px) {

          .lm-nav-links {
            gap: 15px;

            margin-left: 0;
          }

          .lm-category-grid {
            grid-template-columns:
              repeat(5, 1fr);
          }

          .lm-product-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .lm-hero-inner {
            gap: 35px;
          }

        }

        /* ================================================
           TABLET / SMALL
        ================================================ */

        @media (max-width: 950px) {

          .lm-navbar-inner {
            gap: 16px;
          }

          .lm-nav-links {
            display: none;
          }

          .lm-hero-inner {
            grid-template-columns: 1fr;
          }

          .lm-hero-visual {
            height: 500px;
          }

          .lm-about-grid {
            grid-template-columns: 1fr;

            gap: 50px;
          }

          .lm-about-image-wrap {
            max-width: 680px;
          }

          .lm-why-grid {
            grid-template-columns: 1fr;
          }

          .lm-contact-box {
            grid-template-columns: 1fr;
          }

        }

        /* ================================================
           MOBILE
        ================================================ */

        @media (max-width: 700px) {

          .lm-container,
          .lm-hero-inner,
          .lm-hero-controls {
            width: calc(100% - 32px);
          }

          .lm-navbar-inner {
            width: calc(100% - 30px);

            padding:
              12px
              0;

            flex-wrap: wrap;
          }

          .lm-nav-search {
            order: 5;

            flex-basis: 100%;
          }

          .lm-nav-actions {
            margin-left: auto;
          }

          .lm-account {
            display: none;
          }

          .lm-hero {
            padding-top: 28px;
          }

          .lm-hero-content h1 {
            font-size: 45px;

            letter-spacing: -2px;
          }

          .lm-hero-content > p {
            font-size: 14px;
          }

          .lm-hero-visual {
            height: 420px;
          }

          .lm-section-heading {
            display: block;
          }

          .lm-section-heading h2 {
            font-size: 29px;
          }

          .lm-section-heading > p {
            margin-top: 10px;
          }

          .lm-category-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .lm-product-grid {
            grid-template-columns:
              repeat(2, 1fr);

            gap: 12px;
          }

          .lm-about {
            padding: 70px 0;
          }

          .lm-about-image {
            height: 390px;
          }

          .lm-contact {
            padding: 70px 0;
          }

          .lm-contact-box {
            padding: 35px 24px;
          }

          .lm-contact-details {
            grid-template-columns: 1fr;
          }

          .lm-contact-item {
            min-height: 88px;
          }

          .lm-footer-grid {
            grid-template-columns:
              repeat(2, 1fr);

            gap: 35px 25px;
          }

          .lm-footer-bottom {
            padding: 20px 0;

            align-items: flex-start;

            flex-direction: column;

            gap: 12px;
          }

        }

        /* ================================================
           SMALL MOBILE
        ================================================ */

        @media (max-width: 480px) {

          .loop-logo > span {
            font-size: 17px;
          }

          .loop-logo-icon {
            width: 38px;
          }

          .lm-nav-actions {
            gap: 11px;
          }

          .lm-hero-content h1 {
            font-size: 39px;
          }

          .lm-hero-buttons {
            flex-direction: column;
          }

          .lm-primary-button,
          .lm-outline-button {
            width: 100%;
          

          .lm-hero-visual {
            height: 350px;
          }

          .lm-category-card {
            min-height: 120px;
          }

          .lm-product-grid {
            grid-template-columns: 1fr;
          }

          .lm-about-image {
            height: 340px;
          }

          .lm-about-content h2 {
            font-size: 38px;
          }

          .lm-footer-grid {
            grid-template-columns: 1fr;
          }

        }

      `}</style>

    </div>
  );
}