import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ping } from "../server";
import toast from "react-hot-toast";
import { Context } from "../../main";
import banner from "../../assets/images/main_banner_bg.png";
import "./HomePage.css";
import arrow from "../../assets/images/black_arrow_icon.svg";

function HomePage() {
  const { user } = useContext(Context);
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
  return (
    <div className="homepage">
      <div className="container">
        <div className="banner">
          <img src={banner} alt="Welcome banner" className="banner-img"></img>
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
        <h1>Welcome to the HomePage</h1>
        {user?.first_name && <h2>Hello, {user.first_name}!</h2>}
        {/* Product section */}
        <section className="products"></section>
      </div>
    </div>
  );
}

export default HomePage;
