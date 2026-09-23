import { useEffect, useState } from "react";
import api from "../api/axios";
import "./AdminDashboard.css";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  category: "Electronics",
  condition: "Good",
  stock: 1,
};

const statusColors = {
  Pending: {
    bg: "#fff7ed",
    text: "#c2410c",
    border: "#fed7aa",
  },
  Confirmed: {
    bg: "#eff6ff",
    text: "#2563eb",
    border: "#bfdbfe",
  },
  Shipped: {
    bg: "#f5f3ff",
    text: "#7c3aed",
    border: "#ddd6fe",
  },
  Delivered: {
    bg: "#f0fdf4",
    text: "#15803d",
    border: "#bbf7d0",
  },
  Cancelled: {
    bg: "#fef2f2",
    text: "#dc2626",
    border: "#fecaca",
  },
};

const categories = [
  { name: "Shoes", label: "Shoes", icon: "👟" },
  { name: "Clothing", label: "Clothes", icon: "👕" },
  { name: "Watches", label: "Watches", icon: "⌚" },
  { name: "Accessories", label: "Accessories", icon: "👜" },
  { name: "Electronics", label: "Electronics", icon: "📱" },
  { name: "Furniture", label: "Furniture", icon: "🪑" },
  { name: "Books", label: "Books", icon: "📚" },
  { name: "Other", label: "Other", icon: "📦" },
];

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=85",
    title: "Give Pre-Loved Fashion a New Life",
    text: "Discover clothes, shoes and accessories at great prices.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=85",
    title: "Find Your Next Watch",
    text: "Unique pre-owned watches ready for their next owner.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=85",
    title: "Smart Shopping, Second Life",
    text: "Turn unused products into useful finds with LoopMart.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=85",
    title: "Buy Better. Reuse More.",
    text: "A marketplace for quality second-hand products.",
  },
];

