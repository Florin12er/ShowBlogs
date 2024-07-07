// GitHubCallback.js

import { useEffect } from "react";
import { useLocation, useNavigate} from "react-router-dom";

function GitHubCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    // Store token in local storage or state
    if (token) {
      localStorage.setItem("token", token);
    }

    // Redirect to desired route after successful authentication
    navigate("/"); // Replace with your desired route
  }, [location, navigate]);

  return null; // GitHub callback component doesn't render anything
}

export default GitHubCallback;

