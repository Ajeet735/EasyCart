import React, { useEffect, useContext, useState, useCallback } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import "./CartPage.css";
import CheckoutSection from "../Model/CheckoutSection";

const CartPage = () => {
  const { user } = useContext(Context);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const fetchCartItems = useCallback(async () => {
    if (!user) return;
    try {
      const res = await API.get("http://localhost:8000/listcart", {
        params: { id: user.user_id },
        withCredentials: true,
      });
      setCartItems(res.data.usercart);
    } catch (err) {
      console.error("Failed to load cart:", err.response?.data || err.message);
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    const calculatedTotal = cartItems.reduce((acc, item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 1);
      return acc + price * quantity;
    }, 0);

    setTotal(calculatedTotal);
  }, [cartItems]);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      console.log("Sending:", {
        userId: user.user_id,
        productId,
        quantity: newQuantity,
      });
      await API.put(
        "http://localhost:8000/update-cart-quantity",
        {
          userId: user.user_id,
          productId,
          quantity: newQuantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      fetchCartItems();
    } catch (err) {
      console.error(
        "Failed to update quantity:",
        err.response?.data || err.message
      );
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await API.delete("http://localhost:8000/removeitem", {
        params: {
          id: productId,
          userID: user.user_id,
        },
        withCredentials: true,
      });
      fetchCartItems(); // refresh cart after deletion
    } catch (err) {
      console.error(
        "Failed to remove item:",
        err.response?.data || err.message
      );
    }
  };

return (
  <div className="cart-container">
    <h2 style={{ color: "#364153" }}>
      Shopping Cart
      {cartItems.length > 0 && (
        <span
          style={{ marginLeft: "10px", fontSize: "1rem", color: "#4FBF8B" }}
        >
          ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})
        </span>
      )}
    </h2>

 
    <div className="cart-content">
      <div className="cart-left" >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingBottom: "12px",
            color: "#364153",
            fontWeight: "bold",
          }}
        >
          <div style={{ width: "300px", color: "#364153" }}>
            Product Details
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "250px",
              marginLeft: "15%",
              color: "#364153",
            }}
          >
            <div>Subtotal</div>
            <div>Action</div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "12px 0",
                }}
              >
                {/* Image Box */}
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#fff",
                  }}
                >
                  <img
                    src={`http://localhost:8000/public/${item.image}`}
                    alt={item.product_name}
                    onClick={() => {
                      const productId =
                        item.product_id || item.Product_ID || item._id;
                      console.log("Navigating to product with ID:", productId);
                      if (productId) {
                        navigate(`/product/${productId}`);
                      } else {
                        console.warn(
                          "No valid product ID found for cart item:",
                          item
                        );
                      }
                    }}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "contain",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/90?text=No+Image";
                    }}
                  />
                </div>

                {/* Product details */}
                <div style={{ width: "300px" }}>
                  <h4 style={{ marginBottom: "6px", color: "#364153" }}>
                    {item.product_name}
                  </h4>
                  <p style={{ margin: "4px 0", color: "#364153" }}>
                    Weight: N/A
                  </p>
                  <div style={{ margin: "4px 0", color: "#364153" }}>
                    Quantity:{" "}
                    <select
                      color="#364153"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product_id || item.Product_ID,
                          parseInt(e.target.value)
                        )
                      }
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price & Action */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "220px",
                    
                    marginTop: "4px",
                  }}
                >
                  <div style={{ color: "#364153" }}>
                    ${Number(item.price || 0) * Number(item.quantity || 1)}
                  </div>

                  <div style={{ color: "#364153" }}>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "red",
                      }}
                      onClick={() =>
                        handleRemoveItem(item.product_id || item.Product_ID)
                      }
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="cart-right">
        <CheckoutSection cartItems={cartItems} total={total} />
      </div>
    </div>
  </div>
);
};

export default CartPage;
