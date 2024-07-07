// GitHubCallback.js
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function GitHubCallback() {
    const navigate = useNavigate();
    const location = useLocation();


    return (
        <h1>Hello</h1>
    ); // GitHub callback component doesn't render anything
}

export default GitHubCallback;

