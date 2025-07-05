import React, { useContext } from "react";
import API from "../../api";
import { Context } from "../../main";
import cartIcon from "../../assets/icons/cart.png";
import { toast } from "react-hot-toast";

const AddToCartButton = ({ productId }) => {
  const { user, setCartCount } = useContext(Context);

  // Make sure this is imported

const handleAddToCart = async () => {
  console.log("Adding product to cart with ID:", productId);

  if (!productId) {
    toast.error("Product ID is missing!");
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
      toast.success("🛒 Product added to cart!");

      // Try fetching updated cart count separately
      try {
        const res = await API.get("/users/cart-count", {
          withCredentials: true,
        });
        setCartCount(res.data.count || 0);
      } catch (countErr) {
        console.warn("Product added, but failed to update cart count:", countErr);
      }

    } else if (response.status === 409) {
      toast.error("⚠️ Product is already in the cart.");
    }
  } catch (error) {
    console.error("Add to cart failed:", error.response?.data || error.message);
    toast.error("❌ Failed to add product to cart");
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
