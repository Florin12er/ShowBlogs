import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";

const RequireAuth = ({ children }) => {
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // No token found, redirect to login
        return <Navigate to="https://blog-maker-two.vercel.app" replace />;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token expired, remove from localStorage and redirect to login
          localStorage.removeItem("token");
          return <Navigate to="https://blog-maker-two.vercel.app" replace />;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle any decoding errors (e.g., invalid token format)
        localStorage.removeItem("token");
        return <Navigate to="https://blog-maker-two.vercel.app" replace />;
      }
    };

    checkTokenValidity();
  }, []);

  return children;
};

export default RequireAuth;

