import React, { useContext } from "react";
import axios from "axios";
import { Context } from "../../main";
import cartIcon from "../../assets/icons/cart.png";

const AddToCartButton = ({ productId }) => {
  const { user, setCartCount } = useContext(Context);

  const handleAddToCart = async () => {
    console.log("Adding product to cart with ID:", productId);

    if (!productId) {
      alert("Product ID is missing!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/addtocart",
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

  return (
    <button
      onClick={handleAddToCart}
      style={{
        height: "30px",
        width: "70px",
        borderRadius: "4px",
        color: "#44AE7C",
        backgroundColor: "#EDF8F3",
        cursor: "pointer",
        border: "1px solid #44AE7C",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <img src={cartIcon} alt="Add to Cart" style={{ height: "15px", width: "15px" }} />
      Add
    </button>
  );
};

export default AddToCartButton;
