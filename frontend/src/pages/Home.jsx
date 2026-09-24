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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  const fetchProducts = async (
    searchValue = search,
    categoryValue = category
  ) => {
    setLoading(true);

    try {
      const { data } = await api.get("/products", {
        params: {
          search: searchValue,
          category: categoryValue,
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

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchProducts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =====================================================
     HERO SLIDER
  ===================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  /* =====================================================
     SCROLL TO PRODUCTS
  ===================================================== */

  const scrollToProducts = () => {
    setTimeout(() => {
      const productSection =
        document.getElementById("product-listing");

      if (productSection) {
        productSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  };

  /* =====================================================
     SCROLL TO CATEGORIES
  ===================================================== */

  const scrollToCategories = () => {
    const categorySection =
      document.getElementById("categories");

    if (categorySection) {
      categorySection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const searchSubmit = (event) => {
    event.preventDefault();

    fetchProducts(search, category);

    scrollToProducts();
  };

  /* =====================================================
     CATEGORY SELECT
  ===================================================== */

  const chooseCategory = (selectedCategory) => {
    setCategory(selectedCategory);

    fetchProducts(search, selectedCategory);

    scrollToProducts();
  };

  /* =====================================================
     SHOP NOW
  ===================================================== */

  const handleShopNow = () => {
    setSearch("");
    setCategory("");

    fetchProducts("", "");

    scrollToProducts();
  };

  /* =====================================================
     VIEW ALL
  ===================================================== */

  const handleViewAll = () => {
    setSearch("");
    setCategory("");

    fetchProducts("", "");

    scrollToProducts();
  };

  /* =====================================================
     HORIZONTAL ROW SCROLL
  ===================================================== */

  const scrollRow = (id, amount) => {
    document
      .getElementById(id)
      ?.scrollBy({
        left: amount,
        behavior: "smooth",
      });
  };

  const currentSlide = slides[slide];

  return (
    <div className="loopmart-home">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-copy">

          <small>
            {currentSlide[0]}
          </small>

          <h1>
            {currentSlide[1]}
            <br />
            <em>
              {currentSlide[2]}
            </em>
          </h1>

          <p>
            {currentSlide[3]}
          </p>

          <div>

            {/* SHOP NOW */}

            <button
              onClick={handleShopNow}
            >
              Shop Now →
            </button>

            {/* EXPLORE CATEGORIES */}

            <button
              type="button"
              className="hero-category-link"
              onClick={scrollToCategories}
            >
              Explore categories
            </button>

          </div>

        </div>

        {/* HERO IMAGE */}

        <div className="hero-image">

          <img
            src={currentSlide[4]}
            alt="LoopMart collection"
          />

          {/* PREVIOUS */}

          <button
            type="button"
            onClick={() =>
              setSlide(
                (slide - 1 + slides.length) %
                  slides.length
              )
            }
          >
            ←
          </button>

          {/* NEXT */}

          <button
            type="button"
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


      {/* =================================================
          CATEGORIES
      ================================================= */}

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
                  key={name}
                  type="button"
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


      {/* =================================================
          COLLECTIONS
      ================================================= */}

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
              ([title, text, value, image]) => (

                <article key={title}>

                  <img
                    src={image}
                    alt={title}
                  />

                  <div>

                    <div>

                      <h3>
                        {title}
                      </h3>

                      <p>
                        {text}
                      </p>

                    </div>

                    <button
                      type="button"
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


      {/* =================================================
          PRODUCT LISTING
      ================================================= */}

      <section
        className="section products"
        id="product-listing"
      >

        <div className="heading-line">

          <Heading
            eyebrow="FRESH FINDS"
            title={
              category || "Just In"
            }
            text="Quality products, ready for their next chapter."
          />

          <button
            type="button"
            onClick={handleViewAll}
          >
            View All →
          </button>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="loading">
            Finding great pieces...
          </div>

        ) : products.length === 0 ? (

          /* NO PRODUCTS */

          <div className="empty">

            <h3>
              No items found
            </h3>

            <p>
              Try another search or category.
            </p>

            <button
              type="button"
              onClick={handleViewAll}
            >
              Browse all products
            </button>

          </div>

        ) : (

          /* PRODUCTS */

          <Row
            id="product-row"
            amount={520}
          >

            <div className="product-row">

              {products.map(
                (product, index) => (

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

                )
              )}

            </div>

          </Row>

        )}

      </section>


      {/* =================================================
          SECOND LIFE
      ================================================= */}

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
            <em>
              another life.
            </em>
          </h2>

          <p>
            Better value for you. Less waste
            for the world. Every purchase keeps
            useful things in circulation a little longer.
          </p>

          <button
            type="button"
            className="second-life-link"
            onClick={scrollToCategories}
          >
            Explore LoopMart →
          </button>

        </div>

      </section>


      {/* =================================================
          WHY LOOPMART
      ================================================= */}

      <section className="section why">

        <Heading
          eyebrow="THE LOOPMART DIFFERENCE"
          title="Why shop pre-loved?"
        />

        <div className="why-grid">

          <article>

            <b>
              ♻
            </b>

            <h3>
              Less Waste
            </h3>

            <p>
              Keep useful products in
              circulation for longer.
            </p>

          </article>


          <article>

            <b>
              ✓
            </b>

            <h3>
              Better Value
            </h3>

            <p>
              Find quality pieces without
              paying full retail price.
            </p>

          </article>


          <article>

            <b>
              ◎
            </b>

            <h3>
              Unique Finds
            </h3>

            <p>
              Discover products that are
              not always easy to find new.
            </p>

          </article>

        </div>

      </section>


      {/* =================================================
          ABOUT
      ================================================= */}

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


      {/* =================================================
          CONTACT
      ================================================= */}

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

          <a
            href="mailto:loopmart.admin@gmail.com"
          >
            loopmart.admin@gmail.com
          </a>

          <p>

            <a href="tel:+919769351949">
              +91 97693 51949
            </a>

            <span>
              {" "}•{" "}
            </span>

            <a href="tel:+919076116989">
              +91 90761 16989
            </a>

          </p>

        </div>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>

        <div>

          <a
            className="footer-logo"
            href="/"
          >

            <Logo />

            <span>
              LoopMart
            </span>

          </a>

          <p>
            Keep things in loop.
          </p>

        </div>


        <nav>

          <a href="/">
            Shop
          </a>

          <button
            type="button"
            onClick={scrollToCategories}
          >
            Categories
          </button>

          <a href="/my-orders">
            My Orders
          </a>

          <a href="/wishlist">
            Wishlist
          </a>

          <a href="/cart">
            Cart
          </a>

        </nav>


        <div className="copyright">

          © {new Date().getFullYear()}
          {" "}LoopMart. All rights reserved.

        </div>

      </footer>

    </div>
  );
}


/* =====================================================
   HORIZONTAL ROW
===================================================== */

function Row({
  id,
  amount,
  children,
}) {
  return (
    <div className="row-shell">

      <button
        type="button"
        className="row-arrow"
        onClick={() =>
          scrollRowElement(id, -amount)
        }
        aria-label="Scroll left"
      >
        ←
      </button>

      {children}

      <button
        type="button"
        className="row-arrow"
        onClick={() =>
          scrollRowElement(id, amount)
        }
        aria-label="Scroll right"
      >
        →
      </button>

    </div>
  );
}


/* =====================================================
   ROW SCROLL HELPER
===================================================== */

function scrollRowElement(id, amount) {
  const element =
    document.getElementById(id);

  if (!element) return;

  element.scrollBy({
    left: amount,
    behavior: "smooth",
  });
}


/* =====================================================
   HEADING
===================================================== */

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


/* =====================================================
   SEARCH ICON
===================================================== */

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
        d="M16 16l5 5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

    </svg>
  );
}


/* =====================================================
   LOOPMART LOGO
===================================================== */

function Logo() {
  return (
    <svg
      className="loop-logo-icon"
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


/* =====================================================
   CATEGORY ICONS
===================================================== */

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
        <rect
          x="4"
          y="4"
          width="6"
          height="6"
        />

        <rect
          x="14"
          y="4"
          width="6"
          height="6"
        />

        <rect
          x="4"
          y="14"
          width="6"
          height="6"
        />

        <rect
          x="14"
          y="14"
          width="6"
          height="6"
        />
      </>
    ),

    shoe: (
      <path
        d="M4 15c4 .5 6-1 8-4l2-3 2 3c1 1 2 2 4 2v5H4z"
      />
    ),

    hanger: (
      <>
        <path
          d="M12 7c-2 0-2-4 0-4 2 0 2 2 1 3"
        />

        <path
          d="M13 7 4 14h16z"
        />
      </>
    ),

    watch: (
      <>
        <rect
          x="7"
          y="8"
          width="10"
          height="8"
          rx="3"
        />

        <path
          d="M9 4h6l1 4"
        />

        <path
          d="M8 16l1 4h6l1-4"
        />

        <path
          d="M12 10v3l2 1"
        />
      </>
    ),

    bag: (
      <>
        <path
          d="M5 8h14l-1 12H6z"
        />

        <path
          d="M9 8V6a3 3 0 0 1 6 0v2"
        />
      </>
    ),

    laptop: (
      <>
        <rect
          x="5"
          y="5"
          width="14"
          height="10"
        />

        <path
          d="M3 18h18"
        />
      </>
    ),

    chair: (
      <>
        <path
          d="M6 13V7c0-1 .9-2 2-2h8c1 0 2 1 2 2v6"
        />

        <path
          d="M4 13h16v3H4"
        />

        <path
          d="M6 16v4"
        />

        <path
          d="M18 16v4"
        />
      </>
    ),

    books: (
      <path
        d="M5 5h13v3H5zM4 9h15v3H4zM5 13h13v3H5zM4 17h16v3H4z"
      />
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