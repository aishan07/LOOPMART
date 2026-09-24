import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
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
    "Shoes",
    "Find your next pair.",
    "Shoes",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
  ],
  [
    "Clothes",
    "Style that keeps moving.",
    "Clothing",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=85",
  ],
  [
    "Watches",
    "Timeless pieces.",
    "Watches",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=85",
  ],
  [
    "Accessories",
    "The details matter.",
    "Accessories",
    "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=1000&q=85",
  ],
  [
    "Electronics",
    "Useful tech, better value.",
    "Electronics",
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1000&q=85",
  ],
  [
    "Furniture",
    "Pieces with character.",
    "Furniture",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=85",
  ],
  [
    "Books",
    "Stories worth passing on.",
    "Books",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1000&q=85",
  ],
  [
    "Other",
    "Something unexpected.",
    "Other",
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1000&q=85",
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchProducts = async (s = search, c = category) => {
    setLoading(true);

    try {
      const { data } = await api.get("/products", {
        params: {
          search: s,
          category: c,
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
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const searchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(search, category);
  };

  /*
    This is the important new function.

    Clicking a category:
    1. Changes the product filter.
    2. Fetches matching products.
    3. Automatically scrolls to that category's collection.
  */
  const chooseCategory = (value) => {
    setCategory(value);
    fetchProducts(search, value);

    setTimeout(() => {
      if (!value) {
        document.getElementById("collections")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      const collectionId = `collection-${value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/&/g, "and")}`;

      const collection = document.getElementById(collectionId);

      if (collection) {
        collection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        document.getElementById("collections")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 120);
  };

  const scrollRow = (id, amount) => {
    document.getElementById(id)?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  const mobileGoTo = (id) => {
    setMobileMenuOpen(false);

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const s = slides[slide];

  return (
    <div className="loopmart-home">

      {/* ================= NAVBAR ================= */}

      <header className="loop-navbar">
        <div className="navbar-inner">

          <a href="/" className="loop-logo">
            <Logo />
            <span>LoopMart</span>
          </a>

          <nav className="main-nav">
            <a href="/">Shop</a>
            <a href="#categories">Categories</a>
            <a href="/orders">My Orders</a>
          </nav>

          <form className="nav-search" onSubmit={searchSubmit}>
            <Search />

            <input
              type="text"
              placeholder="Search products, brands, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="nav-actions">

            <a href="/wishlist" className="nav-action">
              <HeartIcon />
              <span>Wishlist</span>
            </a>

            <a href="/cart" className="cart-button">
              <CartIcon />
              <b>0</b>
            </a>

            <a href="/login" className="nav-action">
              <UserIcon />
              <span>Account</span>
            </a>

          </div>

          {/* MOBILE MENU BUTTON */}

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

        {/* MOBILE SEARCH */}

        <form className="mobile-search" onSubmit={searchSubmit}>
          <Search />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </header>


      {/* ================= HERO ================= */}

      <section className="hero" id="hero">

        <div className="hero-copy">

          <small>{s[0]}</small>

          <h1>
            {s[1]}
            <br />
            <em>{s[2]}</em>
          </h1>

          <p>{s[3]}</p>

          <div className="hero-buttons">

            <button onClick={() => chooseCategory("")}>
              SHOP NOW →
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
                (slide - 1 + slides.length) %
                  slides.length
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
            {String(slide + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
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
          text="Find something that fits your style."
        />

        <Row
          id="category-row"
          amount={320}
        >

          <div className="category-row">

            {categories.map(
              ([name, value, icon]) => (

                <button
                  key={name}
                  className={
                    category === value
                      ? "selected"
                      : ""
                  }
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

      <section
        className="section collections-section"
        id="collections"
      >

        <Heading
          eyebrow="CURATED FOR YOU"
          title="Explore Collections"
          text="Choose a category and jump directly to what you want."
        />

        <Row
          id="collection-row"
          amount={420}
        >

          <div className="collection-row">

            {collections.map(
              ([title, text, value, img]) => {

                const collectionId =
                  `collection-${value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/&/g, "and")}`;

                return (
                  <article
                    key={title}
                    id={collectionId}
                    className="collection-card"
                  >

                    <img
                      src={img}
                      alt={title}
                    />

                    <div className="collection-info">

                      <div>
                        <h3>{title}</h3>
                        <p>{text}</p>
                      </div>

                      <button
                        onClick={() => {
                          setCategory(value);
                          fetchProducts(
                            search,
                            value
                          );

                          setTimeout(() => {
                            document
                              .getElementById(
                                "products"
                              )
                              ?.scrollIntoView({
                                behavior:
                                  "smooth",
                                block: "start",
                              });
                          }, 150);
                        }}
                      >
                        Explore →
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        </Row>

      </section>


      {/* ================= PRODUCTS ================= */}

      <section
        className="section products"
        id="products"
      >

        <div className="heading-line">

          <Heading
            eyebrow="FRESH FINDS"
            title={category || "Just In"}
            text="Quality products, ready for their next chapter."
          />

          <button
            onClick={() => {
              setSearch("");
              chooseCategory("");
            }}
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

            <h3>No items found</h3>

            <p>
              Try another search or category.
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
                    animationDelay:
                      `${index * 60}ms`,
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
            Better value for you. Less waste for
            the world. Every purchase keeps useful
            things in circulation a little longer.
          </p>

          <a href="#categories">
            Explore LoopMart →
          </a>

        </div>

      </section>


      {/* ================= WHY LOOPMART ================= */}

      <section className="section why">

        <Heading
          eyebrow="THE LOOPMART DIFFERENCE"
          title="Why shop pre-loved?"
        />

        <div className="why-grid">

          <article>
            <b>♻</b>
            <h3>Less Waste</h3>
            <p>
              Keep useful products in
              circulation for longer.
            </p>
          </article>

          <article>
            <b>✓</b>
            <h3>Better Value</h3>
            <p>
              Find quality pieces without
              paying full retail price.
            </p>
          </article>

          <article>
            <b>◎</b>
            <h3>Unique Finds</h3>
            <p>
              Discover products that are
              not always easy to find new.
            </p>
          </article>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section
        className="about"
        id="about"
      >

        <div>

          <small>
            ABOUT LOOPMART
          </small>

          <h2>
            Second-hand,
            <br />
            redefined.
          </h2>

        </div>

        <div>

          <p>
            LoopMart is a marketplace for people
            who want great products, sensible
            prices and a more circular way to shop.
            We make it easier to discover useful
            second-hand products and give them
            another life.
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
            We're here for you.
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

          <a
            className="footer-logo"
            href="/"
          >
            <Logo />
            <span>LoopMart</span>
          </a>

          <p>
            Keep things in the loop.
          </p>

        </div>

        <nav>

          <a href="/">Shop</a>
          <a href="#categories">Categories</a>
          <a href="/orders">My Orders</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/cart">Cart</a>

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

        <div className="copyright">
          © {new Date().getFullYear()} LoopMart.
          All rights reserved.
        </div>

      </footer>


      {/* ================= MOBILE SIDE MENU ================= */}

      {mobileMenuOpen && (
        <>

          <div
            className="mobile-menu-backdrop"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />

          <aside className="mobile-drawer">

            <div className="mobile-drawer-header">

              <div>
                <strong>LoopMart</strong>
                <small>
                  SECOND-LIFE MARKET
                </small>
              </div>

              <button
                onClick={() =>
                  setMobileMenuOpen(false)
                }
              >
                ×
              </button>

            </div>


            <div className="mobile-drawer-content">

              <button
                onClick={() =>
                  mobileGoTo("hero")
                }
              >
                Shop
              </button>

              <button
                onClick={() =>
                  mobileGoTo("categories")
                }
              >
                Categories
              </button>


              <div className="drawer-label">
                SHOP BY CATEGORY
              </div>


              {categories
                .filter(
                  ([, value]) => value
                )
                .map(
                  ([name, value, icon]) => (

                    <button
                      key={name}
                      className="drawer-category"
                      onClick={() => {
                        setMobileMenuOpen(
                          false
                        );
                        chooseCategory(
                          value
                        );
                      }}
                    >

                      <span>
                        {Icon(icon)}
                      </span>

                      {name}

                    </button>

                  )
                )}


              <div className="drawer-divider" />


              <button
                onClick={() =>
                  mobileGoTo("about")
                }
              >
                About Us
              </button>

              <button
                onClick={() =>
                  mobileGoTo("contact")
                }
              >
                Contact Us
              </button>

              <a href="/orders">
                My Orders
              </a>

              <a href="/wishlist">
                Wishlist
              </a>

              <a href="/cart">
                Cart
              </a>

              <a href="/admin">
                Admin
              </a>

              <a href="/login">
                Account
              </a>

              <button className="drawer-logout">
                Logout
              </button>

            </div>

          </aside>

        </>
      )}

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

      <small>{eyebrow}</small>

      <h2>{title}</h2>

      {text && <p>{text}</p>}

    </div>
  );
}


/* ================= SEARCH ICON ================= */

function Search() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M16 16L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}


/* ================= HEART ================= */

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20.8 8.8C20.8 13.7 12 19 12 19S3.2 13.7 3.2 8.8C3.2 5.9 5.4 4 8 4C9.7 4 11.2 4.8 12 6.1C12.8 4.8 14.3 4 16 4C18.6 4 20.8 5.9 20.8 8.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}


/* ================= CART ================= */

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >
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
  );
}


/* ================= USER ================= */

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
    >
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
  );
}


/* ================= LOGO ================= */

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


/* ================= CATEGORY ICONS ================= */

function Icon(type) {

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
          <path d="M4 15C8 15.5 10 13.5 12 10L14 7L16 10C17 11.5 18 12 20 12V19H4Z" />
        </svg>
      );

    case "hanger":
      return (
        <svg {...common}>
          <path d="M12 7C10 7 10 3 12 3C14 3 14 5 13 6" />
          <path d="M13 7L4 14H20Z" />
        </svg>
      );

    case "watch":
      return (
        <svg {...common}>
          <rect x="7" y="8" width="10" height="8" rx="3" />
          <path d="M9 4H15L16 8" />
          <path d="M8 16L9 20H15L16 16" />
          <path d="M12 10V13L14 14" />
        </svg>
      );

    case "bag":
      return (
        <svg {...common}>
          <path d="M5 8H19L18 20H6Z" />
          <path d="M9 8V6C9 4.3 10.3 3 12 3C13.7 3 15 4.3 15 6V8" />
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

    case "books":
      return (
        <svg {...common}>
          <path d="M5 5H18V8H5Z" />
          <path d="M4 9H19V12H4Z" />
          <path d="M5 13H18V16H5Z" />
          <path d="M4 17H20V20H4Z" />
        </svg>
      );

    case "dots":
      return (
        <svg {...common}>
          <circle cx="6" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="18" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );

    default:
      return null;
  }
}