/* =========================
   MAIN DASHBOARD
========================= */

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
  const [heroIndex, setHeroIndex] = useState(0);

  /* =========================
     HERO SLIDER
  ========================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextHero = () => {
    setHeroIndex(
      (current) => (current + 1) % heroSlides.length
    );
  };

  const previousHero = () => {
    setHeroIndex(
      (current) =>
        (current - 1 + heroSlides.length) % heroSlides.length
    );
  };

  /* =========================
     FETCH DATA
  ========================= */

  const fetchData = async () => {
    try {
      const { data: prods } = await api.get("/products");
      setProducts(prods);

      const { data: ords } = await api.get("/orders");
      setOrders(ords);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =========================
     FORM
  ========================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     IMAGE SELECT
  ========================= */

  const handleImageSelect = (e) => {
    const newFiles = Array.from(e.target.files);

    const remainingSlots = 6 - existingImages.length;

    const combined = [
      ...imageFiles,
      ...newFiles,
    ].slice(0, remainingSlots);

    setImageFiles(combined);

    previews.forEach((url) => URL.revokeObjectURL(url));

    setPreviews(
      combined.map((file) =>
        URL.createObjectURL(file)
      )
    );

    e.target.value = "";
  };

  const removeNewImage = (index) => {
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }

    setImageFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setPreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    previews.forEach((url) =>
      URL.revokeObjectURL(url)
    );

    setForm(emptyForm);
    setImageFiles([]);
    setPreviews([]);
    setExistingImages([]);
    setEditingId(null);
    setError("");
  };

  /* =========================
     EDIT PRODUCT
  ========================= */

  const handleEditClick = (product) => {
    setEditingId(product._id);

    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "Electronics",
      condition: product.condition || "Good",
      stock: product.stock ?? 1,
    });

    setExistingImages(product.images || []);

    previews.forEach((url) =>
      URL.revokeObjectURL(url)
    );

    setImageFiles([]);
    setPreviews([]);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  /* =========================
     SUBMIT PRODUCT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const totalImages =
      existingImages.length + imageFiles.length;

    if (totalImages === 0) {
      setError(
        "Please add at least one photo of the item."
      );
      return;
    }

    setUploading(true);

    try {
      let newUrls = [];

      if (imageFiles.length > 0) {
        const formData = new FormData();

        imageFiles.forEach((file) => {
          formData.append("images", file);
        });

        const { data: uploadData } =
          await api.post("/upload", formData);

        newUrls = uploadData.urls;
      }

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [
          ...existingImages,
          ...newUrls,
        ],
      };

      if (editingId) {
        await api.put(
          `/products/${editingId}`,
          payload
        );
      } else {
        await api.post("/products", payload);
      }

      resetForm();

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while saving the item."
      );
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Remove this listing? This can't be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);

      if (editingId === id) {
        resetForm();
      }

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete this listing."
      );
    }
  };

  /* =========================
     ORDER STATUS
  ========================= */

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      await api.put(
        `/orders/${id}/status`,
        { status }
      );

      await fetchData();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update order status."
      );
    }
  };

  /* =========================
     STATS
  ========================= */

  const activeListings = products.filter(
    (p) => !p.isSold
  ).length;

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const revenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce(
      (sum, o) =>
        sum + Number(o.totalAmount || 0),
      0
    );

  const totalImageCount =
    existingImages.length + imageFiles.length;

  const stats = [
    {
      label: "Active Listings",
      value: activeListings,
      icon: "🛍️",
      description: "Items currently available",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: "📦",
      description: "Orders received",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: "⏳",
      description: "Need your attention",
    },
    {
      label: "Total Revenue",
      value: `₹${revenue.toLocaleString(
        "en-IN"
      )}`,
      icon: "₹",
      description: `${deliveredOrders} delivered orders`,
    },
  ];

  return (
    <div className="loopmart-admin">

      {/* =========================
          TOP HEADER
      ========================= */}

      <header className="admin-top-header">

        <div className="admin-brand">
          <div className="brand-mark">
            L
          </div>

          <div>
            <strong>LoopMart</strong>
            <span>Marketplace Dashboard</span>
          </div>
        </div>

        <div className="admin-header-label">
          <span className="online-dot"></span>
          Admin Panel
        </div>

      </header>

      {/* =========================
          MAIN CONTAINER
      ========================= */}

      <main className="admin-container">

        {/* =========================
            PAGE INTRO
        ========================= */}

        <section className="dashboard-intro">

          <div>
            <span className="dashboard-eyebrow">
              LOOPMART ADMINISTRATION
            </span>

            <h1>Dashboard</h1>

            <p>
              Manage your marketplace, listings and
              incoming orders from one place.
            </p>
          </div>

          <div className="dashboard-date">
            <span>Marketplace</span>
            <strong>Live Dashboard</strong>
          </div>

        </section>

        {/* =========================
            STATS
        ========================= */}

        <section className="stats-grid">

          {stats.map((stat) => (
            <div
              className="stat-card"
              key={stat.label}
            >
              <div className="stat-icon">
                {stat.icon}
              </div>

              <div className="stat-content">
                <span>{stat.label}</span>

                <strong>{stat.value}</strong>

                <small>
                  {stat.description}
                </small>
              </div>
            </div>
          ))}

        </section>

        {/* =========================
            HERO
        ========================= */}

        <section className="hero-section">

          {heroSlides.map((slide, index) => (
            <div
              key={slide.image}
              className={`hero-slide ${
                index === heroIndex
                  ? "hero-active"
                  : ""
              }`}
              style={{
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(7, 37, 31, 0.88),
                    rgba(7, 37, 31, 0.35)
                  ),
                  url(${slide.image})
                `,
              }}
            >
              <div className="hero-content">

                <span className="hero-eyebrow">
                  LOOPMART MARKETPLACE
                </span>

                <h2>{slide.title}</h2>

                <p>{slide.text}</p>

                <button
                  type="button"
                  className="hero-action"
                  onClick={() => {
                    setTab("products");
                    document
                      .getElementById(
                        "dashboard-management"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                >
                  Manage Marketplace
                  <span>→</span>
                </button>

              </div>
            </div>
          ))}

          <button
            type="button"
            className="hero-arrow hero-prev"
            onClick={previousHero}
            aria-label="Previous banner"
          >
            ‹
          </button>

          <button
            type="button"
            className="hero-arrow hero-next"
            onClick={nextHero}
            aria-label="Next banner"
          >
            ›
          </button>

          <div className="hero-dots">

            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={
                  index === heroIndex
                    ? "hero-dot active"
                    : "hero-dot"
                }
                onClick={() =>
                  setHeroIndex(index)
                }
                aria-label={`Show banner ${
                  index + 1
                }`}
              />
            ))}

          </div>

        </section>

        {/* =========================
            CATEGORIES
        ========================= */}

        <section className="categories-section">

          <div className="section-header">

            <div>
              <span className="section-eyebrow">
                EXPLORE
              </span>

              <h2>Shop Categories</h2>

              <p>
                Quickly select a category to
                create your next listing.
              </p>
            </div>

          </div>

          <div className="category-grid">

            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                className="category-card"
                onClick={() => {
                  setTab("products");

                  setForm((current) => ({
                    ...current,
                    category:
                      category.name,
                  }));

                  document
                    .getElementById(
                      "dashboard-management"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                <span className="category-icon">
                  {category.icon}
                </span>

                <strong>
                  {category.label}
                </strong>

                <span className="category-arrow">
                  →
                </span>
              </button>
            ))}

          </div>

        </section>

        {/* =========================
            ABOUT LOOPMART
        ========================= */}

        <section className="about-section">

          <div className="about-content">

            <span className="section-eyebrow light">
              ABOUT LOOPMART
            </span>

            <h2>
              Give pre-loved products
              <span> a second life.</span>
            </h2>

            <p>
              LoopMart is a modern second-hand
              marketplace created to make buying
              and selling pre-loved products
              simple, affordable and convenient.
            </p>

            <p>
              From electronics and furniture to
              clothing, shoes, watches and
              accessories, LoopMart helps useful
              products find their next owner.
            </p>

            <div className="about-features">

              <div>
                <strong>♻</strong>
                <span>
                  Give products a second life
                </span>
              </div>

              <div>
                <strong>₹</strong>
                <span>
                  Smart and affordable shopping
                </span>
              </div>

              <div>
                <strong>✓</strong>
                <span>
                  Simple marketplace experience
                </span>
              </div>

            </div>

          </div>

          <div className="about-visual">

            <div className="about-circle circle-one"></div>
            <div className="about-circle circle-two"></div>

            <div className="about-logo-card">

              <div className="about-logo">
                L
              </div>

              <h3>LoopMart</h3>

              <p>
                Buy smart.
                <br />
                Reuse more.
                <br />
                Keep it in the loop.
              </p>

            </div>

            <div className="floating-card floating-card-one">
              <strong>♻</strong>
              <span>Second Life</span>
            </div>

            <div className="floating-card floating-card-two">
              <strong>✓</strong>
              <span>Quality Finds</span>
            </div>

          </div>

        </section>

        {/* =========================
            MANAGEMENT
        ========================= */}

        <section
          id="dashboard-management"
          className="management-section"
        >

          <div className="management-header">

            <div>
              <span className="section-eyebrow">
                ADMIN CONTROL
              </span>

              <h2>Manage Marketplace</h2>

              <p>
                Add products, update your
                inventory and manage customer
                orders.
              </p>
            </div>

            <div className="management-tabs">

              <button
                type="button"
                className={
                  tab === "products"
                    ? "management-tab active"
                    : "management-tab"
                }
                onClick={() =>
                  setTab("products")
                }
              >
                Products
                <span>{products.length}</span>
              </button>

              <button
                type="button"
                className={
                  tab === "orders"
                    ? "management-tab active"
                    : "management-tab"
                }
                onClick={() =>
                  setTab("orders")
                }
              >
                Orders
                <span>{orders.length}</span>
              </button>

            </div>

          </div>

          {/* =========================
              PRODUCTS TAB
          ========================= */}

          {tab === "products" && (
            <div className="management-layout">

              {/* PRODUCT FORM */}

              <div className="product-form-card">

                <div className="form-card-header">

                  <div className="form-card-icon">
                    {editingId ? "✎" : "+"}
                  </div>

                  <div>
                    <span>
                      {editingId
                        ? "EDIT LISTING"
                        : "NEW LISTING"}
                    </span>

                    <h3>
                      {editingId
                        ? "Update Product"
                        : "Add New Product"}
                    </h3>
                  </div>

                </div>

                {error && (
                  <div className="form-error">
                    <strong>!</strong>
                    <span>{error}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="product-form"
                >

                  <Field label="Product Title">
                    <input
                      name="title"
                      placeholder="e.g. HMT Gold Wristwatch"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field label="Description">
                    <textarea
                      name="description"
                      placeholder="Describe the product, condition, age, flaws, etc."
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={5}
                    />
                  </Field>

                  <Field label="Price (₹)">
                    <div className="price-input">
                      <span>₹</span>

                      <input
                        name="price"
                        type="number"
                        min="0"
                        placeholder="999"
                        value={form.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </Field>

                  <div className="form-two-columns">

                    <Field label="Category">
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                      >
                        {categories.map(
                          (category) => (
                            <option
                              key={
                                category.name
                              }
                              value={
                                category.name
                              }
                            >
                              {category.label}
                            </option>
                          )
                        )}
                      </select>
                    </Field>

                    <Field label="Condition">
                      <select
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                      >
                        <option>
                          Like New
                        </option>
                        <option>
                          Good
                        </option>
                        <option>
                          Fair
                        </option>
                        <option>
                          Needs Repair
                        </option>
                      </select>
                    </Field>

                  </div>

                  <Field label="Stock">
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      placeholder="1"
                      value={form.stock}
                      onChange={handleChange}
                    />
                  </Field>

                  {/* PHOTOS */}

                  <Field
                    label={`Product Photos (${totalImageCount}/6)`}
                  >

                    {existingImages.length >
                      0 && (
                      <ThumbGrid>
                        {existingImages.map(
                          (url, index) => (
                            <Thumb
                              key={`existing-${index}`}
                              src={url}
                              label={`existing photo ${
                                index + 1
                              }`}
                              onRemove={() =>
                                removeExistingImage(
                                  index
                                )
                              }
                            />
                          )
                        )}
                      </ThumbGrid>
                    )}

                    {previews.length > 0 && (
                      <ThumbGrid>
                        {previews.map(
                          (url, index) => (
                            <Thumb
                              key={`new-${index}`}
                              src={url}
                              label={`new photo ${
                                index + 1
                              }`}
                              onRemove={() =>
                                removeNewImage(
                                  index
                                )
                              }
                            />
                          )
                        )}
                      </ThumbGrid>
                    )}

                    {totalImageCount < 6 && (
                      <label className="upload-zone">

                        <div className="upload-icon">
                          +
                        </div>

                        <strong>
                          Add product photos
                        </strong>

                        <span>
                          JPG, PNG or WEBP ·{" "}
                          {6 -
                            totalImageCount}{" "}
                          slots remaining
                        </span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={
                            handleImageSelect
                          }
                        />

                      </label>
                    )}

                  </Field>

                  {/* BUTTONS */}

                  <div className="form-buttons">

                    <button
                      type="submit"
                      disabled={uploading}
                      className="primary-button"
                    >
                      {uploading
                        ? "Saving..."
                        : editingId
                        ? "Update Listing"
                        : "Publish Listing"}
                    </button>

                    {editingId && (
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={
                          handleCancelEdit
                        }
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </form>

              </div>

              {/* LISTINGS */}

              <div className="listings-section">

                <div className="listings-header">

                  <div>
                    <span className="section-eyebrow">
                      INVENTORY
                    </span>

                    <h3>Current Listings</h3>

                    <p>
                      Products currently
                      available in your
                      marketplace.
                    </p>
                  </div>

                  <div className="listing-count">
                    {products.length}{" "}
                    {products.length === 1
                      ? "item"
                      : "items"}
                  </div>

                </div>

                {products.length === 0 ? (
                  <div className="no-listings">

                    <div className="empty-box">
                      🛍️
                    </div>

                    <h4>
                      No listings yet
                    </h4>

                    <p>
                      Add your first product
                      using the form.
                    </p>

                  </div>
                ) : (
                  <div className="admin-listings">

                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="admin-product-row"
                      >

                        <div className="admin-product-image">
                          <img
                            src={
                              product.images?.[0] ||
                              "https://placehold.co/100x100?text=No+Image"
                            }
                            alt={product.title}
                          />
                        </div>

                        <div className="admin-product-details">

                          <div className="product-title-row">

                            <h4>
                              {product.title}
                            </h4>

                            <span
                              className={
                                product.isSold
                                  ? "product-status sold"
                                  : "product-status available"
                              }
                            >
                              {product.isSold
                                ? "Sold"
                                : "Available"}
                            </span>

                          </div>

                          <div className="product-meta">
                            <span>
                              {product.category}
                            </span>

                            <span>•</span>

                            <span>
                              {product.condition}
                            </span>

                            <span>•</span>

                            <span>
                              Stock:{" "}
                              {product.stock ??
                                0}
                            </span>
                          </div>

                          <strong className="product-price">
                            ₹
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                        <div className="product-actions">

                          <button
                            type="button"
                            className="edit-button"
                            onClick={() =>
                              handleEditClick(
                                product
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                product._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>

            </div>
          )}

          {/* =========================
              ORDERS TAB
          ========================= */}

          {tab === "orders" && (
            <div className="orders-admin-section">

              {orders.length === 0 ? (
                <div className="no-orders">
                  <div>📦</div>
                  <h3>No orders yet</h3>
                  <p>
                    Customer orders will appear
                    here when they are placed.
                  </p>
                </div>
              ) : (
                <div className="orders-admin-list">

                  {orders.map((order) => {

                    const colors =
                      statusColors[
                        order.status
                      ] ||
                      statusColors.Pending;

                    return (
                      <div
                        className="admin-order-card"
                        key={order._id}
                      >

                        <div className="admin-order-top">

                          <div className="customer-info">

                            <div className="customer-avatar">
                              {(
                                order.user?.name ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {order.user
                                  ?.name ||
                                  "Customer"}
                              </strong>

                              <span>
                                {order.user
                                  ?.email ||
                                  "No email available"}
                              </span>
                            </div>

                          </div>

                          <span
                            className="order-status"
                            style={{
                              color:
                                colors.text,
                              background:
                                colors.bg,
                              borderColor:
                                colors.border,
                            }}
                          >
                            {order.status}
                          </span>

                        </div>

                        <div className="admin-order-bottom">

                          <div>
                            <span className="order-label">
                              Order Total
                            </span>

                            <strong className="order-total">
                              ₹
                              {Number(
                                order.totalAmount ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>
                          </div>

                          <div>
                            <span className="order-label">
                              Items
                            </span>

                            <strong>
                              {order.items
                                ?.length ||
                                0}
                            </strong>
                          </div>

                          <div className="status-control">

                            <span className="order-label">
                              Update Status
                            </span>

                            <select
                              value={
                                order.status
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  order._id,
                                  e.target
                                    .value
                                )
                              }
                            >
                              <option>
                                Pending
                              </option>

                              <option>
                                Confirmed
                              </option>

                              <option>
                                Shipped
                              </option>

                              <option>
                                Delivered
                              </option>

                              <option>
                                Cancelled
                              </option>
                            </select>

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          )}

        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="admin-footer">

          <div className="footer-brand">
            <div className="brand-mark small">
              L
            </div>

            <div>
              <strong>LoopMart</strong>
              <span>
                Keep products in the loop.
              </span>
            </div>
          </div>

          <p>
            Smart shopping. Second life.
          </p>

        </footer>

      </main>

      {/* =========================
          COMPONENT STYLES
      ========================= */}

      <style>{`

        .loopmart-admin {
          min-height: 100vh;
          background: #f5f8f6;
          color: #17201d;
        }

        .loopmart-admin * {
          box-sizing: border-box;
        }

        .loopmart-admin button,
        .loopmart-admin input,
        .loopmart-admin textarea,
        .loopmart-admin select {
          font-family: inherit;
        }

        /* =========================
           HEADER
        ========================= */

        .admin-top-header {
          height: 72px;
          padding: 0 32px;
          background: #ffffff;
          border-bottom: 1px solid #e4ebe7;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #0d4f42;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 900;
        }

        .brand-mark.small {
          width: 34px;
          height: 34px;
          font-size: 1rem;
        }

        .admin-brand strong {
          display: block;
          font-size: 1rem;
          color: #17352e;
        }

        .admin-brand span {
          display: block;
          color: #899691;
          font-size: 0.67rem;
          margin-top: 2px;
        }

        .admin-header-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #61716b;
          font-size: 0.76rem;
          font-weight: 700;
        }

        .online-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 4px #dcfce7;
        }

        /* =========================
           CONTAINER
        ========================= */

        .admin-container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 42px 28px 60px;
        }

        /* =========================
           INTRO
        ========================= */

        .dashboard-intro {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 28px;
        }

        .dashboard-eyebrow,
        .section-eyebrow {
          color: #0d4f42;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 1.8px;
        }

        .dashboard-intro h1 {
          margin: 7px 0 7px;
          font-size: clamp(2rem, 4vw, 2.8rem);
          letter-spacing: -1.5px;
          line-height: 1;
          color: #18231f;
        }

        .dashboard-intro p {
          margin: 0;
          color: #75827d;
          font-size: 0.9rem;
        }

        .dashboard-date {
          padding: 12px 16px;
          background: white;
          border: 1px solid #e2e9e5;
          border-radius: 10px;
          text-align: right;
        }

        .dashboard-date span {
          display: block;
          color: #9aa5a1;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .dashboard-date strong {
          display: block;
          margin-top: 4px;
          color: #0d4f42;
          font-size: 0.8rem;
        }

        /* =========================
           STATS
        ========================= */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e2e9e5;
          border-radius: 14px;
          padding: 18px;
          display: flex;
          gap: 13px;
          align-items: center;
          box-shadow: 0 4px 15px rgba(13, 79, 66, 0.035);
        }

        .stat-icon {
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          border-radius: 11px;
          background: #edf7f3;
          color: #0d4f42;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 800;
        }

        .stat-content span {
          display: block;
          color: #7b8983;
          font-size: 0.68rem;
          font-weight: 650;
        }

        .stat-content strong {
          display: block;
          margin: 3px 0;
          color: #1c2824;
          font-size: 1.25rem;
        }

        .stat-content small {
          display: block;
          color: #a0aaa6;
          font-size: 0.63rem;
        }

        /* =========================
           HERO
        ========================= */

        .hero-section {
          height: 340px;
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          background: #0d332c;
          margin-bottom: 48px;
          box-shadow: 0 18px 40px rgba(13, 79, 66, 0.13);
        }

        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          transition: opacity 700ms ease;
        }

        .hero-slide.hero-active {
          opacity: 1;
          pointer-events: auto;
        }

        .hero-content {
          max-width: 660px;
          padding: 35px 75px;
          color: white;
        }

        .hero-eyebrow {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 5px;
          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.18);
          font-size: 0.63rem;
          font-weight: 800;
          letter-spacing: 1.6px;
          margin-bottom: 13px;
        }

        .hero-content h2 {
          margin: 0 0 11px;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.06;
          letter-spacing: -1.5px;
        }

        .hero-content p {
          margin: 0;
          max-width: 520px;
          color: rgba(255,255,255,0.84);
          font-size: 0.9rem;
          line-height: 1.7;
        }

        .hero-action {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          padding: 10px 15px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
          color: white;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 750;
          backdrop-filter: blur(8px);
          transition: 0.2s;
        }

        .hero-action:hover {
          background: white;
          color: #0d4f42;
        }

        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(0,0,0,0.22);
          color: white;
          font-size: 29px;
          line-height: 1;
          cursor: pointer;
          z-index: 3;
          backdrop-filter: blur(6px);
        }

        .hero-arrow:hover {
          background: rgba(255,255,255,0.16);
        }

        .hero-prev {
          left: 18px;
        }

        .hero-next {
          right: 18px;
        }

        .hero-dots {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          display: flex;
          gap: 7px;
          z-index: 5;
        }

        .hero-dot {
          width: 7px;
          height: 7px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: white;
          opacity: 0.45;
          cursor: pointer;
          transition: 0.25s;
        }

        .hero-dot.active {
          width: 26px;
          opacity: 1;
        }

        /* =========================
           SECTIONS
        ========================= */

        .categories-section {
          margin-bottom: 55px;
        }

        .section-header {
          margin-bottom: 17px;
        }

        .section-header h2,
        .management-header h2 {
          margin: 6px 0 4px;
          font-size: 1.5rem;
          letter-spacing: -0.5px;
        }

        .section-header p,
        .management-header p {
          margin: 0;
          color: #7b8883;
          font-size: 0.8rem;
        }

        /* =========================
           CATEGORIES
        ========================= */

        .category-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 10px;
        }

        .category-card {
          position: relative;
          min-height: 115px;
          padding: 13px 7px;
          background: white;
          border: 1px solid #e1e9e5;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: 0.2s;
        }

        .category-card:hover {
          border-color: #9ac6ba;
          transform: translateY(-3px);
          box-shadow: 0 10px 22px rgba(13,79,66,0.08);
        }

        .category-icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #f0f6f3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }

        .category-card strong {
          color: #35423d;
          font-size: 0.72rem;
        }

        .category-arrow {
          position: absolute;
          right: 8px;
          top: 8px;
          color: #b3bdb9;
          font-size: 0.7rem;
        }

        /* =========================
           ABOUT
        ========================= */

        .about-section {
          min-height: 430px;
          margin-bottom: 60px;
          padding: 55px 60px;
          border-radius: 22px;
          background: #0d4f42;
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
          color: white;
        }

        .about-section::before {
          content: "";
          position: absolute;
          width: 500px;
          height: 500px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          right: -190px;
          top: -180px;
        }

        .about-section::after {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 50%;
          left: -150px;
          bottom: -190px;
        }

        .about-content {
          position: relative;
          z-index: 2;
        }

        .section-eyebrow.light {
          color: #a9d9ca;
        }

        .about-content h2 {
          max-width: 620px;
          margin: 9px 0 20px;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.08;
          letter-spacing: -1.5px;
        }

        .about-content h2 span {
          color: #9fe1ce;
        }

        .about-content p {
          max-width: 590px;
          margin: 0 0 13px;
          color: rgba(255,255,255,0.72);
          font-size: 0.85rem;
          line-height: 1.8;
        }

        .about-features {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 25px;
        }

        .about-features div {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 11px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
        }

        .about-features strong {
          width: 25px;
          height: 25px;
          border-radius: 6px;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a9e0d1;
          font-size: 0.8rem;
        }

        .about-features span {
          color: rgba(255,255,255,0.75);
          font-size: 0.65rem;
          font-weight: 650;
        }

        .about-visual {
          position: relative;
          height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .about-logo-card {
          width: 235px;
          height: 275px;
          border-radius: 28px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0,0,0,0.12);
        }

        .about-logo {
          width: 66px;
          height: 66px;
          border-radius: 18px;
          background: white;
          color: #0d4f42;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 17px;
        }

        .about-logo-card h3 {
          margin: 0;
          font-size: 1.55rem;
        }

        .about-logo-card p {
          margin: 10px 0 0;
          color: rgba(255,255,255,0.65);
          font-size: 0.75rem;
          line-height: 1.7;
        }

        .about-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .circle-one {
          width: 310px;
          height: 310px;
        }

        .circle-two {
          width: 370px;
          height: 370px;
        }

        .floating-card {
          position: absolute;
          padding: 10px 13px;
          border-radius: 9px;
          background: white;
          color: #24312c;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }

        .floating-card strong {
          width: 27px;
          height: 27px;
          border-radius: 7px;
          background: #edf7f3;
          color: #0d4f42;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }

        .floating-card span {
          font-size: 0.65rem;
          font-weight: 800;
        }

        .floating-card-one {
          top: 35px;
          left: 0;
        }

        .floating-card-two {
          bottom: 35px;
          right: 0;
        }

        /* =========================
           MANAGEMENT
        ========================= */

        .management-section {
          margin-bottom: 50px;
        }

        .management-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 25px;
        }

        .management-tabs {
          display: flex;
          gap: 5px;
          padding: 4px;
          background: #e9efec;
          border-radius: 10px;
        }

        .management-tab {
          border: 0;
          background: transparent;
          color: #70807a;
          padding: 8px 13px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 0.72rem;
          font-weight: 750;
        }

        .management-tab span {
          margin-left: 5px;
          opacity: 0.65;
        }

        .management-tab.active {
          background: white;
          color: #0d4f42;
          box-shadow: 0 2px 7px rgba(0,0,0,0.05);
        }

        .management-layout {
          display: grid;
          grid-template-columns: minmax(340px, 0.8fr) minmax(400px, 1.2fr);
          gap: 24px;
          align-items: start;
        }

        /* =========================
           FORM
        ========================= */

        .product-form-card {
          background: white;
          border: 1px solid #e0e8e4;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 5px 20px rgba(13,79,66,0.035);
        }

        .form-card-header {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 20px;
        }

        .form-card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #edf7f3;
          color: #0d4f42;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          font-weight: 800;
        }

        .form-card-header span {
          color: #8a9691;
          font-size: 0.58rem;
          font-weight: 850;
          letter-spacing: 1.3px;
        }

        .form-card-header h3 {
          margin: 3px 0 0;
          font-size: 1.05rem;
        }

        .form-error {
          padding: 10px 12px;
          margin-bottom: 16px;
          border-radius: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 0.72rem;
        }

        .form-error strong {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #dc2626;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .product-form label {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .product-form label > span {
          color: #45534d;
          font-size: 0.7rem;
          font-weight: 750;
        }

        .product-form input,
        .product-form textarea,
        .product-form select,
        .status-control select {
          width: 100%;
          border: 1px solid #dce5e1;
          border-radius: 8px;
          padding: 10px 11px;
          outline: none;
          background: #fbfcfc;
          color: #293630;
          font-size: 0.78rem;
          transition: 0.18s;
        }

        .product-form textarea {
          resize: vertical;
          min-height: 100px;
          line-height: 1.5;
        }

        .product-form input:focus,
        .product-form textarea:focus,
        .product-form select:focus,
        .status-control select:focus {
          border-color: #76ad9f;
          background: white;
          box-shadow: 0 0 0 3px rgba(13,79,66,0.07);
        }

        .price-input {
          position: relative;
        }

        .price-input span {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          color: #0d4f42;
          font-weight: 800;
          font-size: 0.8rem;
          z-index: 2;
        }

        .price-input input {
          padding-left: 27px;
        }

        .form-two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .upload-zone {
          min-height: 105px;
          border: 2px dashed #cddbd5;
          border-radius: 10px;
          background: #f9fcfa;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: 0.2s;
        }

        .upload-zone:hover {
          border-color: #70a99a;
          background: #f3faf7;
        }

        .upload-zone input {
          display: none;
        }

        .upload-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #e7f3ee;
          color: #0d4f42;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          margin-bottom: 2px;
        }

        .upload-zone strong {
          color: #44534d;
          font-size: 0.7rem;
        }

        .upload-zone span {
          color: #9aa6a1;
          font-size: 0.6rem;
        }

        .form-buttons {
          display: flex;
          gap: 8px;
          margin-top: 3px;
        }

        .primary-button,
        .secondary-button {
          min-height: 41px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.72rem;
          font-weight: 800;
          transition: 0.2s;
        }

        .primary-button {
          flex: 1;
          border: 0;
          background: #0d4f42;
          color: white;
        }

        .primary-button:hover {
          background: #093c32;
        }

        .primary-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .secondary-button {
          padding: 0 17px;
          border: 1px solid #d6e0dc;
          background: white;
          color: #52605b;
        }

        .secondary-button:hover {
          background: #f6f9f7;
        }

        /* =========================
           THUMBNAILS
        ========================= */

        .thumb-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 8px;
        }

        .thumb-wrapper {
          position: relative;
          width: 58px;
          height: 58px;
        }

        .thumb-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 7px;
          border: 1px solid #dce5e1;
        }

        .thumb-remove {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 0;
          background: #dc2626;
          color: white;
          cursor: pointer;
          font-size: 11px;
          line-height: 1;
        }

        /* =========================
           LISTINGS
        ========================= */

        .listings-section {
          min-width: 0;
        }

        .listings-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 13px;
        }

        .listings-header h3 {
          margin: 5px 0 3px;
          font-size: 1.1rem;
        }

        .listings-header p {
          margin: 0;
          color: #89958f;
          font-size: 0.7rem;
        }

        .listing-count {
          padding: 7px 10px;
          border-radius: 20px;
          background: #edf7f3;
          color: #0d4f42;
          font-size: 0.65rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .admin-listings {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .admin-product-row {
          background: white;
          border: 1px solid #e2e9e5;
          border-radius: 12px;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 11px;
          transition: 0.18s;
        }

        .admin-product-row:hover {
          border-color: #b9d5cb;
          box-shadow: 0 7px 18px rgba(13,79,66,0.06);
        }

        .admin-product-image {
          width: 68px;
          height: 68px;
          flex-shrink: 0;
          border-radius: 9px;
          background: #f4f7f5;
          overflow: hidden;
        }

        .admin-product-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .admin-product-details {
          flex: 1;
          min-width: 0;
        }

        .product-title-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .product-title-row h4 {
          margin: 0;
          color: #27332e;
          font-size: 0.78rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-status {
          flex-shrink: 0;
          padding: 3px 6px;
          border-radius: 20px;
          font-size: 0.52rem;
          font-weight: 800;
        }

        .product-status.available {
          background: #ecfdf5;
          color: #15803d;
        }

        .product-status.sold {
          background: #fef2f2;
          color: #dc2626;
        }

        .product-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin: 6px 0;
          color: #8d9994;
          font-size: 0.6rem;
        }

        .product-price {
          color: #0d4f42;
          font-size: 0.78rem;
        }

        .product-actions {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .edit-button,
        .delete-button {
          min-width: 58px;
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.58rem;
          font-weight: 750;
        }

        .edit-button {
          border: 1px solid #cce0d9;
          background: #f2f9f6;
          color: #0d4f42;
        }

        .delete-button {
          border: 1px solid #f2d0d0;
          background: #fff8f8;
          color: #dc2626;
        }

        .edit-button:hover {
          background: #e6f4ef;
        }

        .delete-button:hover {
          background: #feecec;
        }

        .no-listings {
          min-height: 280px;
          border: 1px dashed #cddad5;
          border-radius: 14px;
          background: rgba(255,255,255,0.55);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty-box {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #eaf4f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 12px;
        }

        .no-listings h4 {
          margin: 0;
          font-size: 0.9rem;
        }

        .no-listings p {
          margin: 5px 0 0;
          color: #8b9792;
          font-size: 0.7rem;
        }

        /* =========================
           ORDERS
        ========================= */

        .orders-admin-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .admin-order-card {
          background: white;
          border: 1px solid #e1e9e5;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 4px 15px rgba(13,79,66,0.035);
        }

        .admin-order-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 14px;
          border-bottom: 1px solid #edf1ef;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .customer-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #eaf4f0;
          color: #0d4f42;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 850;
        }

        .customer-info strong {
          display: block;
          font-size: 0.78rem;
        }

        .customer-info span {
          display: block;
          color: #8d9994;
          font-size: 0.64rem;
          margin-top: 3px;
        }

        .order-status {
          border: 1px solid;
          border-radius: 20px;
          padding: 6px 11px;
          font-size: 0.58rem;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-order-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr 1.4fr;
          gap: 15px;
          align-items: end;
          padding-top: 15px;
        }

        .order-label {
          display: block;
          color: #929d98;
          font-size: 0.6rem;
          margin-bottom: 5px;
        }

        .admin-order-bottom strong {
          color: #26332e;
          font-size: 0.82rem;
        }

        .order-total {
          color: #0d4f42 !important;
          font-size: 1rem !important;
        }

        .status-control select {
          max-width: 190px;
        }

        .no-orders {
          min-height: 300px;
          background: white;
          border: 1px dashed #cddbd5;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .no-orders > div {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #edf7f3;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 12px;
        }

        .no-orders h3 {
          margin: 0;
        }

        .no-orders p {
          margin: 6px 0 0;
          color: #8b9792;
          font-size: 0.75rem;
        }

        /* =========================
           FOOTER
        ========================= */

        .admin-footer {
          margin-top: 70px;
          padding-top: 22px;
          border-top: 1px solid #dfe8e4;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .footer-brand strong {
          display: block;
          font-size: 0.75rem;
          color: #3d4a45;
        }

        .footer-brand span {
          display: block;
          margin-top: 2px;
          color: #9aa5a1;
          font-size: 0.58rem;
        }

        .admin-footer p {
          color: #9aa5a1;
          font-size: 0.65rem;
          margin: 0;
        }

        /* =========================
           RESPONSIVE
        ========================= */

        @media (max-width: 1000px) {

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .category-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .management-layout {
            grid-template-columns: 1fr;
          }

          .product-form-card {
            position: static;
          }

          .about-section {
            grid-template-columns: 1fr;
          }

          .about-visual {
            min-height: 330px;
          }

        }

        @media (max-width: 700px) {

          .admin-top-header {
            height: 64px;
            padding: 0 17px;
          }

          .admin-header-label {
            display: none;
          }

          .admin-container {
            padding: 30px 15px 45px;
          }

          .dashboard-intro {
            align-items: flex-start;
            flex-direction: column;
          }

          .dashboard-date {
            text-align: left;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }

          .stat-card {
            padding: 13px;
          }

          .stat-icon {
            width: 37px;
            height: 37px;
            font-size: 1rem;
          }

          .stat-content strong {
            font-size: 1rem;
          }

          .stat-content span {
            font-size: 0.6rem;
          }

          .stat-content small {
            display: none;
          }

          .hero-section {
            height: 350px;
            border-radius: 15px;
          }

          .hero-content {
            padding: 30px 40px;
          }

          .hero-content h2 {
            font-size: 2rem;
          }

          .hero-arrow {
            width: 34px;
            height: 34px;
            font-size: 23px;
          }

          .category-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .category-card {
            min-height: 95px;
          }

          .category-icon {
            width: 37px;
            height: 37px;
            font-size: 1.1rem;
          }

          .about-section {
            padding: 40px 25px;
            border-radius: 17px;
          }

          .about-visual {
            height: 310px;
          }

          .management-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .management-tabs {
            width: 100%;
          }

          .management-tab {
            flex: 1;
          }

          .admin-order-bottom {
            grid-template-columns: 1fr 1fr;
          }

          .status-control {
            grid-column: 1 / -1;
          }

          .status-control select {
            max-width: none;
          }

        }

        @media (max-width: 480px) {

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .stat-card {
            gap: 8px;
          }

          .stat-icon {
            display: none;
          }

          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-section {
            height: 390px;
          }

          .hero-content {
            padding: 30px;
          }

          .hero-content h2 {
            font-size: 1.8rem;
          }

          .hero-content p {
            font-size: 0.78rem;
          }

          .about-content h2 {
            font-size: 2rem;
          }

          .about-features {
            flex-direction: column;
          }

          .about-visual {
            height: 280px;
          }

          .about-logo-card {
            width: 200px;
            height: 245px;
          }

          .circle-one {
            width: 260px;
            height: 260px;
          }

          .circle-two {
            width: 310px;
            height: 310px;
          }

          .floating-card {
            padding: 7px 9px;
          }

          .floating-card-one {
            left: -5px;
          }

          .floating-card-two {
            right: -5px;
          }

          .form-two-columns {
            grid-template-columns: 1fr;
          }

          .admin-product-row {
            align-items: flex-start;
          }

          .admin-product-image {
            width: 55px;
            height: 55px;
          }

          .product-actions {
            margin-left: auto;
          }

          .edit-button,
          .delete-button {
            min-width: 50px;
            padding: 5px;
          }

          .admin-order-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .admin-order-bottom {
            grid-template-columns: 1fr 1fr;
          }

          .admin-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

        }

      `}</style>
    </div>
  );
}

/* =========================
   FORM FIELD
========================= */

function Field({ label, children }) {
  return (
    <label>
      <span>{label}</span>
      {children}
    </label>
  );
}

/* =========================
   THUMB GRID
========================= */

function ThumbGrid({ children }) {
  return (
    <div className="thumb-grid">
      {children}
    </div>
  );
}

/* =========================
   THUMB
========================= */

function Thumb({
  src,
  onRemove,
  label,
}) {
  return (
    <div className="thumb-wrapper">

      <img
        src={src}
        alt={label}
      />

      <button
        type="button"
        className="thumb-remove"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
      >
        ×
      </button>

    </div>
  );
}