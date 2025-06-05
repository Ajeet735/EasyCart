import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useContext } from "react";
import { Context } from "../../main";
import "../../App.css";

const Layout = ({children}) => {
    const {isAuthorized} = useContext(Context)
    return (
        <div className="app-container">
            {isAuthorized && <Navbar />}
            <main className="content">
               <div className="container"> {children} </div>
                
                </main>
            <Footer/>
        </div>
    );
};

export default Layout;