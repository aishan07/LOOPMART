import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./Home.css";

const categories = [
  { name: "All", value: "", icon: "grid" },
  { name: "Shoes", value: "Shoes", icon: "shoe" },
  { name: "Clothes", value: "Clothing", icon: "hanger" },
  { name: "Watches", value: "Watches", icon: "watch" },
  { name: "Accessories", value: "Accessories", icon: "bag" },
  { name: "Electronics", value: "Electronics", icon: "laptop" },
  { name: "Furniture", value: "Furniture", icon: "chair" },
  { name: "Books", value: "Books", icon: "books" },
  { name: "Other", value: "Other", icon: "dots" },
];

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "PRE-LOVED • BETTER VALUE",
    title: "Great Things",
    accent: "Live Again",
    text: "Discover quality second-hand pieces at prices that make sense.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "WORK • STYLE • REUSE",
    title: "Find Your",
    accent: "Next Favourite",
    text: "Unique finds, everyday essentials and things worth keeping.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",
    eyebrow: "SMART SHOPPING",
    title: "Good Finds",
    accent: "Go Further",
    text: "Shop pre-loved products and give great things another life.",
  },
];

const collections = [
  {
    title: "Furniture",
    text: "Pieces with character.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    category: "Furniture",
  },
  {
    title: "Fashion",
    text: "Style that keeps moving.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    category: "Clothing",
  },
  {
    title: "Electronics",
    text: "Useful tech, better value.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
  },
  {
    title: "Watches",
    text: "Timeless pieces.",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
    category: "Watches",
  },
  {
    title: "Books",
    text: "Stories worth passing on.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
    category: "Books",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search, category);
    scrollToProducts();
  };

  // Selecting a category now takes you straight to a full results
  // list (scrolls down + switches the products section to a grid)
  // instead of just nudging the small "Just In" carousel.
  const handleCategory = (value) => {
    setCategory(value);
    fetchProducts(search, value);
    scrollToProducts();
  };

  const scrollToProducts = () => {
    // slight delay so it runs after the click/close animations settle
    setTimeout(() => {
      document
        .getElementById("products-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const nextHero = () => {
    setHeroIndex((current) => (current + 1) % heroSlides.length);
  };

  const previousHero = () => {
    setHeroIndex(
      (current) => (current - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const currentHero = heroSlides[heroIndex];
  const isFiltered = category !== "" || search !== "";

  return (
    <div className="loopmart-home">
      {/* ================= HEADER ================= */}

      <header className="loop-navbar">
        <div className="navbar-inner">
          <a href="/" className="loop-logo">
            <svg className="loop-logo-icon" viewBox="0 0 64 40" fill="none">
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

          <nav className="main-nav">
            <a href="/">Shop</a>
            <a href="#categories">Categories</a>
            <a href="/orders">My Orders</a>
          </nav>

          <form className="nav-search" onSubmit={handleSearch}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search products, brands, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="nav-actions">
            <a href="/wishlist">
              <HeartIcon />
              <span>Wishlist</span>
            </a>

            <a href="/cart" className="cart-button">
              <CartIcon />
              <b>0</b>
            </a>

            <a href="/login">
              <UserIcon />
              <span>Account</span>
            </a>
          </div>

          <button
            className="mobile-menu-button"
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <form className="mobile-search" onSubmit={handleSearch}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </header>

      {/* ================= MOBILE DRAWER ================= */}

      {mobileMenuOpen && (
        <>
          <div
            className="mobile-menu-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="mobile-drawer">
            <div className="mobile-drawer-header">
              <div>
                <strong>LoopMart</strong>
                <small>MENU</small>
              </div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                ×
              </button>
            </div>

            <div className="mobile-drawer-content">
              <a href="/" onClick={() => setMobileMenuOpen(false)}>Shop</a>
              <a href="/my-orders" onClick={() => setMobileMenuOpen(false)}>My Orders</a>
              <a href="/wishlist" onClick={() => setMobileMenuOpen(false)}>Wishlist</a>
              <a href="/cart" onClick={() => setMobileMenuOpen(false)}>Cart</a>
              <a href="/login" onClick={() => setMobileMenuOpen(false)}>Account</a>

              <div className="drawer-label">Categories</div>
              {categories.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="drawer-category"
                  onClick={() => {
                    handleCategory(item.value);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span>{renderCategoryIcon(item.icon)}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ================= HERO ================= */}

      <section className="hero">
        <div className="hero-copy">
          <small>{currentHero.eyebrow}</small>
          <h1>
            {currentHero.title}
            <br />
            <em>{currentHero.accent}</em>
          </h1>
          <p>{currentHero.text}</p>
          <div>
            <button onClick={() => handleCategory("")} type="button">
              SHOP NOW →
            </button>
            <a href="#categories">Explore categories</a>
          </div>
        </div>

        <div className="hero-image">
          <img src={currentHero.image} alt={currentHero.title} />
          <button type="button" onClick={previousHero} aria-label="Previous slide">
            ←
          </button>
          <button type="button" onClick={nextHero} aria-label="Next slide">
            →
          </button>
          <label>
            {String(heroIndex + 1).padStart(2, "0")} /{" "}
            {String(heroSlides.length).padStart(2, "0")}
          </label>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}

      <section className="section" id="categories">
        <div className="heading">
          <small>DISCOVER</small>
          <h2>Shop by Category</h2>
          <p>Find something that fits your style.</p>
        </div>

        <div className="row-shell">
          <button className="row-arrow" onClick={() => scrollRow("category-row", -350)}>
            ←
          </button>

          <div className="category-row" id="category-row">
            {categories.map((item) => (
              <button
                key={item.name}
                className={category === item.value ? "selected" : ""}
                onClick={() => handleCategory(item.value)}
                type="button"
              >
                <span>{renderCategoryIcon(item.icon)}</span>
                {item.name}
              </button>
            ))}
          </div>

          <button className="row-arrow" onClick={() => scrollRow("category-row", 350)}>
            →
          </button>
        </div>
      </section>

      {/* ================= COLLECTIONS ================= */}

      <section className="section">
        <div className="heading">
          <small>CURATED FOR YOU</small>
          <h2>Explore Collections</h2>
          <p>A few good places to start.</p>
        </div>

        <div className="row-shell">
          <button className="row-arrow" onClick={() => scrollRow("collection-row", -430)}>
            ←
          </button>

          <div className="collection-row" id="collection-row">
            {collections.map((item) => (
              <article key={item.title}>
                <img src={item.image} alt={item.title} />
                <div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <button onClick={() => handleCategory(item.category)} type="button">
                    Explore →
                  </button>
                </div>
              </article>
            ))}
          </div>

          <button className="row-arrow" onClick={() => scrollRow("collection-row", 430)}>
            →
          </button>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}

      <section className="section products" id="products-section">
        <div className="heading-line">
          <div className="heading">
            <small>{isFiltered ? "RESULTS" : "FRESH FINDS"}</small>
            <h2>{category || (search ? `Results for "${search}"` : "Just In")}</h2>
            <p>Quality products ready for their next chapter.</p>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                handleCategory("");
              }}
            >
              Clear filters ×
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Finding great pieces...</div>
        ) : products.length === 0 ? (
          <div className="empty">
            <h3>No items found</h3>
            <p>Try another search or category.</p>
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
        ) : isFiltered ? (
          // Full grid — a real "shop list" once a category/search is active
          <div className="products-grid">
            {products.map((product, index) => (
              <div
                className="product-slide"
                key={product._id}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          // Default homepage teaser row
          <div className="row-shell">
            <button className="row-arrow" onClick={() => scrollRow("product-row", -500)}>
              ←
            </button>

            <div className="product-row" id="product-row">
              {products.map((product, index) => (
                <div
                  className="product-slide"
                  key={product._id}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <button className="row-arrow" onClick={() => scrollRow("product-row", 500)}>
              →
            </button>
          </div>
        )}
      </section>

      {/* ================= SECOND LIFE ================= */}

      <section className="second-life">
        <img
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&q=85"
          alt="Beautiful interior"
        />
        <div>
          <small>THE LOOPMART IDEA</small>
          <h2>
            Give good things
            <br />
            <em>another life.</em>
          </h2>
          <p>
            Better value for you. Less waste for the world. Every purchase
            keeps useful things in circulation a little longer.
          </p>
          <a href="#categories">Explore LoopMart →</a>
        </div>
      </section>

      {/* ================= WHY LOOPMART ================= */}

      <section className="section why">
        <div className="heading">
          <small>THE LOOPMART DIFFERENCE</small>
          <h2>Why shop pre-loved?</h2>
        </div>

        <div className="why-grid">
          <article>
            <b>♻</b>
            <h3>Less Waste</h3>
            <p>Keep useful products in circulation for longer.</p>
          </article>
          <article>
            <b>✓</b>
            <h3>Better Value</h3>
            <p>Find quality pieces without paying full retail.</p>
          </article>
          <article>
            <b>◎</b>
            <h3>Unique Finds</h3>
            <p>Discover products that are not always easy to find.</p>
          </article>
        </div>
      </section>

      {/* ================= ABOUT ================= */}

      <section className="about">
        <div>
          <small>ABOUT LOOPMART</small>
          <h2>
            Second-hand,
            <br />
            redefined.
          </h2>
        </div>
        <div>
          <p>
            LoopMart is a marketplace for people who want great products,
            sensible prices and a more circular way to shop.
          </p>
          <a href="#contact">Learn more about us →</a>
        </div>
      </section>

      {/* ================= CONTACT ================= */}

      <section className="contact" id="contact">
        <div>
          <small>NEED HELP?</small>
          <h2>
            We're here
            <br />
            for you.
          </h2>
        </div>
        <div>
          <a href="mailto:loopmart.admin@gmail.com">loopmart.admin@gmail.com</a>
          <p>
            <a href="tel:+919769351949">+91 97693 51949</a>
            <span> • </span>
            <a href="tel:+919076116989">+91 90761 16989</a>
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer>
        <div>
          <a href="/" className="footer-logo">
            <svg className="loop-logo-icon" viewBox="0 0 64 40" fill="none">
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
          <p>Keep things in loop.</p>
        </div>

        <nav>
          <a href="/">Shop</a>
          <a href="#categories">Categories</a>
          <a href="/orders">My Orders</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/cart">Cart</a>
        </nav>

        <div className="copyright">
          © {new Date().getFullYear()} LoopMart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* ================= HELPERS ================= */

function scrollRow(id, amount) {
  document.getElementById(id)?.scrollBy({ left: amount, behavior: "smooth" });
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M20.8 8.8C20.8 13.7 12 19 12 19S3.2 13.7 3.2 8.8C3.2 5.9 5.4 4 8 4C9.7 4 11.2 4.8 12 6.1C12.8 4.8 14.3 4 16 4C18.6 4 20.8 5.9 20.8 8.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CartIcon() {
  return (
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
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5 21C5.5 16.8 8.1 14.5 12 14.5C15.9 14.5 18.5 16.8 19 21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
    case "shoe":
      return (
        <svg {...common}>
          <path d="M4 15c3.5.4 6.2-.7 8.2-3.4l2-3.1 2.1 2.2c1.1 1.1 2.3 1.8 3.7 2.2v4.6H4V15Z" />
          <path d="M12 11.5c-1.5.5-2.7.3-4-.3" />
        </svg>
      );
    case "hanger":
      return (
        <svg {...common}>
          <path d="M12 5c0-1.1.9-2 2-2s2 .9 2 2c0 1.2-1 2-2 2" />
          <path d="M14 7 4 14h16L14 7Z" />
        </svg>
      );
    case "watch":
      return (
        <svg {...common}>
          <path d="M9 4h6l1 4H8l1-4Z" />
          <rect x="7" y="8" width="10" height="8" rx="3" />
          <path d="M8 16h8l-1 4H9l-1-4Z" />
          <path d="M12 10v3l2 1" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M5 8h14l-1 12H6L5 8Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
        </svg>
      );
    case "laptop":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="10" rx="1" />
          <path d="M3 18h18" />
        </svg>
      );
    case "chair":
      return (
        <svg {...common}>
          <path d="M6 13V7c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v6" />
          <path d="M4 13h16v3H4zM6 16v4M18 16v4" />
        </svg>
      );
    case "books":
      return (
        <svg {...common}>
          <path d="M5 5h13v3H5zM4 9h15v3H4zM5 13h13v3H5zM4 17h16v3H4z" />
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