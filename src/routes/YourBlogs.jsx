import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
const apiKey = import.meta.env.VITE_APP_API_KEY;

function YourBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserBlogs() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://blogapi-production-fb2f.up.railway.app/blog/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": apiKey,
            },
          },
        );

        setBlogs(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetchUserBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://blogapi-production-fb2f.up.railway.app/blog/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
          },
        },
      );

      if (response.status === 204) {
        // Deletion successful
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } else {
        throw new Error("Failed to delete blog");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Replace with a loading spinner or animation
  }

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Your Blogs
        </h1>
        {error && <p className="text-red-500">Error: {error}</p>}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-bold text-gray-700">
                  {blog.title}
                </h2>
                <p className="text-gray-700">{blog.content}</p>
                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    View
                  </Link>
                  <div>
                    <Link
                      to={`/blogs/${blog._id}/edit`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="ml-2 text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No blogs found.</p>
        )}
      </div>
    </>
  );
}

export default YourBlogs;
