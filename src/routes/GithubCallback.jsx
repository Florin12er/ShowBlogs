// GitHubCallback.js
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function GithubCallback() {
    const navigate = useNavigate();
    const location = useLocation();


    return (
        <>
            <NavBar/>
        <h1>Hello</h1>
        </>
    ); // GitHub callback component doesn't render anything
}

export default GithubCallback;

