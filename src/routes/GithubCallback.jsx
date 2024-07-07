// GitHubCallback.js
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function GitHubCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");

        if (token) {
            console.log("Received token:", token);
            localStorage.setItem("token", token);
        }

        navigate("/"); // Replace with your desired route after successful GitHub authentication
    }, [location, navigate]);

    return (
        <h1>Hello</h1>
    ); // GitHub callback component doesn't render anything
}

export default GitHubCallback;

