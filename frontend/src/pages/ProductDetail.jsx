import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  if (!product) return <p style={{ padding: "32px" }}>Loading...</p>;

  return (
    <div style={{ padding: "32px", display: "flex", gap: "40px", flexWrap: "wrap" }}>
      <img
        src={product.images?.[0] || "https://placehold.co/400x300?text=No+Image"}
        alt={product.title}
        style={{ width: "400px", height: "300px", objectFit: "cover", borderRadius: "10px" }}
      />
      <div style={{ maxWidth: "500px" }}>
        <h1>{product.title}</h1>
        <p style={{ color: "#6b7280" }}>{product.condition} · {product.category}</p>
        <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>₹{product.price}</p>
        <p>{product.description}</p>
        <button
          onClick={() => { addToCart(product); navigate("/cart"); }}
          style={{ padding: "12px 24px", background: "#1f2937", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
