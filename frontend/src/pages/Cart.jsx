import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    addToCart,
  } = useCart();

  const items = cart || [];

  const getImage = (product) => {
    if (product.images?.length > 0) {
      return product.images[0];
    }

    if (product.image) {
      return product.image;
    }

    return "https://placehold.co/500x500/f1f1ed/777?text=No+Image";
  };

  const getPrice = (product) => {
    return Number(product.price || 0);
  };

  const total = items.reduce((sum, item) => {
    return sum + getPrice(item);
  }, 0);

  const formatPrice = (price) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">

        <main className="cart-empty">

          <div className="empty-cart-icon">
            L
          </div>

          <span className="cart-eyebrow">
            YOUR SHOPPING BAG
          </span>

          <h1>Your cart is empty</h1>

          <p>
            Looks like you haven't found your next
            favourite item yet.
          </p>

          <button
            className="empty-shop-button"
            onClick={() => navigate("/")}
          >
            Explore LoopMart
            <span>→</span>
          </button>

        </main>

      </div>
    );
  }

  return (
    <div className="cart-page">

      <main className="cart-container">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="cart-header">

          <div>
            <span className="cart-eyebrow">
              YOUR SHOPPING BAG
            </span>

            <h1>Your Cart</h1>

            <p>
              {items.length}{" "}
              {items.length === 1 ? "item" : "items"} ready
              for a new home.
            </p>
          </div>

          <div className="cart-item-count">
            {items.length}
            <span>
              {items.length === 1 ? " ITEM" : " ITEMS"}
            </span>
          </div>

        </div>


        {/* =====================================================
            CART CONTENT
        ===================================================== */}

        <div className="cart-layout">

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <section className="cart-products">

            {items.map((item, index) => {

              const image = getImage(item);
              const price = getPrice(item);

              return (
                <article
                  className="cart-product"
                  key={item._id || item.id || index}
                >

                  {/* PRODUCT IMAGE */}

                  <div
                    className="cart-product-image"
                    onClick={() => {
                      if (item._id) {
                        navigate(`/products/${item._id}`);
                      }
                    }}
                  >

                    <img
                      src={image}
                      alt={item.title || "Product"}
                    />

                  </div>


                  {/* PRODUCT INFO */}

                  <div className="cart-product-content">

                    <div className="cart-product-top">

                      <div>

                        <span className="cart-product-category">
                          {item.category || "PRODUCT"}
                        </span>

                        <h2>
                          {item.title}
                        </h2>

                        <p className="cart-product-condition">
                          {item.condition || "Good condition"}
                        </p>

                      </div>

                      <strong className="cart-product-price">
                        {formatPrice(price)}
                      </strong>

                    </div>


                    {/* BOTTOM ACTIONS */}

                    <div className="cart-product-bottom">

                      <div className="cart-quantity">

                        <span>Quantity</span>

                        <div className="quantity-box">

                          <button
                            onClick={() => {
                              // If your CartContext supports
                              // quantity management, connect it here.
                            }}
                          >
                            −
                          </button>

                          <strong>1</strong>

                          <button
                            onClick={() => addToCart(item)}
                          >
                            +
                          </button>

                        </div>

                      </div>


                      <button
                        className="remove-product"
                        onClick={() =>
                          removeFromCart(item._id || item.id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}


            {/* CONTINUE SHOPPING */}

            <button
              className="continue-shopping"
              onClick={() => navigate("/")}
            >
              <span>←</span>
              Continue shopping
            </button>

          </section>


          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="order-summary">

            <div className="summary-heading">

              <span>ORDER</span>

              <h2>Summary</h2>

            </div>


            <div className="summary-lines">

              <div>
                <span>
                  Items ({items.length})
                </span>

                <strong>
                  {formatPrice(total)}
                </strong>
              </div>

              <div>
                <span>
                  Delivery
                </span>

                <strong className="free-delivery">
                  Free
                </strong>
              </div>

            </div>


            <div className="summary-total">

              <span>Total</span>

              <strong>
                {formatPrice(total)}
              </strong>

            </div>


            <button
              className="checkout-button"
              onClick={handleCheckout}
            >
              Proceed to Checkout
              <span>→</span>
            </button>


            <p className="checkout-note">
              Secure checkout · Cash on Delivery available
            </p>


            {/* TRUST */}

            <div className="summary-trust">

              <div>
                <span className="trust-symbol">✓</span>

                <div>
                  <strong>Quality items</strong>
                  <p>Carefully listed products</p>
                </div>
              </div>


              <div>
                <span className="trust-symbol">♻</span>

                <div>
                  <strong>Give it another life</strong>
                  <p>Shop sustainably</p>
                </div>
              </div>


              <div>
                <span className="trust-symbol">↻</span>

                <div>
                  <strong>Simple shopping</strong>
                  <p>Easy ordering experience</p>
                </div>
              </div>

            </div>

          </aside>

        </div>


        {/* =====================================================
            BOTTOM BRAND MESSAGE
        ===================================================== */}

        <section className="cart-brand-message">

          <span>
            THE LOOPMART WAY
          </span>

          <h2>
            Good things deserve
            <br />
            another beginning.
          </h2>

        </section>

      </main>

    </div>
  );
}