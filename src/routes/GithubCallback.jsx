import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/NavBar";

function GithubCallback() {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Redirect to the desired route after authentication
      window.location.href = "/"; // Replace with your desired route
    }
  }, [location]);

  return (
    <>
      <NavBar />
      <h1>Hella</h1>
    </>
  );
}

export default GithubCallback;

