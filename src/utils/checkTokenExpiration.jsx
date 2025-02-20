// src/utils/checkTokenExpiration.js
import { jwtDecode } from "jwt-decode";

export const checkTokenExpiration = (token) => {
  if (!token) return true; // No token = expired
  
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true; // If token has no expiration, consider expired

    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // Invalid token is considered expired
  }
};
