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
        },
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      window.location.href = "/";
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-white">BlogHub</Link>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          <div
            className={`md:flex ${isMenuOpen ? "block" : "hidden"} flex-col md:flex-row items-center mt-4 md:mt-0`}
          >
            <ul className="md:flex md:space-x-6 mb-4 md:mb-0">
              <li className="text-white hover:text-yellow-300 font-semibold cursor-pointer mb-2 md:mb-0">
                <Link to="/">All Blogs</Link>
              </li>
              {token && (
                <li className="text-white hover:text-yellow-300 font-semibold cursor-pointer mb-2 md:mb-0">
                  <Link to="/your-blogs">Your Blogs</Link>
                </li>
              )}
              <li className="text-white hover:text-yellow-300 font-semibold cursor-pointer mb-2 md:mb-0">
                <Link to="/user">Users</Link>
              </li>
              <li className="text-white hover:text-yellow-300 font-semibold cursor-pointer mb-2 md:mb-0">
                <a
                  href="https://blog-maker-two.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create Blog
                </a>
              </li>
              <li className="text-white hover:text-yellow-300 font-semibold cursor-pointer mb-2 md:mb-0">
                <a
                  href="https://blogdocs.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API Docs
                </a>
              </li>
            </ul>
            {token ? (
              <div className="ml-2 flex flex-col md:flex-row md:space-x-4">
                <Link
                  className="bg-white text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-full focus:outline-none mb-2 md:mb-0 transition duration-300 ease-in-out"
                  to={`/settings/${userId}`}
                >
                  <span className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Settings
                  </span>
                </Link>
                <button
                  className="bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded-full focus:outline-none transition duration-300 ease-in-out"
                  onClick={handleLogout}
                >
                  <span className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:space-x-4">
                <Link
                  to="/login"
                  className="bg-white text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-full focus:outline-none mb-2 md:mb-0 transition duration-300 ease-in-out"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-blue-800 hover:bg-yellow-300 py-2 px-4 rounded-full focus:outline-none transition duration-300 ease-in-out"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
    </nav>
  );
}

export default NavBar;

