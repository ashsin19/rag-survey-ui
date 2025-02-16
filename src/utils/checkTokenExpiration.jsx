// src/utils/checkTokenExpiration.jsx
export const checkTokenExpiration = (token) => {
    try {
      // Split the token and decode the payload (second part)
      const payload = JSON.parse(atob(token.split(".")[1]));
  
      // Check if 'exp' field exists in the payload
      if (!payload.exp) {
        console.warn("Token does not have an expiration date.");
        return false; // Consider it valid without expiration (or handle differently)
      }
  
      // Get the current time in seconds
      const currentTime = Math.floor(Date.now() / 1000);
  
      // Check if the token is expired
      if (payload.exp < currentTime) {
        console.warn("Token has expired.");
        return true;
      }
  
      return false; // Token is still valid
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true; // If an error occurs, treat the token as expired
    }
  };
  