import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const statusColors = {
  Pending: { bg: "#fef3c7", text: "#92400e" },
  Confirmed: { bg: "#dbeafe", text: "#1e40af" },
  Shipped: { bg: "#e0e7ff", text: "#3730a3" },
  Delivered: { bg: "#dcfce7", text: "#166534" },
  Cancelled: { bg: "#fee2e2", text: "#991b1b" },
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p style={{ padding: "32px" }}>Loading your orders...</p>;

  if (orders.length === 0) {
    return (
      <div style={{ padding: "48px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem", color: "#6b7280", marginBottom: "12px" }}>
          You have no orders yet.
        </p>
        <Link to="/" style={{ color: "#1f2937", fontWeight: "600" }}>
          ← Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "24px" }}>My Orders</h1>

      {orders.map((order) => {
        const colors = statusColors[order.status] || statusColors.Pending;
        return (
          <div
            key={order._id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "16px",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "0.8rem", color: "#6b7280" }}>
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>

              <span
                style={{
                  background: colors.bg,
                  color: colors.text,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                }}
              >
                {order.status}
              </span>
            </div>

           <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "14px" }}>
  {order.items.map((item, i) => (
    <Link
      key={i}
      to={`/product/${item.product}`}
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginBottom: "10px",
        textDecoration: "none",
        color: "inherit",
        borderRadius: "8px",
        padding: "6px",
        marginLeft: "-6px",
        marginRight: "-6px",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          flexShrink: 0,
          background: "#f3f4f6",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={item.image || "https://placehold.co/48x48?text=No+Image"}
          alt={item.title}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: "0 0 2px", fontSize: "0.9rem", fontWeight: "500" }}>{item.title}</p>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>Qty: {item.quantity}</p>
      </div>
      <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem" }}>₹{item.price}</p>
    </Link>
  ))}
</div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #f3f4f6",
                paddingTop: "12px",
                marginTop: "8px",
                fontWeight: "bold",
              }}
            >
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}