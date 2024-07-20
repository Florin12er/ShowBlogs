import React, { useEffect, useState, useCallback } from "react";
import NavBar from "../components/NavBar";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";
import debounce from 'lodash/debounce';

const apiKey = import.meta.env.VITE_APP_API_KEY;

function ShowAllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async (page, query = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = query
        ? `https://blogapi-production-fb2f.up.railway.app/blog/search?query=${encodeURIComponent(query)}&page=${page}&limit=12`
        : `https://blogapi-production-fb2f.up.railway.app/blog?page=${page}&limit=12`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      setBlogs(data.blogs || data);
      setTotalPages(data.totalPages || Math.ceil(data.length / 10));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs: ", error);
      setError(error.message);
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => {
      setCurrentPage(1);
      fetchBlogs(1, query);
    }, 300),
    [fetchBlogs]
  );

  useEffect(() => {
    checkUserStatus();
    fetchBlogs(currentPage, searchQuery);
  }, [currentPage, fetchBlogs, searchQuery]);

  const checkUserStatus = () => {
    const userStatus = localStorage.getItem("isGuest");
    setIsGuest(userStatus === "true");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
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
  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-800">
            Explore Blogs
          </h1>
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search blogs..."
                className="w-full px-6 py-3 border-2 border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <svg className="absolute right-4 top-3 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          ) : blogs && blogs.length > 0 ? (
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
              <p className="mt-4 text-xl">No blogs available</p>
              <p className="mt-2">Be the first to create a blog!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ShowAllBlogs;

