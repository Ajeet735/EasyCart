import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import "./CategoryProducts.css";
import "../ProductsView/GetAllProducts.css";
import ProductCard from "./ProductCard";


const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get(
          `/users/productbycategory?category=${category}`
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


  return (
    <div className="category-products-page">
      <h2>Products in {category}</h2>
    <div className="products-container">
         {products.map((product, index) => {
           return (
    <     ProductCard key={index} product={product} />
           );
         })}
       </div>
    </div>
  );
};

export default CategoryProducts;
