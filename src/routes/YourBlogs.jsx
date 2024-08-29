import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";

const apiKey = import.meta.env.VITE_APP_API_KEY;

function YourBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserBlogs() {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://blogapi-1jcl.onrender.com/blog/user/${userId}?page=${currentPage}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": apiKey,
            },
          }
        );

        setBlogs(response.data.blogs);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    }

    fetchUserBlogs();
  }, [currentPage]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://blogapi-1jcl.onrender.com/blog/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
          },
        }
      );

      if (response.status === 204) {
        // Deletion successful
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } else {
        throw new Error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error.response || error.message);
      setError("Error deleting blog: " + (error.response?.data?.message || error.message));
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-800">
            Your Blogs
          </h1>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <div key={blog._id} className="bg-white shadow-md rounded-lg p-4">
                    {blog.thumbnail && (
                      <img
                        src={`https://blogapi-1jcl.onrender.com${blog.thumbnail}`}
                        alt={blog.title}
                        className="w-full h-56 object-cover mb-4 rounded"
                      />
                    )}
                    <h2 className="text-2xl font-bold text-gray-800">{blog.title}</h2>
                    <p className="text-gray-700 mb-2">{blog.content.substring(0, 100)}...</p>
                    <p className="text-gray-700 mb-2">
                      <strong>Tags:</strong> {blog.tags.split(',').map((tag) => (
                        <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2">
                          {tag.trim()}
                        </span>
                      ))}
                    </p>
                    <p className="text-blue-600 hover:underline mb-4">
                      <a href={blog.links} target="_blank" rel="noopener noreferrer">{blog.links}</a>
                    </p>
                    <div className="mt-4 flex justify-between">
                      <Link
                        to={`/blog/${blog._id}`}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        View
                      </Link>
                      <div>
                        <Link
                          to={`/blog/${blog._id}/edit`}
                          className="text-blue-500 hover:text-blue-600 mr-2"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-600 transition duration-300 ease-in-out"
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`px-4 py-2 rounded-md transition duration-300 ease-in-out ${
                      currentPage === page + 1 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-600 transition duration-300 ease-in-out"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600 bg-white p-8 rounded-lg shadow-md">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-xl">No blogs found.</p>
              <p className="mt-2">You haven't created any blogs yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default YourBlogs;

