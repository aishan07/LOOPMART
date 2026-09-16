import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loadingRelated, setLoadingRelated] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);

        setProduct(data);
        setActiveImage(0);
        setQuantity(1);

        // Fetch products for the recommendation section
        try {
          const { data: products } = await api.get("/products", {
            params: {
              category: data.category,
            },
          });

          const filtered = products
            .filter((item) => item._id !== data._id)
            .slice(0, 4);

          setRelatedProducts(filtered);
        } catch (err) {
          console.error("Related products error:", err);
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error("Product error:", err);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="product-loading">
        <div className="product-loader"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : [
          "https://placehold.co/900x700/f3f3ef/555?text=No+Image",
        ];

  const price = Number(product.price || 0);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    navigate("/cart");
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="product-detail-page">

      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <div className="product-container">

        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>Home</span>
          <span className="breadcrumb-arrow">/</span>

          <span>{product.category}</span>

          <span className="breadcrumb-arrow">/</span>

          <strong>{product.title}</strong>
        </div>


        {/* ===================================================
            MAIN PRODUCT
        =================================================== */}

        <section className="product-main">

          {/* IMAGE GALLERY */}

          <div className="product-gallery">

            <div className="main-product-image">

              <img
                src={images[activeImage]}
                alt={`${product.title} ${activeImage + 1}`}
              />

              {product.condition && (
                <div className="gallery-condition">
                  {product.condition}
                </div>
              )}

              <div className="image-counter">
                {activeImage + 1} / {images.length}
              </div>
            </div>


            {/* THUMBNAILS */}

            {images.length > 1 && (
              <div className="product-thumbnails">

                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${
                      activeImage === index ? "active" : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.title} thumbnail ${index + 1}`}
                    />
                  </button>
                ))}

              </div>
            )}

          </div>


          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="product-information">

            <div className="product-category-label">
              {product.category}
            </div>

            <h1>{product.title}</h1>

            <div className="product-rating-row">

              <span className="rating-stars">
                ★★★★★
              </span>

              <span className="rating-text">
                Pre-loved quality
              </span>

            </div>


            <div className="product-detail-price">
              ₹{price.toLocaleString("en-IN")}
            </div>

            <p className="price-note">
              Cash on delivery available
            </p>


            <div className="product-divider"></div>


            {/* DESCRIPTION */}

            <div className="product-description">

              <h3>About this item</h3>

              <p>
                {product.description ||
                  "A quality pre-loved item ready for its next owner."}
              </p>

            </div>


            {/* PRODUCT DETAILS */}

            <div className="product-details-grid">

              <div className="detail-box">
                <span>Condition</span>
                <strong>
                  {product.condition || "Good"}
                </strong>
              </div>

              <div className="detail-box">
                <span>Category</span>
                <strong>
                  {product.category || "Other"}
                </strong>
              </div>

              <div className="detail-box">
                <span>Availability</span>
                <strong className="available">
                  {product.isSold ? "Sold" : "Available"}
                </strong>
              </div>

              <div className="detail-box">
                <span>Stock</span>
                <strong>
                  {product.stock ?? "Available"}
                </strong>
              </div>

            </div>


            {/* QUANTITY */}

            {!product.isSold && (
              <div className="quantity-section">

                <span>Quantity</span>

                <div className="quantity-control">

                  <button
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    onClick={() =>
                      setQuantity((q) => q + 1)
                    }
                  >
                    +
                  </button>

                </div>

              </div>
            )}


            {/* BUTTONS */}

            {!product.isSold ? (
              <div className="product-actions">

                <button
                  className="add-cart-button"
                  onClick={handleAddToCart}
                >
                  <span>Add to Cart</span>
                  <span>→</span>
                </button>

                <button
                  className="buy-now-button"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>

              </div>
            ) : (
              <div className="sold-product">
                This item has already been sold.
              </div>
            )}


            {/* DELIVERY */}

            <div className="delivery-box">

              <div className="delivery-item">
                <div className="delivery-icon">
                  ✓
                </div>

                <div>
                  <strong>Cash on Delivery</strong>
                  <span>Pay when your order arrives</span>
                </div>
              </div>


              <div className="delivery-item">

                <div className="delivery-icon">
                  ♻
                </div>

                <div>
                  <strong>A second life, less waste</strong>
                  <span>Give quality items another home</span>
                </div>

              </div>


              <div className="delivery-item">

                <div className="delivery-icon">
                  ↻
                </div>

                <div>
                  <strong>Carefully selected</strong>
                  <span>Every item gets a new beginning</span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            STORY / BRAND SECTION
        =================================================== */}

        <section className="product-story">

          <div className="story-line"></div>

          <div>
            <span>THE LOOPMART WAY</span>

            <h2>
              Good things deserve
              <br />
              another beginning.
            </h2>
          </div>

          <p>
            LoopMart makes it easier to discover useful,
            quality products that already have a story.
            Instead of letting good things go to waste,
            give them a new place in your life.
          </p>

        </section>


        {/* ===================================================
            RELATED PRODUCTS
        =================================================== */}

        <section className="related-section">

          <div className="related-heading">

            <div>
              <span>KEEP EXPLORING</span>

              <h2>
                You may also like
              </h2>
            </div>

            {relatedProducts.length > 0 && (
              <button
                onClick={() => navigate("/")}
                className="view-all-button"
              >
                View all →
              </button>
            )}

          </div>


          {loadingRelated ? (
            <div className="related-loading">
              Finding similar items...
            </div>
          ) : relatedProducts.length === 0 ? (
            <div className="related-empty">
              <p>
                Explore more pre-loved products from LoopMart.
              </p>

              <button
                onClick={() => navigate("/")}
              >
                Browse products →
              </button>
            </div>
          ) : (
            <div className="related-grid">

              {relatedProducts.map((item) => (
                <div
                  className="related-product"
                  key={item._id}
                >
                  <ProductCard product={item} />
                </div>
              ))}

            </div>
          )}

        </section>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="product-footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <div className="footer-logo-mark">
              L
            </div>

            <div>
              <strong>LOOPMART</strong>

              <span>
                Giving good things another beginning.
              </span>
            </div>

          </div>

          <p>
            © {new Date().getFullYear()} LoopMart
          </p>

        </div>

      </footer>

    </div>
  );
}