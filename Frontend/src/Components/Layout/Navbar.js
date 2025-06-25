import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import cartImage from "../../assets/icons/cart.png";
import logo from "../../assets/logo/easycart.png";

import "../../App.css";
import "./Navbar.css";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigateTo = useNavigate();
  const { cartCount } = useContext(Context);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/users/logout",
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
      setUser({});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
      setIsAuthorized(true);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const res = await axios.get(
        `http://localhost:8000/products/search?name=${query}`,
        { withCredentials: true }
      );
      setResults(res.data);
    } catch (error) {
      toast.error("Search failed");
      console.error(error);
    }
  };

  return (
    <nav className={isAuthorized ? "navbarShow" : "navbarHide"}>
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="logo" className="nav-logo-img" />
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {/* Menu Links */}
        <ul className={!show ? "menu" : "show-menu menu"}>
          <li>
            <Link to="/home" onClick={() => setShow(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/users/getallProducts" onClick={() => setShow(true)}>
              All Products
            </Link>
          </li>

          {user?.role === "Admin" && (
            <>
              <li>
                <Link to="/admin/addproduct" onClick={() => setShow(false)}>
                  Add Product
                </Link>
              </li>
              <li>
                <Link to="/job/me" onClick={() => setShow(false)}>
                  View Your Products
                </Link>
              </li>
            </>
          )}

          <li>
            <Link to="/cart" className="cart-link">
              <img src={cartImage} alt="Cart" className="nav-cart-img" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </li>

          {/* Wrapped button in li for semantic HTML */}
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>

        {/* Hamburger Toggle */}
        <div className="hamburger" onClick={() => setShow(!show)}>
          {show ? <AiOutlineClose /> : <GiHamburgerMenu />}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <div className="search-results">
          <ul>
            {results.map((product) => (
              <li key={product.Product_ID}>
                <strong>{product.product_name}</strong> - ₹{product.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
