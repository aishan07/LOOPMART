import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const statusConfig = {
  Pending: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
    icon: "⏳",
  },
  Confirmed: {
    color: "#2563eb",
    background: "#eff6ff",
    border: "#bfdbfe",
    icon: "✓",
  },
  Shipped: {
    color: "#7c3aed",
    background: "#f5f3ff",
    border: "#ddd6fe",
    icon: "🚚",
  },
  Delivered: {
    color: "#15803d",
    background: "#f0fdf4",
    border: "#bbf7d0",
    icon: "✓",
  },
  Cancelled: {
    color: "#dc2626",
    background: "#fef2f2",
    border: "#fecaca",
    icon: "✕",
  },
};

const trackSteps = ["Pending", "Confirmed", "Shipped", "Delivered"];

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";

  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString("en-IN");
};

/* =========================
   ORDER STATUS TRACKER
========================= */

function OrderTracker({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="cancelled-tracker">
        <div className="cancelled-icon">✕</div>

        <div>
          <strong>Order Cancelled</strong>
          <p>This order will not be processed or delivered.</p>
        </div>
      </div>
    );
  }

  const currentIndex = trackSteps.indexOf(status);

  return (
    <div className="order-tracker">
      {trackSteps.map((step, index) => {
        const completed = index <= currentIndex;
        const active = index === currentIndex;
        const isLast = index === trackSteps.length - 1;

        return (
          <div className="tracker-item-wrapper" key={step}>
            <div className="tracker-item">
              <div
                className={`tracker-circle ${
                  completed ? "completed" : ""
                } ${active ? "active" : ""}`}
              >
                {completed ? "✓" : index + 1}
              </div>

              <span
                className={`tracker-label ${
                  completed ? "completed-label" : ""
                }`}
              >
                {step}
              </span>
            </div>

            {!isLast && (
              <div
                className={`tracker-line ${
                  index < currentIndex ? "completed-line" : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Unable to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <>
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <h3>Loading your orders</h3>
          <p>Please wait while we fetch your order history.</p>
        </div>

        <OrdersStyles />
      </>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <>
        <div className="orders-error">
          <div className="error-icon">!</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Try Again
          </button>
        </div>

        <OrdersStyles />
      </>
    );
  }

  /* =========================
     EMPTY STATE
  ========================= */

  if (orders.length === 0) {
    return (
      <>
        <div className="empty-orders">
          <div className="empty-icon">🛍️</div>

          <h2>No orders yet</h2>

          <p>
            You haven't placed any orders yet.
            <br />
            Start exploring LoopMart and find something you love.
          </p>

          <Link to="/" className="shop-button">
            Start Shopping
            <span>→</span>
          </Link>
        </div>

        <OrdersStyles />
      </>
    );
  }

  /* =========================
     ORDERS PAGE
  ========================= */

  return (
    <>
      <div className="orders-page">

        {/* PAGE HEADER */}

        <div className="orders-header">
          <div>
            <div className="page-eyebrow">
              <span></span>
              LOOPMART
            </div>

            <h1>My Orders</h1>

            <p>
              Track your purchases and view your complete order history.
            </p>
          </div>

          <div className="order-count">
            <strong>{orders.length}</strong>
            <span>
              {orders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>
        </div>

        {/* ORDER LIST */}

        <div className="orders-list">
          {orders.map((order) => {
            const config =
              statusConfig[order.status] || statusConfig.Pending;

            return (
              <div className="order-card" key={order._id}>

                {/* ORDER HEADER */}

                <div className="order-card-header">

                  <div className="order-information">

                    <div className="order-number">
                      Order #
                      {order._id.slice(-8).toUpperCase()}
                    </div>

                    <div className="order-date">
                      <span>Placed on</span>
                      {formatDate(order.createdAt)}
                    </div>

                  </div>

                  <div
                    className="status-badge"
                    style={{
                      color: config.color,
                      background: config.background,
                      borderColor: config.border,
                    }}
                  >
                    <span>{config.icon}</span>
                    {order.status}
                  </div>

                </div>

                {/* TRACKER */}

                <div className="tracker-section">

                  <div className="section-heading">
                    <span className="heading-icon">📦</span>
                    Order Status
                  </div>

                  <OrderTracker status={order.status} />

                </div>

                {/* PRODUCTS */}

                <div className="products-section">

                  <div className="section-heading">
                    <span className="heading-icon">🛍️</span>
                    Items in this order
                  </div>

                  <div className="products-list">

                    {order.items.map((item, index) => (
                      <Link
                        key={index}
                        to={`/product/${item.product}`}
                        className="product-row"
                      >

                        <div className="product-image-wrapper">

                          <img
                            src={
                              item.image ||
                              "https://placehold.co/100x100?text=No+Image"
                            }
                            alt={item.title}
                            className="product-image"
                          />

                        </div>

                        <div className="product-information">

                          <h3>{item.title}</h3>

                          <div className="product-meta">
                            <span>
                              Quantity: <strong>{item.quantity}</strong>
                            </span>

                            <span className="meta-divider">•</span>

                            <span>
                              Unit price:{" "}
                              <strong>
                                ₹{formatPrice(item.price)}
                              </strong>
                            </span>
                          </div>

                        </div>

                        <div className="product-price">

                          <span className="price-label">
                            Item Total
                          </span>

                          <strong>
                            ₹
                            {formatPrice(
                              Number(item.price || 0) *
                                Number(item.quantity || 1)
                            )}
                          </strong>

                          <span className="product-arrow">→</span>

                        </div>

                      </Link>
                    ))}

                  </div>

                </div>

                {/* ORDER FOOTER */}

                <div className="order-footer">

                  <div className="order-footer-info">

                    <span className="footer-label">
                      Total items
                    </span>

                    <strong>
                      {order.items.reduce(
                        (total, item) =>
                          total + Number(item.quantity || 0),
                        0
                      )}
                    </strong>

                  </div>

                  <div className="total-section">

                    <span>Total Amount</span>

                    <strong>
                      ₹{formatPrice(order.totalAmount)}
                    </strong>

                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* CONTINUE SHOPPING */}

        <div className="continue-shopping">
          <span>Looking for something else?</span>

          <Link to="/">
            Continue Shopping →
          </Link>
        </div>

      </div>

      <OrdersStyles />
    </>
  );
}

/* =========================
   STYLES
========================= */

function OrdersStyles() {
  return (
    <style>{`

      * {
        box-sizing: border-box;
      }

      .orders-page {
        min-height: 100vh;
        background: #f7f9f8;
        padding: 48px 24px 70px;
        color: #17201d;
      }

      .orders-page,
      .orders-page * {
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
      }

      /* =========================
         HEADER
      ========================= */

      .orders-header {
        max-width: 1050px;
        margin: 0 auto 34px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 24px;
      }

      .page-eyebrow {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #0d4f42;
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 1.8px;
        margin-bottom: 9px;
      }

      .page-eyebrow span {
        width: 24px;
        height: 2px;
        background: #0d4f42;
        border-radius: 10px;
      }

      .orders-header h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 2.65rem);
        line-height: 1.1;
        font-weight: 800;
        letter-spacing: -1px;
        color: #17201d;
      }

      .orders-header p {
        margin: 10px 0 0;
        color: #71807b;
        font-size: 0.95rem;
      }

      .order-count {
        min-width: 92px;
        height: 76px;
        background: white;
        border: 1px solid #e1e8e4;
        border-radius: 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(13, 79, 66, 0.04);
      }

      .order-count strong {
        color: #0d4f42;
        font-size: 1.45rem;
        line-height: 1;
      }

      .order-count span {
        margin-top: 5px;
        color: #7a8883;
        font-size: 0.72rem;
        font-weight: 600;
      }

      /* =========================
         ORDER LIST
      ========================= */

      .orders-list {
        max-width: 1050px;
        margin: 0 auto;
      }

      .order-card {
        background: #ffffff;
        border: 1px solid #e1e8e4;
        border-radius: 18px;
        margin-bottom: 20px;
        overflow: hidden;
        box-shadow: 0 5px 20px rgba(13, 79, 66, 0.045);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .order-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(13, 79, 66, 0.08);
      }

      /* =========================
         ORDER HEADER
      ========================= */

      .order-card-header {
        padding: 22px 26px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 18px;
        border-bottom: 1px solid #edf1ef;
      }

      .order-number {
        font-size: 0.96rem;
        font-weight: 800;
        color: #202a27;
        letter-spacing: 0.2px;
      }

      .order-date {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 6px;
        color: #8a9692;
        font-size: 0.78rem;
      }

      .order-date span {
        color: #a1aba7;
      }

      .status-badge {
        border: 1px solid;
        border-radius: 30px;
        padding: 7px 13px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        white-space: nowrap;
      }

      /* =========================
         TRACKER
      ========================= */

      .tracker-section {
        padding: 22px 26px 25px;
        border-bottom: 1px solid #edf1ef;
      }

      .section-heading {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #37423e;
        font-size: 0.78rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.65px;
      }

      .heading-icon {
        font-size: 0.9rem;
      }

      .order-tracker {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 22px 4px 5px;
      }

      .tracker-item-wrapper {
        display: flex;
        align-items: center;
        flex: 1;
      }

      .tracker-item-wrapper:last-child {
        flex: 0 0 auto;
      }

      .tracker-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 68px;
      }

      .tracker-circle {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #edf1ef;
        color: #a0aaa6;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.72rem;
        font-weight: 800;
        border: 3px solid #fff;
        box-shadow: 0 0 0 1px #e0e6e3;
        transition: 0.2s;
      }

      .tracker-circle.completed {
        background: #0d4f42;
        color: white;
        box-shadow: 0 0 0 1px #0d4f42;
      }

      .tracker-circle.active {
        box-shadow: 0 0 0 4px rgba(13, 79, 66, 0.1);
      }

      .tracker-label {
        margin-top: 8px;
        color: #a0aaa6;
        font-size: 0.69rem;
        font-weight: 600;
        white-space: nowrap;
      }

      .completed-label {
        color: #26322e;
        font-weight: 700;
      }

      .tracker-line {
        height: 2px;
        background: #e6ebe9;
        flex: 1;
        margin: 0 8px;
        margin-bottom: 22px;
      }

      .completed-line {
        background: #0d4f42;
      }

      /* =========================
         CANCELLED
      ========================= */

      .cancelled-tracker {
        margin-top: 18px;
        padding: 13px 15px;
        border-radius: 10px;
        background: #fff7f7;
        border: 1px solid #fee2e2;
        display: flex;
        align-items: center;
        gap: 12px;
        color: #b91c1c;
      }

      .cancelled-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #fee2e2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
      }

      .cancelled-tracker strong {
        display: block;
        font-size: 0.83rem;
      }

      .cancelled-tracker p {
        margin: 3px 0 0;
        font-size: 0.72rem;
        color: #b45353;
      }

      /* =========================
         PRODUCTS
      ========================= */

      .products-section {
        padding: 22px 26px 4px;
      }

      .products-list {
        margin-top: 13px;
      }

      .product-row {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 12px 10px;
        margin: 0 -10px;
        border-radius: 12px;
        text-decoration: none;
        color: inherit;
        transition: background 0.18s ease;
      }

      .product-row:hover {
        background: #f7faf8;
      }

      .product-image-wrapper {
        width: 72px;
        height: 72px;
        flex: 0 0 72px;
        background: #f4f7f5;
        border: 1px solid #e7ece9;
        border-radius: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .product-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        mix-blend-mode: multiply;
      }

      .product-information {
        flex: 1;
        min-width: 0;
      }

      .product-information h3 {
        margin: 0 0 7px;
        font-size: 0.92rem;
        font-weight: 750;
        color: #25302c;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .product-meta {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 7px;
        color: #8a9692;
        font-size: 0.74rem;
      }

      .product-meta strong {
        color: #596661;
      }

      .meta-divider {
        color: #c5cdca;
      }

      .product-price {
        display: flex;
        align-items: flex-end;
        gap: 10px;
        min-width: 125px;
        justify-content: flex-end;
      }

      .product-price .price-label {
        display: none;
      }

      .product-price strong {
        font-size: 0.92rem;
        color: #25302c;
      }

      .product-arrow {
        color: #9aa6a1;
        font-size: 1rem;
        transition: transform 0.18s;
      }

      .product-row:hover .product-arrow {
        transform: translateX(3px);
        color: #0d4f42;
      }

      /* =========================
         FOOTER
      ========================= */

      .order-footer {
        margin-top: 12px;
        padding: 20px 26px;
        background: #f9fbfa;
        border-top: 1px solid #edf1ef;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .order-footer-info {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #7d8985;
        font-size: 0.76rem;
      }

      .footer-label {
        color: #929d99;
      }

      .order-footer-info strong {
        color: #46534e;
      }

      .total-section {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .total-section span {
        color: #71807b;
        font-size: 0.78rem;
        font-weight: 600;
      }

      .total-section strong {
        color: #0d4f42;
        font-size: 1.2rem;
        font-weight: 850;
      }

      /* =========================
         CONTINUE SHOPPING
      ========================= */

      .continue-shopping {
        max-width: 1050px;
        margin: 28px auto 0;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        color: #8a9692;
        font-size: 0.8rem;
      }

      .continue-shopping a {
        color: #0d4f42;
        font-weight: 750;
        text-decoration: none;
      }

      .continue-shopping a:hover {
        text-decoration: underline;
      }

      /* =========================
         EMPTY STATE
      ========================= */

      .empty-orders {
        min-height: 70vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 50px 24px;
        color: #27332f;
      }

      .empty-icon {
        width: 82px;
        height: 82px;
        border-radius: 50%;
        background: #edf7f3;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        margin-bottom: 22px;
      }

      .empty-orders h2 {
        margin: 0;
        font-size: 1.55rem;
      }

      .empty-orders p {
        margin: 10px 0 24px;
        color: #7b8884;
        line-height: 1.65;
        font-size: 0.9rem;
      }

      .shop-button {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: #0d4f42;
        color: white;
        padding: 12px 20px;
        border-radius: 9px;
        text-decoration: none;
        font-size: 0.84rem;
        font-weight: 700;
        transition: 0.2s;
      }

      .shop-button:hover {
        background: #093c32;
        transform: translateY(-1px);
      }

      /* =========================
         LOADING
      ========================= */

      .orders-loading {
        min-height: 70vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background: #f7f9f8;
      }

      .loading-spinner {
        width: 38px;
        height: 38px;
        border: 3px solid #dce7e3;
        border-top-color: #0d4f42;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 18px;
      }

      .orders-loading h3 {
        margin: 0;
        font-size: 1rem;
        color: #27332f;
      }

      .orders-loading p {
        margin: 6px 0 0;
        color: #87938f;
        font-size: 0.8rem;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* =========================
         ERROR
      ========================= */

      .orders-error {
        min-height: 70vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        background: #f7f9f8;
        padding: 30px;
      }

      .error-icon {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: #fee2e2;
        color: #dc2626;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 1.3rem;
        margin-bottom: 15px;
      }

      .orders-error h2 {
        margin: 0;
        font-size: 1.25rem;
      }

      .orders-error p {
        color: #7b8884;
        font-size: 0.85rem;
        margin: 8px 0 18px;
      }

      .retry-button {
        border: none;
        background: #0d4f42;
        color: white;
        padding: 10px 18px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
      }

      /* =========================
         MOBILE
      ========================= */

      @media (max-width: 700px) {

        .orders-page {
          padding: 30px 14px 50px;
        }

        .orders-header {
          align-items: flex-start;
        }

        .orders-header p {
          max-width: 260px;
          line-height: 1.5;
        }

        .order-count {
          min-width: 72px;
          height: 65px;
        }

        .order-card {
          border-radius: 14px;
        }

        .order-card-header,
        .tracker-section,
        .products-section {
          padding-left: 17px;
          padding-right: 17px;
        }

        .order-card-header {
          align-items: flex-start;
        }

        .order-tracker {
          padding-left: 0;
          padding-right: 0;
        }

        .tracker-label {
          font-size: 0.61rem;
        }

        .tracker-circle {
          width: 27px;
          height: 27px;
        }

        .tracker-line {
          margin-left: 4px;
          margin-right: 4px;
        }

        .product-row {
          gap: 10px;
        }

        .product-image-wrapper {
          width: 58px;
          height: 58px;
          flex-basis: 58px;
        }

        .product-information h3 {
          font-size: 0.82rem;
        }

        .product-meta {
          font-size: 0.68rem;
        }

        .product-price {
          min-width: auto;
        }

        .product-price strong {
          font-size: 0.82rem;
        }

        .product-arrow {
          display: none;
        }

        .order-footer {
          padding: 17px;
        }

        .total-section {
          gap: 8px;
          flex-direction: column;
          align-items: flex-end;
        }

        .total-section strong {
          font-size: 1.05rem;
        }

        .continue-shopping {
          flex-direction: column;
          gap: 5px;
        }
      }

      @media (max-width: 450px) {

        .orders-header {
          flex-direction: column;
        }

        .order-count {
          align-self: flex-start;
          flex-direction: row;
          gap: 7px;
          padding: 0 15px;
          width: auto;
          min-width: auto;
          height: 42px;
        }

        .order-count span {
          margin-top: 0;
        }

        .status-badge {
          padding: 6px 9px;
          font-size: 0.65rem;
        }

        .order-number {
          font-size: 0.84rem;
        }

        .order-date {
          font-size: 0.7rem;
        }

        .tracker-label {
          font-size: 0.55rem;
        }

        .tracker-circle {
          width: 24px;
          height: 24px;
          font-size: 0.62rem;
        }

        .product-meta .meta-divider {
          display: none;
        }

        .product-meta {
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .product-price .price-label {
          display: block;
          font-size: 0.58rem;
          color: #9aa6a1;
          text-align: right;
        }

        .product-price {
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
      }

    `}</style>
  );
}