import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";

const apiKey = import.meta.env.VITE_APP_API_KEY;

function ShowAllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserStatus();
    fetchBlogs(currentPage);
  }, [currentPage]);

  const checkUserStatus = () => {
    const userStatus = localStorage.getItem("isGuest");
    setIsGuest(userStatus === "true");
  };

  const fetchBlogs = async (page) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://blogapi-production-fb2f.up.railway.app/blog?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const data = await response.json();
      setBlogs(data.blogs);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs: ", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleAction = async (action, id) => {
    if (isGuest) {
      alert("Please login to like or dislike blogs.");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://blogapi-production-fb2f.up.railway.app/user/blog/${id}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => {
          if (blog._id === id) {
            switch (action) {
              case "like":
                return {
                  ...blog,
                  likes: blog.likes + 1,
                  dislikes: blog.dislikes > 0 ? blog.dislikes - 1 : blog.dislikes,
                };
              case "unlike":
                return { ...blog, likes: blog.likes > 0 ? blog.likes - 1 : blog.likes };
              case "dislike":
                return {
                  ...blog,
                  dislikes: blog.dislikes + 1,
                  likes: blog.likes > 0 ? blog.likes - 1 : blog.likes,
                };
              case "undislike":
                return {
                  ...blog,
                  dislikes: blog.dislikes > 0 ? blog.dislikes - 1 : blog.dislikes,
                };
              default:
                return blog;
            }
          }
          return blog;
        })
      );
    } catch (error) {
      console.error(`Error ${action} blog: `, error);
    }
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">All Blogs</h1>
          {blogs && blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    onLike={() => handleAction("like", blog._id)}
                    onUnlike={() => handleAction("unlike", blog._id)}
                    onDislike={() => handleAction("dislike", blog._id)}
                    onUndislike={() => handleAction("undislike", blog._id)}
                  />
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
                      currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
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
            <p className="text-center text-gray-500">No blogs available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ShowAllBlogs;

