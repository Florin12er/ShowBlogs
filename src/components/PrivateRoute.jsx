import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { getCookie } from "../utils/GetCookie";

const RequireAuth = ({ children }) => {
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = getCookie("token");
      if (!token) {
        // No token found, redirect to the login page on the authentication domain
        window.location.href = "https://blog-maker-two.vercel.app";
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token expired, remove cookie and redirect to login
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app; SameSite=None; Secure";
          window.location.href = "https://blog-maker-two.vercel.app";
          return;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle any decoding errors (e.g., invalid token format)
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.vercel.app; SameSite=None; Secure";
        window.location.href = "https://blog-maker-two.vercel.app";
        return;
      }
    };

    checkTokenValidity();
  }, []);

  return children;
};

export default RequireAuth;

