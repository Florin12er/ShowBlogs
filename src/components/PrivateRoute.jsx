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
          document.cookie =
            "token=; path=/; domain=blogs-nine-steel.vercel.app; SameSite=None; Secure";

          window.location.href = "https://blog-maker-two.vercel.app";
          return;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        document.cookie =
          "token=; path=/; domain=blogs-nine-steel.vercel.app; SameSite=None; Secure";
        window.location.href = "https://blog-maker-two.vercel.app";
        return;
      }
    };

    checkTokenValidity();
  }, []);

  return children;
};

export default RequireAuth;
