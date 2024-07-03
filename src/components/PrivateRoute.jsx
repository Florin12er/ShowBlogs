import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const RequireAuth = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // No token found, redirect to external login page
        window.location.href = "https://blog-maker-two.vercel.app";
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token expired, remove from localStorage and redirect to external login page
          localStorage.removeItem("token");
          window.location.href = "https://blog-maker-two.vercel.app";
          return;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle any decoding errors (e.g., invalid token format)
        localStorage.removeItem("token");
        window.location.href = "https://blog-maker-two.vercel.app/login";
        return;
      }
    };

    checkTokenValidity();
  }, [location]);

  return children;
};

export default RequireAuth;

