import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api";
import ProductCard from "./ProductCard";
import "./ProductSearch.css";

const ProductSearch = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("name");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const res = await API.get(
          `http://localhost:8000/users/search?name=${query}`
        );

        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
        setError("");
      } catch (err) {
        setError("Failed to fetch search results.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="search-results-page">
      <h2>Search results for: "{query}"</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && products.length === 0 && (
        <p>No products found.</p>
      )}

      <div className="product-container">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductSearch;
