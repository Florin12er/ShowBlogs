import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
function NavBar() {
 const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

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
        },
      );

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <nav className="bg-white border-b-2 border-solid border-black shadow-lg">
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
            <Link to="https://blog-maker-two.vercel.app/">Blog Maker</Link>
          </li>
        </ul>
        <form onSubmit={handleLogout}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
}

export default NavBar;
