import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../components/ThemeContext.jsx";

function NavBar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [error, setError] = useState(null);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.delete(
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
      window.location.href = "/login";
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <nav
      className={`bg-white border-b-2 border-solid border-black shadow-lg ${
        theme === "dark" ? "bg-gray-500" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-4xl font-bold">Blogs</div>
        <ul className="flex space-x-4">
          <li className="hover:text-blue-500 font-bold cursor-pointer">
            <Link to="/user">See Users</Link>
          </li>
          <li className="hover:text-blue-500 font-bold cursor-pointer">
            <Link to="/">See Blogs</Link>
          </li>
          <li className="hover:text-blue-500 font-bold cursor-pointer">
            <a
              href="https://blog-maker-two.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Blog Maker
            </a>
          </li>
        </ul>
        {token ? (
          <div className="flex gap-3">
            <Link
              className="bg-zinc-500 flex justify-center gap-1 hover:bg-zinc-600 text-white py-2 px-4 rounded-md focus:outline-none"
              to={`/settings/${userId}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 1024 1024"
              >
                <path
                  fill="currentColor"
                  d="M512.5 390.6c-29.9 0-57.9 11.6-79.1 32.8c-21.1 21.2-32.8 49.2-32.8 79.1s11.7 57.9 32.8 79.1c21.2 21.1 49.2 32.8 79.1 32.8s57.9-11.7 79.1-32.8c21.1-21.2 32.8-49.2 32.8-79.1s-11.7-57.9-32.8-79.1a110.96 110.96 0 0 0-79.1-32.8m412.3 235.5l-65.4-55.9c3.1-19 4.7-38.4 4.7-57.7s-1.6-38.8-4.7-57.7l65.4-55.9a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a442.5 442.5 0 0 0-79.6-137.7l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.2 28.9c-30-24.6-63.4-44-99.6-57.5l-15.7-84.9a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52-9.4-106.8-9.4-158.8 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.3a353.4 353.4 0 0 0-98.9 57.3l-81.8-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a445.9 445.9 0 0 0-79.6 137.7l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.2 56.5c-3.1 18.8-4.6 38-4.6 57c0 19.2 1.5 38.4 4.6 57l-66 56.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.3 44.8 96.8 79.6 137.7l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.8-29.1c29.8 24.5 63 43.9 98.9 57.3l15.8 85.3a32.05 32.05 0 0 0 25.8 25.7l2.7.5a448.3 448.3 0 0 0 158.8 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-84.9c36.2-13.6 69.6-32.9 99.6-57.5l81.2 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.5-87.4 79.6-137.7l.9-2.6c4.3-12.4.6-26.3-9.5-35m-412.3 52.2c-97.1 0-175.8-78.7-175.8-175.8s78.7-175.8 175.8-175.8s175.8 78.7 175.8 175.8s-78.7 175.8-175.8 175.8"
                ></path>
              </svg>
              <p>Settings</p>
            </Link>
            <button
              className="bg-blue-500 flex justify-center gap-1 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none"
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M14.08 15.59L16.67 13H7v-2h9.67l-2.59-2.59L15.5 7l5 5l-5 5zM19 3a2 2 0 0 1 2 2v4.67l-2-2V5H5v14h14v-2.67l2-2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2z"
                ></path>
              </svg>
              <p>Logout</p>
            </button>

            {/* Theme Switcher Dropdown */}
            <div className="relative">
              <select
                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded-md shadow leading-tight focus:outline-none focus:border-blue-500"
                value={theme}
                onChange={(e) => toggleTheme(e.target.value)}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="old-school">Old School (Black & White)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.293 14.707a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none">
              <Link to="/login">Login</Link>
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none">
              <Link to="/register">Register</Link>
            </button>
          </div>
        )}
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
    </nav>
  );
}

export default NavBar;

