import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import defaultImage from "../../public/icon.jpg"; // Adjust the path based on your project structure
import NavBar from "../components/NavBar";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const API_URL = "https://blogapi-production-fb2f.up.railway.app"; // Add this line

function ShowAllUsers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  async function fetchUsers(page) {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/user?page=${page}&limit=9`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users: ", error);
      setError(error.message);
      setLoading(false);
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-b from-blue-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-800">All Users</h1>
          {users && users.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
                  >
                    <img
                      src={user.profilePicture ? `${API_URL}/uploads/${user.profilePicture}` : defaultImage}
                      alt={`${user.username}'s profile`}
                      className="h-24 w-24 rounded-full mb-4 object-cover"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = defaultImage;
                      }}
                    />
                    <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
                    <div className="flex gap-4">
                      <Link
                        to={`/user/${user._id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`px-4 py-2 rounded ${
                      currentPage === page + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No users available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ShowAllUsers;

