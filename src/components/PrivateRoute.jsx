import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import


const RequireAuth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // No token found, redirect to login
        navigate("/login", { replace: true });
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token expired, remove from localStorage and redirect to login
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle any decoding errors (e.g., invalid token format)
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    };

    checkTokenValidity();
  }, [navigate]); // Add navigate to the dependency array to prevent stale closures

  return children;
};

export default RequireAuth;
