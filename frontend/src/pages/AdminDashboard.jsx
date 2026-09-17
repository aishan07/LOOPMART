import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  title: "", description: "", price: "", category: "Electronics",
  condition: "Good", stock: 1,
};

const statusColors = {
  Pending: { bg: "#fef3c7", text: "#92400e" },
  Confirmed: { bg: "#dbeafe", text: "#1e40af" },
  Shipped: { bg: "#e0e7ff", text: "#3730a3" },
  Delivered: { bg: "#dcfce7", text: "#166534" },
  Cancelled: { bg: "#fee2e2", text: "#991b1b" },
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
    const newFiles = Array.from(e.target.files);
    const combined = [...imageFiles, ...newFiles].slice(0, 6 - existingImages.length);
    setImageFiles(combined);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews(combined.map((file) => URL.createObjectURL(file)));
    e.target.value = "";
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

  const handleCancelEdit = () => resetForm();

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
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "8px" }}>Admin Dashboard</h1>
      <p style={{ marginTop: 0, marginBottom: "24px", color: "#6b7280" }}>
        Manage your listings and track incoming orders.
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "28px", borderBottom: "1px solid #e5e7eb" }}>
        <TabButton active={tab === "products"} onClick={() => setTab("products")}>
          Products ({products.length})
        </TabButton>
        <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
          Orders ({orders.length})
        </TabButton>
      </div>

      {tab === "products" && (
        <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* Form card */}
          <div
            style={{
              flex: "1 1 380px",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "24px",
              position: "sticky",
              top: "20px",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "18px" }}>
              {editingId ? "Edit Item" : "Add New Item"}
            </h3>

            {error && (
              <p style={{ color: "#ef4444", background: "#fef2f2", padding: "10px 12px", borderRadius: "6px", marginBottom: "14px", fontSize: "0.9rem" }}>
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Field label="Title">
                <input name="title" placeholder="e.g. HMT Gold Wristwatch" value={form.title} onChange={handleChange} required style={inputStyle} />
              </Field>

              <Field label="Description">
                <textarea
                  name="description"
                  placeholder="Condition details, age, any flaws, why you're selling it..."
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                />
              </Field>

              <Field label="Price (₹)">
                <input name="price" type="number" placeholder="e.g. 999" value={form.price} onChange={handleChange} required style={inputStyle} />
              </Field>

              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <Field label="Category">
                    <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                      <option>Electronics</option>
                      <option>Furniture</option>
                      <option>Clothing</option>
                      <option>Books</option>
                      <option>Other</option>
                    </select>
                  </Field>
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="Condition">
                    <select name="condition" value={form.condition} onChange={handleChange} style={inputStyle}>
                      <option>Like New</option>
                      <option>Good</option>
                      <option>Fair</option>
                      <option>Needs Repair</option>
                    </select>
                  </Field>
                </div>
              </div>

              <Field label="Stock">
                <input name="stock" type="number" placeholder="1" value={form.stock} onChange={handleChange} style={inputStyle} />
              </Field>

              <Field label={`Photos (${totalImageCount}/6)`}>
                {existingImages.length > 0 && (
                  <ThumbGrid>
                    {existingImages.map((url, i) => (
                      <Thumb key={`existing-${i}`} src={url} onRemove={() => removeExistingImage(i)} label={`existing photo ${i + 1}`} />
                    ))}
                  </ThumbGrid>
                )}

                {previews.length > 0 && (
                  <ThumbGrid>
                    {previews.map((url, i) => (
                      <Thumb key={`new-${i}`} src={url} onRemove={() => removeNewImage(i)} label={`new photo ${i + 1}`} />
                    ))}
                  </ThumbGrid>
                )}

                {totalImageCount < 6 && (
                  <label style={dropzoneStyle}>
                    <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                      📷 Click to add photos ({6 - totalImageCount} remaining)
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImageSelect}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
              </Field>

              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button type="submit" disabled={uploading} style={{ ...primaryBtnStyle, opacity: uploading ? 0.6 : 1, flex: 1 }}>
                  {uploading ? "Saving..." : editingId ? "Update Item" : "Add Item"}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} style={secondaryBtnStyle}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Listings */}
          <div style={{ flex: "1 1 400px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "14px" }}>Current Listings</h3>

            {products.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No listings yet — add your first item using the form.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {products.map((p) => (
                  <div
                    key={p._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px",
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                    }}
                  >
                    <div style={{ width: "56px", height: "56px", flexShrink: 0, background: "#f3f4f6", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <img
                        src={p.images?.[0] || "https://placehold.co/56x56?text=No+Image"}
                        alt={p.title}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: "0 0 2px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.title}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
                        ₹{p.price} {p.isSold && <span style={{ color: "#ef4444", fontWeight: "600" }}>· SOLD</span>}
                      </p>
                    </div>

                    <button onClick={() => handleEditClick(p)} style={editBtnStyle}>Edit</button>
                    <button onClick={() => handleDelete(p._id)} style={deleteBtnStyle}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No orders yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {orders.map((order) => {
                const colors = statusColors[order.status] || statusColors.Pending;
                return (
                  <div
                    key={order._id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "18px",
                      background: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <p style={{ margin: "0 0 4px", fontWeight: "600" }}>{order.user?.name}</p>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>{order.user?.email}</p>
                      </div>
                      <span style={{ background: colors.bg, color: colors.text, padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", height: "fit-content" }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                      <p style={{ margin: 0, fontWeight: "bold" }}>Total: ₹{order.totalAmount}</p>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{ ...inputStyle, width: "auto", padding: "8px 12px" }}
                      >
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: "10px 18px",
      background: "none",
      border: "none",
      borderBottom: active ? "2px solid #1f2937" : "2px solid transparent",
      color: active ? "#1f2937" : "#6b7280",
      fontWeight: active ? "600" : "500",
      cursor: "pointer",
      marginBottom: "-1px",
    }}
  >
    {children}
  </button>
);

const Field = ({ label, children }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>{label}</span>
    {children}
  </label>
);

const ThumbGrid = ({ children }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>{children}</div>
);

const Thumb = ({ src, onRemove, label }) => (
  <div style={{ position: "relative" }}>
    <img src={src} alt={label} style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "6px", border: "1px solid #d1d5db" }} />
    <button
      type="button"
      onClick={onRemove}
      style={{
        position: "absolute", top: "-6px", right: "-6px",
        width: "20px", height: "20px", borderRadius: "50%",
        background: "#ef4444", color: "#fff", border: "none",
        cursor: "pointer", fontSize: "12px", lineHeight: 1,
      }}
      aria-label={`Remove ${label}`}
    >
      ×
    </button>
  </div>
);

const inputStyle = {
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "0.95rem",
  width: "100%",
  boxSizing: "border-box",
};

const dropzoneStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "18px",
  border: "2px dashed #d1d5db",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#fafafa",
};

const primaryBtnStyle = {
  padding: "12px",
  background: "#1f2937",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const secondaryBtnStyle = {
  padding: "12px 20px",
  background: "#fff",
  color: "#1f2937",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
};

const editBtnStyle = {
  color: "#1f2937",
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  padding: "7px 14px",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: "500",
};

const deleteBtnStyle = {
  color: "#ef4444",
  background: "#fef2f2",
  border: "none",
  borderRadius: "6px",
  padding: "7px 14px",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: "500",
};
