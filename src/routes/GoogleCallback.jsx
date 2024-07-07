import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
    }

    // Navigate to the root after successful authentication
    navigate("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // GitHub callback component doesn't render anything
}

export default GoogleCallback;

