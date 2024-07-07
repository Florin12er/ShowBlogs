import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";

function GithubCallback() {
  const { token } = useParams(); // Extract token from URL params
  const location = useLocation();

  useEffect(() => {
    console.log("Token:", token); // Log the token to verify
  }, [token]);

  return (
    <>
      <NavBar />
      <h1>Hello</h1>
    </>
  );
}

export default GithubCallback;

