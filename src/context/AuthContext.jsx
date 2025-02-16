// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { checkTokenExpiration } from "../utils/checkTokenExpiration"; // Token expiration checker
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const isExpired = checkTokenExpiration(storedToken);
      if (isExpired) {
        console.warn("Token expired. Logging out.");
        handleLogout();
      } else {
        setIsLoggedIn(true);
        setToken(storedToken);
        setUsername(localStorage.getItem("username") || "");
      }
    }

    setLoading(false);
  }, []);

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
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        username,
        handleLogin,
        handleLogout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
