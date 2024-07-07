import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GitHubCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); // Redirect to your dashboard or home page
    } else {
      navigate("/login"); // Redirect to login page if no token is found
    }
  }, [navigate, searchParams]);

  return <div>Loading...</div>;
}

export default GitHubCallback;

