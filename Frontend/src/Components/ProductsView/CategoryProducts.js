import React, { useEffect, useState ,useContext,} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CategoryProducts.css";
import cartIcon from "../../assets/icons/cart.png";
import { Context } from "../../main";
import "../ProductsView/GetAllProducts.css";


const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, setCartCount } = useContext(Context);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/users/productbycategory?category=${category}`
        );
        setProducts(res.data);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (products.length === 0)
    return <div>No products found in "{category}"</div>;

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
          setCartCount((prev) => prev + 1);
        } else if (response.status === 409) {
          alert("product is already in cart");
        }
      } catch (error) {
        console.error(
          "Add to cart failed!",
          error.response?.data || error.message
        );
        alert("Failed to add product to cart");
      }
    };
  return (
    <div className="category-products-page">
      <h2>Products in {category}</h2>
    <div className="products-container">
         {products.map((product, index) => {
           return (
             <div className="product-card" key={index}>
               <div className="product-image-wrapper">
                 <img
                   src={`http://localhost:8000/public/${product.image}`}
                   alt={product.product_name}
                   onClick={() => navigate(`/product/${product.id}`)}
                   style={{ cursor: "pointer" }}
                   onError={(e) => {
                     e.target.onerror = null;
                     e.target.src =
                       "https://via.placeholder.com/100?text=No+Image";
                   }}
                 />
               </div>
               <p>{product.category}</p>
               <h4>{product.product_name}</h4>
               <div
                 className="stars"
                 style={{
                   display: "flex",
                   alignItems: "center",
                   gap: "5px",
                   fontSize: "14px",
                 }}
               >
                 {Array.from({ length: product.rating }, (_, i) => (
                   <span key={i} style={{ color: "#44AE7C" }}>
                     ★
                   </span>
                 ))}
                 <span style={{ color: "#364153" }}>({product.rating})</span>
               </div>
 
               <div
                 style={{ display: "flex", alignItems: "center", gap: "90px" }}
               >
                 <span style={{ color: "#44AE7C", fontWeight: "bold" }}>
                   ${product.price}
                 </span>
                 <button
                   onClick={() => handleAddToCart(product.id)}
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
                   <span>
                     <img
                       src={cartIcon}
                       alt=""
                       style={{ height: "15px", width: "15px" }}
                     ></img>
                   </span>
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

export default CategoryProducts;
