import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  title: "", description: "", price: "", category: "Electronics",
  condition: "Good", stock: 1,
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("products");

  const fetchData = async () => {
    const { data: prods } = await api.get("/products");
    setProducts(prods);
    const { data: ords } = await api.get("/orders");
    setOrders(ords);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 6 - existingImages.length);
    setImageFiles(files);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setForm(emptyForm);
    setImageFiles([]);
    setPreviews([]);
    setExistingImages([]);
    setEditingId(null);
    setError("");
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      condition: product.condition,
      stock: product.stock,
    });
    setExistingImages(product.images || []);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setPreviews([]);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const totalImages = existingImages.length + imageFiles.length;
    if (totalImages === 0) {
      setError("Please add at least one photo of the item.");
      return;
    }

    setUploading(true);
    try {
      let newUrls = [];
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("images", file));
        const { data: uploadData } = await api.post("/upload", formData);
        newUrls = uploadData.urls;
      }

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [...existingImages, ...newUrls],
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      resetForm();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while saving the item");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this listing? This can't be undone.")) return;
    await api.delete(`/products/${id}`);
    if (editingId === id) resetForm();
    fetchData();
  };

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchData();
  };

  const totalImageCount = existingImages.length + imageFiles.length;

  return (
    <div style={{ padding: "32px" }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <button onClick={() => setTab("products")} style={tab === "products" ? activeTabStyle : tabStyle}>Products</button>
        <button onClick={() => setTab("orders")} style={tab === "orders" ? activeTabStyle : tabStyle}>Orders</button>
      </div>

      {tab === "products" && (
        <>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px", marginBottom: "32px" }}>
            <h3>{editingId ? "Edit Item" : "Add New Item"}</h3>

            {error && <p style={{ color: "#ef4444", margin: 0 }}>{error}</p>}

            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={inputStyle} />
            <textarea
              name="description"
              placeholder="Describe the item — condition details, age, any flaws, why you're selling it, etc."
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            />
            <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} required style={inputStyle} />
            <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
              <option>Electronics</option>
              <option>Furniture</option>
              <option>Clothing</option>
              <option>Books</option>
              <option>Other</option>
            </select>
            <select name="condition" value={form.condition} onChange={handleChange} style={inputStyle}>
              <option>Like New</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Needs Repair</option>
            </select>
            <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} style={inputStyle} />

            <label style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              Photos ({totalImageCount}/6)
            </label>

            {existingImages.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {existingImages.map((url, i) => (
                  <div key={`existing-${i}`} style={{ position: "relative" }}>
                    <img
                      src={url}
                      alt={`current photo ${i + 1}`}
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #d1d5db" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      style={removeBtnStyle}
                      aria-label={`Remove existing photo ${i + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {totalImageCount < 6 && (
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
                style={inputStyle}
              />
            )}

            {previews.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {previews.map((url, i) => (
                  <div key={`new-${i}`} style={{ position: "relative" }}>
                    <img
                      src={url}
                      alt={`new photo ${i + 1}`}
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #d1d5db" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      style={removeBtnStyle}
                      aria-label={`Remove new photo ${i + 1}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={uploading} style={{ ...btnStyle, opacity: uploading ? 0.6 : 1, flex: 1 }}>
                {uploading ? "Saving..." : editingId ? "Update Item" : "Add Item"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} style={cancelBtnStyle}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h3>Current Listings</h3>
    <div className="listings-header">
  <div>
    <span className="admin-section-label">INVENTORY</span>
    <h3>Current Listings</h3>
    <p>Manage your products and inventory.</p>
  </div>

  <span className="listing-count">
    {products.length} {products.length === 1 ? "item" : "items"}
  </span>
</div>

<div className="admin-listings">

  {products.length === 0 ? (
    <div className="no-listings">
      <div className="no-listings-icon">+</div>
      <h4>No products yet</h4>
      <p>Add your first product using the form above.</p>
    </div>
  ) : (
    products.map((p) => (
      <div className="admin-product-row" key={p._id}>

        {/* PRODUCT IMAGE */}
        <div className="admin-product-image">
          <img
            src={
              p.images?.[0] ||
              "https://placehold.co/120x120/f3f3ef/555?text=No+Image"
            }
            alt={p.title}
          />
        </div>

        {/* PRODUCT DETAILS */}
        <div className="admin-product-details">

          <div className="admin-product-title-row">
            <h4>{p.title}</h4>

            {p.isSold ? (
              <span className="status-badge sold">
                Sold
              </span>
            ) : (
              <span className="status-badge available">
                Available
              </span>
            )}
          </div>

          <div className="admin-product-meta">
            <span>{p.category}</span>
            <span>•</span>
            <span>{p.condition}</span>
            <span>•</span>
            <span>Stock: {p.stock}</span>
          </div>

          <div className="admin-product-price">
            ₹{Number(p.price || 0).toLocaleString("en-IN")}
          </div>

        </div>

        {/* ACTIONS */}
        <div className="admin-product-actions">

          <button
            type="button"
            className="edit-product-btn"
            onClick={() => handleEditClick(p)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 20H21"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M16.5 3.5C17.3 2.7 18.7 2.7 19.5 3.5C20.3 4.3 20.3 5.7 19.5 6.5L8 18L3 19L4 14L16.5 3.5Z"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>

            Edit
          </button>

          <button
            type="button"
            className="delete-product-btn"
            onClick={() => handleDelete(p._id)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M4 7H20"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M10 11V17"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M14 11V17"
                strokeWidth="1.7"
                strokeLinecap="round"
              />

              <path
                d="M6 7L7 20H17L18 7"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />

              <path
                d="M9 7V4H15V7"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>

            Delete
          </button>

        </div>

      </div>
    ))
  )}

</div>
        </>
      )}

      {tab === "orders" && (
        <>
          <h3>All Orders</h3>
          {orders.map((order) => (
            <div key={order._id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
              <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong>
                <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} style={{ marginLeft: "8px" }}>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" };
const btnStyle = { padding: "12px", background: "#1f2937", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };
const cancelBtnStyle = { padding: "12px 20px", background: "#fff", color: "#1f2937", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer" };
const tabStyle = { padding: "8px 16px", border: "1px solid #d1d5db", background: "#fff", borderRadius: "6px", cursor: "pointer" };
const activeTabStyle = { ...tabStyle, background: "#1f2937", color: "#fff" };
const removeBtnStyle = {
  position: "absolute", top: "-6px", right: "-6px",
  width: "20px", height: "20px", borderRadius: "50%",
  background: "#ef4444", color: "#fff", border: "none",
  cursor: "pointer", fontSize: "12px", lineHeight: 1,
};