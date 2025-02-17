// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { checkTokenExpiration } from "../utils/checkTokenExpiration";

const AuthContext = createContext();

export { AuthContext }
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && !checkTokenExpiration(storedToken)) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setUsername(storedUsername || "");
    }
    else {
      handleLogout();
    }
    const interval = setInterval(() => {
      if (token && checkTokenExpiration(token)) {
        console.warn("🚨 Token expired. Logging out...");
        handleLogout();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [token]);

  const handleLogin = (username, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setIsLoggedIn(true);
    setToken(token);
    setUsername(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setToken(null);
    setUsername("");
    navigate("/"); // Redirect to Home after logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, username, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
