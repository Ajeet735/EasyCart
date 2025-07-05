import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import CartCountLoader from "../CartCount/CartCountLoaer";
import { Context } from "../../main";
import { useContext } from "react";

const Layout = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <div className="app-container">
      {isAuthorized && <CartCountLoader />}
      <Navbar />
      <main className="content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
