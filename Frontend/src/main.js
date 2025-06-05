import React, { useState, createContext } from "react";
import App from "./App";

export const Context = createContext({
  isAuthorized: false,
  setIsAuthorized: () => {}, // ✅ default no-op functions
  user: {},
  setUser: () => {},
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Context.Provider value={{ isAuthorized, setIsAuthorized, user, setUser }}>
      <App />
    </Context.Provider>
  );
};

export default AppWrapper;

