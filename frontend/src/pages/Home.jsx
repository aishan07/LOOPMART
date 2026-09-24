import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Home.css";

const categories = [
  ["All", "", "grid"],
  ["Shoes", "Shoes", "shoe"],
  ["Clothes", "Clothing", "hanger"],
  ["Watches", "Watches", "watch"],
  ["Accessories", "Accessories", "bag"],
  ["Electronics", "Electronics", "laptop"],
  ["Furniture", "Furniture", "chair"],
  ["Books", "Books", "books"],
  ["Other", "Other", "dots"],
];

const collections = [
  [
    "Furniture",
    "Pieces with character.",
    "Furniture",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Fashion",
    "Style that keeps moving.",
    "Clothing",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Electronics",
    "Useful tech, better value.",
    "Electronics",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Watches",
    "Timeless pieces.",
    "Watches",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
  ],
  [
    "Books",
    "Stories worth passing on.",
    "Books",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
  ],
];

const slides = [
  [
    "PRE-LOVED • BETTER VALUE",
    "Great Things",
    "Live Again",
    "Discover quality second-hand pieces at prices that make sense.",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=85",
  ],
  [
    "WORK • STYLE • REUSE",
    "Find Your",
    "Next Favourite",
    "Unique finds, everyday essentials and things worth keeping.",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1800&q=85",
  ],
  [
    "SMART SHOPPING",
    "Good Finds",
    "Go Further",
    "Shop pre-loved products and give great things another life.",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85",
  ],
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const fetchProducts = async (c = category) => {
    setLoading(true);

    try {
      const { data } = await api.get("/products", {
        params: {
          category: c,
        },
      });

      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching products:", e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const chooseCategory = (value) => {
    setCategory(value);
    fetchProducts(value);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const s = slides[slide];

  return (
    <div className="loopmart-home">

      {/* ================= MOBILE 3-DOT MENU ================= */}

      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {menuOpen && (
        <>
          <div
            className="mobile-menu-backdrop"
            onClick={() => setMenuOpen(false)}
          ></div>

          <aside className="mobile-drawer">

            <div className="mobile-drawer-header">
              <div>
                <strong>Menu</strong>
                <small>LOOPMART</small>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
            </div>

            <div className="mobile-drawer-content">

              <div className="drawer-label">
                NAVIGATION
              </div>

              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
              >
                🏠 Home
              </Link>

              <button
                onClick={() => {
                  document
                    .getElementById("categories")
                    ?.scrollIntoView({ behavior: "smooth" });

                  setMenuOpen(false);
                }}
              >
                📂 Categories
              </button>

              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
              >
                🛒 Cart ({cart?.length || 0})
              </Link>

              {user && (
                <Link
                  to="/my-orders"
                  onClick={() => setMenuOpen(false)}
                >
                  📦 My Orders
                </Link>
              )}

              {user?.isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                >
                  ⚙️ Admin
                </Link>
              )}

              <div className="drawer-label">
                CATEGORIES
              </div>

              {categories.map(([name, value, icon]) => (
                <button
                  key={name}
                  className="drawer-category"
                  onClick={() => chooseCategory(value)}
                >
                  <span>
                    {Icon(icon)}
                  </span>

                  {name}
                </button>
              ))}

              <div className="drawer-divider"></div>

              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  🔐 Login
                </Link>
              ) : (
                <button
                  className="drawer-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}

            </div>
          </aside>
        </>
      )}

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-copy">

          <small>{s[0]}</small>

          <h1>
            {s[1]}
            <br />
            <em>{s[2]}</em>
          </h1>

          <p>
            {s[3]}
          </p>

          <div className="hero-buttons">

            <button onClick={() => chooseCategory("")}>
              Shop Now →
            </button>

            <a href="#categories">
              Explore categories
            </a>

          </div>

        </div>

        <div className="hero-image">

          <img
            src={s[4]}
            alt="LoopMart collection"
          />

          <button
            className="hero-prev"
            onClick={() =>
              setSlide(
                (slide - 1 + slides.length) % slides.length
              )
            }
          >
            ←
          </button>

          <button
            className="hero-next"
            onClick={() =>
              setSlide(
                (slide + 1) % slides.length
              )
            }
          >
            →
          </button>

          <label>
            {slide + 1} / {slides.length}
          </label>

        </div>

      </section>

      {/* ================= CATEGORIES ================= */}

      <section
        className="section categories"
        id="categories"
      >

        <Heading
          eyebrow="DISCOVER"
          title="Shop by Category"
        />

        <Row
          id="category-row"
          amount={320}
        >

          <div className="category-row">

            {categories.map(
              ([name, value, icon]) => (
                <button
                  className={
                    category === value
                      ? "selected"
                      : ""
                  }
                  key={name}
                  onClick={() =>
                    chooseCategory(value)
                  }
                >

                  <span>
                    {Icon(icon)}
                  </span>

                  {name}

                </button>
              )
            )}

          </div>

        </Row>

      </section>

      {/* ================= COLLECTIONS ================= */}

      <section className="section">

        <Heading
          eyebrow="CURATED FOR YOU"
          title="Explore Collections"
          text="A few good places to start."
        />

        <Row
          id="collection-row"
          amount={420}
        >

          <div className="collection-row">

            {collections.map(
              ([title, text, value, img]) => (

                <article
                  className="collection-card"
                  key={title}
                >

                  <img
                    src={img}
                    alt={title}
                  />

                  <div className="collection-info">

                    <div>

                      <h3>
                        {title}
                      </h3>

                      <p>
                        {text}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        chooseCategory(value)
                      }
                    >
                      Explore →
                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        </Row>

      </section>

      {/* ================= PRODUCTS ================= */}

      <section className="section products">

        <div className="heading-line">

          <Heading
            eyebrow="FRESH FINDS"
            title={category || "Just In"}
            text="Quality products, ready for their next chapter."
          />

          <button
            onClick={() =>
              chooseCategory("")
            }
          >
            View All →
          </button>

        </div>

        {loading ? (

          <div className="loading">
            Finding great pieces...
          </div>

        ) : products.length === 0 ? (

          <div className="empty">

            <h3>
              No items found
            </h3>

            <p>
              Try another category.
            </p>

            <button
              onClick={() =>
                chooseCategory("")
              }
            >
              Browse all products
            </button>

          </div>

        ) : (

          <Row
            id="product-row"
            amount={520}
          >

            <div className="product-row">

              {products.map((product, index) => (

                <div
                  className="product-slide"
                  key={product._id}
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                >

                  <ProductCard
                    product={product}
                  />

                </div>

              ))}

            </div>

          </Row>

        )}

      </section>

      {/* ================= SECOND LIFE ================= */}

      <section className="second-life">

        <img
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&q=85"
          alt="Styled interior"
        />

        <div>

          <small>
            THE LOOPMART IDEA
          </small>

          <h2>
            Give good things
            <br />
            <em>another life.</em>
          </h2>

          <p>
            Better value for you. Less waste for the
            world. Every purchase keeps useful things
            in circulation a little longer.
          </p>

          <a href="#categories">
            Explore LoopMart →
          </a>

        </div>

      </section>

      {/* ================= WHY ================= */}

      <section className="section why">

        <Heading
          eyebrow="THE LOOPMART DIFFERENCE"
          title="Why shop pre-loved?"
        />

        <div className="why-grid">

          <article>
            <b>♻</b>

            <h3>
              Less Waste
            </h3>

            <p>
              Keep useful products in circulation
              for longer.
            </p>
          </article>

          <article>
            <b>✓</b>

            <h3>
              Better Value
            </h3>

            <p>
              Find quality pieces without paying
              full retail price.
            </p>
          </article>

          <article>
            <b>◎</b>

            <h3>
              Unique Finds
            </h3>

            <p>
              Discover products that are not always
              easy to find new.
            </p>
          </article>

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section className="about">

        <div>

          <small>
            ABOUT LOOPMART
          </small>

          <h2>
            Second-hand, redefined.
          </h2>

        </div>

        <div>

          <p>
            LoopMart is a marketplace for people
            who want great products, sensible prices
            and a more circular way to shop.
          </p>

          <a href="#contact">
            Learn more about us →
          </a>

        </div>

      </section>

      {/* ================= CONTACT ================= */}

      <section
        className="contact"
        id="contact"
      >

        <div>

          <small>
            NEED HELP?
          </small>

          <h2>
            We’re here for you.
          </h2>

        </div>

        <div>

          <a href="mailto:loopmart.admin@gmail.com">
            loopmart.admin@gmail.com
          </a>

          <p>
            <a href="tel:+919769351949">
              +91 97693 51949
            </a>

            <span> • </span>

            <a href="tel:+919076116989">
              +91 90761 16989
            </a>
          </p>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer>

        <div>

          <div className="footer-text-logo">
            LoopMart
          </div>

          <p>
            Keep things in loop.
          </p>

        </div>

        <nav>

          <Link to="/">
            Shop
          </Link>

          <a href="#categories">
            Categories
          </a>

          {user && (
            <Link to="/my-orders">
              My Orders
            </Link>
          )}

          <Link to="/cart">
            Cart
          </Link>

          {user?.isAdmin && (
            <Link to="/admin">
              Admin
            </Link>
          )}

        </nav>

        <div className="copyright">
          © {new Date().getFullYear()} LoopMart.
          All rights reserved.
        </div>

      </footer>

    </div>
  );
}


/* ================= ROW ================= */

function Row({ id, amount, children }) {

  return (
    <div className="row-shell">

      <button
        className="row-arrow"
        onClick={() =>
          document
            .getElementById(id)
            ?.scrollBy({
              left: -amount,
              behavior: "smooth",
            })
        }
      >
        ←
      </button>

      {children}

      <button
        className="row-arrow"
        onClick={() =>
          document
            .getElementById(id)
            ?.scrollBy({
              left: amount,
              behavior: "smooth",
            })
        }
      >
        →
      </button>

    </div>
  );
}


/* ================= HEADING ================= */

function Heading({
  eyebrow,
  title,
  text,
}) {

  return (
    <div className="heading">

      <small>
        {eyebrow}
      </small>

      <h2>
        {title}
      </h2>

      {text && (
        <p>
          {text}
        </p>
      )}

    </div>
  );
}


/* ================= LOGO ICONS ================= */

function Icon(type) {

  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
  };

  const icons = {

    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" />
        <rect x="14" y="4" width="6" height="6" />
        <rect x="4" y="14" width="6" height="6" />
        <rect x="14" y="14" width="6" height="6" />
      </>
    ),

    shoe: (
      <path d="M4 15c4 .5 6-1 8-4l2-3 2 3c1 1 2 2 4 2v5H4z" />
    ),

    hanger: (
      <>
        <path d="M12 7c-2 0-2-4 0-4 2 0 2 2 1 3" />
        <path d="M13 7 4 14h16z" />
      </>
    ),

    watch: (
      <>
        <rect x="7" y="8" width="10" height="8" rx="3" />
        <path d="M9 4h6l1 4M8 16l1 4h6l1-4M12 10v3l2 1" />
      </>
    ),

    bag: (
      <>
        <path d="M5 8h14l-1 12H6z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),

    laptop: (
      <>
        <rect x="5" y="5" width="14" height="10" />
        <path d="M3 18h18" />
      </>
    ),

    chair: (
      <>
        <path d="M6 13V7c0-1 .9-2 2-2h8c1 0 2 1 2 2v6" />
        <path d="M4 13h16v3H4M6 16v4M18 16v4" />
      </>
    ),

    books: (
      <path d="M5 5h13v3H5zM4 9h15v3H4zM5 13h13v3H5zM4 17h16v3H4z" />
    ),

    dots: (
      <>
        <circle
          cx="6"
          cy="12"
          r="1"
          fill="currentColor"
        />
        <circle
          cx="12"
          cy="12"
          r="1"
          fill="currentColor"
        />
        <circle
          cx="18"
          cy="12"
          r="1"
          fill="currentColor"
        />
      </>
    ),
  };

  return (
    <svg {...props}>
      {icons[type]}
    </svg>
  );
}