import React, { useEffect, useState, useContext } from "react";
import API from "../../api";
import { Context } from "../../main";
import "./ProductsDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import cartIcon from "../../assets/icons/cart.png";
import { BASE_URL } from "../../config";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { user, setCartCount } = useContext(Context);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    API
      .get(`/users/getproduct/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("Fetched product details:", res.data);
        setProduct(res.data);

       API
          .get(`/users/productbycategory`, {
            params: { category: res.data.category },
            withCredentials: true,
          })
          .then((relatedRes) => {
            console.log("Fetched related products:", relatedRes.data);
            setRelatedProducts(relatedRes.data);
          });
      })
      .catch((err) => console.error("Product fetch failed:", err));
  }, [id]);

   useEffect(() => {
    console.log("BASE_URL:", BASE_URL);
  }, []);

  const handleAddToCart = async (productId) => {
    console.log("Calling handleAddToCart...");
    console.log("Received productId:", productId);

    if (!productId) {
      alert("Product ID is missing!");
      return;
    }

    try {
      const response = await API.post(
        "/addtocart",
        {},
        {
          params: {
            id: productId,
            userID: user.user_id,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Product added:", response.data);
        alert("Product added to cart");
        setCartCount((prev) => prev + 1);
      } else if (response.status === 409) {
        alert("Product is already in cart");
      }
    } catch (error) {
      console.error("Add to cart failed:", error.response?.data || error.message);
      alert("Failed to add product to cart");
    }
  };

  const handleBuyNow = () => {
    alert("Redirecting to buy now flow...");
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-details-wrapper">
      <div className="product-content">
        <div className="image-box">
          <img
            src={`${BASE_URL}/public//${product.image}`}
            alt={product.product_name}
          />
        </div>

        <div className="product-details">
          <h2 style={{ color: "#364153" }}>{product.product_name}</h2>
          <p style={{ color: "#364153" }}>
            <strong>MRP: ${product.price}</strong>
          </p>

          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                fontSize: "15px",
                color: "#44AE7C",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>{i < product.rating ? "★" : "☆"}</span>
                ))}
              </span>
              <span style={{ color: "#364153" }}>({product.rating})</span>
            </div>
          </div>

          <div className="product-buttons">
            <button
              onClick={() => handleAddToCart(product.id)} // ✅ FIXED here
              className="add-to-cart"
            >
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="buy-now">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products-wrapper">
          <div className="related-products-container">
            <h3 className="products-heading">
              Related <span className="heading">Products</span>
            </h3>
            <div className="related-products-list">
              {relatedProducts.map((prod) => {
                const prodId = prod.id;
                console.log("Related Product ID:", prodId); // ✅ Will no longer be undefined

                return (
                  <div key={prodId} className="related-product-card">
                    <div className="product-image-wrapper">
                      <img
                        src={`${BASE_URL}/public/${prod.image}`}
                        alt={prod.product_name}
                        onClick={() => navigate(`/product/${prodId}`)}
                        style={{ cursor: "pointer" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>
                    <p className="category">{prod.category}</p>
                    <h4 className="name">{prod.product_name}</h4>
                    <div className="stars">
                      {Array.from({ length: prod.rating }, (_, i) => (
                        <span key={`${prodId}-star-${i}`} style={{ color: "#44AE7C" }}>
                          ★
                        </span>
                      ))}
                      <span style={{ color: "#364153" }}>({prod.rating})</span>
                    </div>

                    <div className="card-footer">
                      <span style={{ color: "#44AE7C", fontWeight: "bold" }}>
                        ${prod.price}
                      </span>
                      <button onClick={() => handleAddToCart(prodId)}>
                        <img
                          src={cartIcon}
                          alt="cart"
                          style={{ height: "15px", width: "15px" }}
                        />
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <button
        className="seemore"
        onClick={() => navigate(`/users/getallProducts`)}
      >
        See More
      </button>
    </div>
  );
};

export default ProductDetails;
