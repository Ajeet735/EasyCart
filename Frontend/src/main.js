import React, { useState, useEffect, createContext } from "react";
import App from "./App";
import API from "./api";

export const Context = createContext({
  isAuthorized: false,
  setIsAuthorized: () => {},
  user: {},
  setUser: () => {},
  cartCount: 0,
  setCartCount: () => {},
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});
  const [cartCount, setCartCount] = useState(0); // 🆕 added

 useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await API.get("/users/check-auth", {
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthorized(true);
      } else {
        setUser({});
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err.message);
      setUser({});
      setIsAuthorized(false);
    }
  };

  checkAuth();
}, []);

useEffect(() => {
  if(isAuthorized) return;
  
  const getCartCount = async () => {
    try {
      if (isAuthorized) {
        const cartRes = await API.get("/users/cart-count", {
          withCredentials: true,
        });
        setCartCount(cartRes.data.count);
      }
    } catch (err) {
      console.error("Cart count fetch failed:", err.message);
    }
  };

  getCartCount();
}, [isAuthorized]);

  return (
    <Context.Provider value={{ isAuthorized, setIsAuthorized, user, setUser, cartCount, setCartCount }}>
      <App />
    </Context.Provider>
  );
};

export default AppWrapper;
