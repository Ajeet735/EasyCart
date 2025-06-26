import React, {  useEffect, useState } from "react";
import axios from "axios";
import "./GetAllProducts.css";
import ProductCard from "./ProductCard"

const GetAllProducts = () => {
  const [products, setProducts] = useState([]);

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



  return (
    <div className="products-Wrapper">
      <h2 className="section-heading">
        ALL PRO<span className="highlighted">DUCTS</span>
        </h2>
      <div className="products-container">
        {products.map((product, index) => {
          return (
           <ProductCard key={index} product={product} />
          );
        })}
      </div>
    </div>
  );
};
export default GetAllProducts;
