import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import cartImage from "../../assets/icons/cart.png";
import logo from "../../assets/logo/easycart.png";

import "../../App.css";
import "./Navbar.css";
import CartCountLoader from "../CartCount/CartCountLoaer";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user, setUser, cartCount } = useContext(Context);
  const [query, setQuery] = useState("");
  const navigateTo = useNavigate();
const handleLogout = async () => {
  try {
    await API.post("/users/logout");
    toast.success(`👋 You’ve been logged out`);
  } catch (err) {
    if (err.response?.status === 401) {
      console.warn("Already logged out or session expired");
      toast("🔒 Session already expired", { icon: "⚠️" });
    } else {
      toast.error(err?.response?.data?.message || "Logout failed");
    }
  } finally {
    setIsAuthorized(false);
    setUser({});
    navigateTo("/login");
  }
};
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigateTo(`/search?name=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  return (
    <>
      {/* ✅ Loader fetches cart quantity when Navbar loads */}
      <CartCountLoader />

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

            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>

          {/* Hamburger Toggle */}
          <div className="hamburger" onClick={() => setShow(!show)}>
            {show ? <AiOutlineClose /> : <GiHamburgerMenu />}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
