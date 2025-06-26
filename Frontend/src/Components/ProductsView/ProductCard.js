import React from "react";
import { useNavigate } from "react-router-dom";
import AddProductsCart from "./AddProductCart";


const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={`http://localhost:8000/public/${product.image}`}
          alt={product.product_name}
          onClick={() => navigate(`/product/${product.id}`)}
          style={{ cursor: "pointer" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/100?text=No+Image";
          }}
        />
      </div>

      <p>{product.category}</p>
      <h4>{product.product_name}</h4>

      <div
        className="stars"
        style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "14px" }}
      >
        {Array.from({ length: product.rating }, (_, i) => (
          <span key={i} style={{ color: "#44AE7C" }}>
            ★
          </span>
        ))}
        <span style={{ color: "#364153" }}>({product.rating})</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "90px" }}>
        <span style={{ color: "#44AE7C", fontWeight: "bold" }}>${product.price}</span>
        <AddProductsCart productId={product.id} />
      </div>
    </div>
  );
};

export default ProductCard;
