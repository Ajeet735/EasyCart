import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ping } from "../server";
import toast from "react-hot-toast";
import { Context } from "../../main";
import banner from "../../assets/images/main_banner_bg.png";
import { importAll } from "../../utils/importAllImages";
import "./HomePage.css";
import arrow from "../../assets/images/black_arrow_icon.svg";

const categoriesImage = importAll(
  require.context("../../assets/categories", false, /\.(png|jpe?g|svg)$/)
);

const categories = [
  { name: "Fruits", image: "fresh_fruits_image.png" },
  { name: "Vegetables", image: "organic_vegitable_image.png" },
  { name: "Dairy_Products", image: "dairy_product_image.png" },
  { name: "Cold Drinks", image: "bottles_image.png" },
  { name: "Instant Food", image: "maggi_image.png" },
  { name: "Bakery & breads", image: "bakery_image.png" },
  { name: "Grains & Cereals", image: "grain_image.png" },
];

function HomePage() {
  const { user, isAuthorized } = useContext(Context);

  useEffect(() => {
    ping()
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.error("Failed to connect to the backend!"));
  }, []);

  useEffect(() => {
    if (user?.first_name) {
      toast.success(`Welcome ${user.first_name}`);
    }
  }, [user]);

  useEffect(() => {
    console.log("Auth context:", isAuthorized, user);
  }, [isAuthorized, user]);

  return (
    <div className="homepage">
      <div className="container">
        <h1 className="homepage-title">Welcome to the HomePage</h1>
          <>
            <div className="banner">
              <img src={banner} alt="Welcome banner" className="banner-img" />
              <div className="banner-text">
                <h1>
                  Freshness You Can
                  <br />
                  Trust, Saving You
                  <br />
                  Will Love!
                </h1>

                <div className="banner-buttons">
                  <button className="shop-button">Shop Now</button>

                  <Link
                    to="#footer-section"
                    className="explore-link"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("footer-section")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Explore deals
                    <img src={arrow} alt="Arrow" className="arrow-icon" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="categories-section">
              <h2>Categories</h2>
              <div className="categories-grid">
                {categories.map((cat) => (
                  <Link
                    to={`/category/${cat.name.toLowerCase()}`}
                    key={cat.name}
                    className="category-card"
                  >
                    <img
                      src={categoriesImage[cat.image]}
                      alt={cat.name}
                      className="category-image"
                    />
                    <h3>{cat.name}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </>

        {/* Product section */}
        <section className="products"></section>
      </div>
    </div>
  );
}

export default HomePage;
