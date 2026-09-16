import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} style={styles.card}>
      <img
        src={product.images?.[0] || "https://placehold.co/300x220?text=No+Image"}
        alt={product.title}
        style={styles.img}
      />
      <div style={styles.info}>
        <h3 style={styles.title}>{product.title}</h3>
        <p style={styles.condition}>{product.condition}</p>
        <p style={styles.price}>₹{product.price}</p>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    display: "block",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    textDecoration: "none",
    color: "#111",
    background: "#fff",
    transition: "box-shadow 0.2s",
  },
img: { width: "100%", height: "180px", objectFit: "contain", background: "#f3f4f6", padding: "8px" },  info: { padding: "12px" },
  title: { margin: "0 0 4px 0", fontSize: "1rem" },
  condition: { margin: "0 0 4px 0", fontSize: "0.85rem", color: "#6b7280" },
  price: { margin: 0, fontWeight: "bold", fontSize: "1.05rem" },
};
