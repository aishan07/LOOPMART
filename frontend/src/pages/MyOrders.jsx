import { useEffect, useState } from "react";
import api from "../api/axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then(({ data }) => setOrders(data));
  }, []);

  if (orders.length === 0) {
    return <p style={{ padding: "32px" }}>You have no orders yet.</p>;
  }

  return (
    <div style={{ padding: "32px" }}>
      <h1>My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <ul>
            {order.items.map((item, i) => (
              <li key={i}>{item.title} × {item.quantity} — ₹{item.price}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
