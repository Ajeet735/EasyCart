import React, {  useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import "./GetAllProducts.css";
import cartIcon from "../../assets/icons/cart.png"
import { Context } from "../../main";

const GetAllProducts = () => {
  const [products, setProducts] = useState([]);
  const {user, setCartCount} = useContext(Context)


  useEffect(() => {
    axios
      .get("http://localhost:8000/users/getAllproducts", {
        withCredentials: true,
      })
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching products:",
          err.response?.data || err.message
        );
      });
  }, []);

  const handleAddToCart = async (productId) => {
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
console.log(response.data);
    alert("Product added to cart");
    setCartCount(prev => prev + 1);
    } else if (response.status === 409) {
      alert("product is already in cart")
    }
    
  } catch (error) {
    console.error("Add to cart failed!", error.response?.data || error.message);
    alert("Failed to add product to cart");
  }
};




  return (
    <div className="products-Wrapper">
      <h2 style={{ textAlign: "left",  color: "#364153" }}>
        All Products
      </h2>
      <div className="products-container">
        {products.map((product, index) => {
          return (
            <div className="product-card" key={index}>
              <div className="product-image-wrapper">
                <img
                  src={`http://localhost:8000/public/${product.image}`}
                  alt={product.product_name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/100?text=No+Image";
                  }}
                />
              </div>
              <p>{product.category}</p>
              <h4>{product.product_name}</h4>
              <div className="stars">
                {Array.from({ length: product.rating }, (_, i) => (
                  <FaStar key={i} color="#44AE7C" />
                ))}
                <span style={{ marginLeft: "6px", color: "#333" }}>
                  ({product.rating})
                </span>
              </div>

              <div style={{display:"flex", alignItems: 'center', gap: '70px'}}>
              <span style={{color:"#44AE7C", fontWeight:"bold"}}>${product.price}</span>
              <button
              onClick={() => 
                
                handleAddToCart(product.id)} 
              style={{
                height:'30px',
                 width:'70px',
                  borderRadius:'4px',
                  color:'#44AE7C',
                  backgroundColor:'#EDF8F3',
                  cursor: 'pointer',
                  border:'1px solid #44AE7C',
                  display:'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px'
                  }}>
                    <span><img src={cartIcon} alt="" style={{ height:'15px', width:'15px'}}></img></span>
                    Add
                    </button>
              
              </div>

            
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default GetAllProducts;
