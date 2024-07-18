import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function NavBar() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const [error, setError] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            await axios.delete(
                "https://blogapi-production-fb2f.up.railway.app/user/logout",
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("username")
            window.location.href = "/";
        } catch (err) {
            setError(err.response.data.message);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white border-b-2 border-solid border-black shadow-lg bg-gray-500">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-4xl font-bold">Blogs</div>
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-black focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                    <div className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} flex-col md:flex-row items-center mt-4 md:mt-0`}>
                        <ul className="md:flex md:space-x-4 mb-4 md:mb-0">
                            <li className="hover:text-blue-500 font-bold cursor-pointer mb-2 md:mb-0">
                                <Link to="/user">See Users</Link>
                            </li>
                            <li className="hover:text-blue-500 font-bold cursor-pointer mb-2 md:mb-0">
                                <Link to="/">See Blogs</Link>
                            </li>
                            <li className="hover:text-blue-500 font-bold cursor-pointer mb-2 md:mb-0">
                                <a href="https://blog-maker-two.vercel.app/" target="_blank" rel="noopener noreferrer">
                                    Blog Maker
                                </a>
                            </li>
                        </ul>
                        {token ? (
                            <div className="flex flex-col md:flex-row gap-3">
                                <Link
                                    className="bg-zinc-500 flex justify-center gap-1 hover:bg-zinc-600 text-white py-2 px-4 rounded-md focus:outline-none mb-2 md:mb-0"
                                    to={`/settings/${userId}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 1024 1024">
                                        <path fill="currentColor" d="M512.5 390.6c-29.9 0-57.9 11.6-79.1 32.8c-21.1 21.2-32.8 49.2-32.8 79.1s11.7 57.9 32.8 79.1c21.2 21.1 49.2 32.8 79.1 32.8s57.9-11.7 79.1-32.8c21.1-21.2 32.8-49.2 32.8-79.1s-11.7-57.9-32.8-79.1a110.96 110.96 0 0 0-79.1-32.8m412.3 235.5l-65.4-55.9c3.1-19 4.7-38.4 4.7-57.7s-1.6-38.8-4.7-57.7l65.4-55.9a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a442.5 442.5 0 0 0-79.6-137.7l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.2 28.9c-30-24.6-63.4-44-99.6-57.5l-15.7-84.9a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52-9.4-106.8-9.4-158.8 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.3a353.4 353.4 0 0 0-98.9 57.3l-81.8-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a445.9 445.9 0 0 0-79.6 137.7l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.2 56.5c-3.1 18.8-4.6 38-4.6 57c0 19.2 1.5 38.4 4.6 57l-66 56.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.3 44.8 96.8 79.6 137.7l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.8-29.1c29.8 24.5 63 43.9 98.9 57.3l15.8 85.3a32.05 32.05 0 0 0 25.8 25.7l2.7.5a448.3 448.3 0 0 0 158.8 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-84.9c36.2-13.6 69.6-32.9 99.6-57.5l81.2 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.5-87.4 79.6-137.7l.9-2.6c4.3-12.4.6-26.3-9.5-35m-412.3 52.2c-97.1 0-175.8-78.7-175.8-175.8s78.7-175.8 175.8-175.8s175.8 78.7 175.8 175.8s-78.7 175.8-175.8 175.8"></path>
                                    </svg>
                                    <p>Settings</p>
                                </Link>
                                <button
                                    className="bg-blue-500 flex justify-center gap-1 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none"
                                    onClick={handleLogout}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                        <path fill="white" d="M14.08 15.59L16.67 13H7v-2h9.67l-2.59-2.59L15.5 7l5 5l-5 5zM19 3a2 2 0 0 1 2 2v4.67l-2-2V5H5v14h14v-2.67l2-2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2z"></path>
                                    </svg>
                                    <p>Logout</p>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row md:space-x-4">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none mb-2 md:mb-0">
                                    <Link to="/login">Login</Link>
                                </button>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none">
                                    <Link to="/register">Register</Link>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {error && <div className="text-red-500 text-center">{error}</div>}
        </nav>
    );
}

export default NavBar;

