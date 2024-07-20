import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import image from "../../public/icon.jpg";
import NavBar from "../components/NavBar";
const apiKey = import.meta.env.VITE_APP_API_KEY;
function truncateHTMLContent(html, maxLength) {
  const plainText =
    new DOMParser().parseFromString(html, "text/html").body.textContent || "";
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + "..."
    : plainText;
}

function ShowUser() {
  const API_URL = "https://blogapi-production-fb2f.up.railway.app";
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    fetchUserAndBlogs(currentPage);
  }, [id, currentPage]);

  async function fetchUserAndBlogs(page) {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch user details (only needed once)
      if (!user) {
        const userResponse = await fetch(
          `https://blogapi-production-fb2f.up.railway.app/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": apiKey,
            },
          },
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUser(userData);
      }

      // Fetch blogs authored by the user
      const blogsResponse = await fetch(
        `https://blogapi-production-fb2f.up.railway.app/blog/user/${id}?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
          },
        },
      );
      if (!blogsResponse.ok) {
        throw new Error("Failed to fetch user's blogs");
      }
      const blogsData = await blogsResponse.json();

      if (!blogsData.blogs || !Array.isArray(blogsData.blogs)) {
        throw new Error("Unexpected blog data format");
      }

      setBlogs(blogsData.blogs);
      setPagination({
        currentPage: blogsData.currentPage,
        totalPages: blogsData.totalPages,
        totalBlogs: blogsData.totalBlogs,
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
      setError(error.message);
    } finally {
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
          {user && (
            <>
              <div className="mb-8">
                <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-800">
                  User Profile
                </h1>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={
                        user.profilePicture
                          ? `${API_URL}/uploads/${user.profilePicture}`
                          : image
                      }
                      alt="User Profile"
                      className="h-24 w-24 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {user.username}
                      </h2>
                      <p className="text-gray-600 mb-2">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6">User's Blogs</h2>
                {blogs.length === 0 ? (
                  <p className="text-center text-gray-600 text-lg">
                    This user hasn't posted any blogs yet.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {blogs.map((blog) => (
                        <div
                          key={blog._id}
                          className="bg-white p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
                        >
                          <h3 className="text-xl font-bold mb-3">
                            {blog.title}
                          </h3>
                          <p className="mb-2">
                            <span className="font-semibold">Links:</span>{" "}
                            <a
                              href={blog.links}
                              className="text-blue-500 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {blog.links}
                            </a>
                          </p>
                          <p className="text-gray-600 mb-3">
                            <span className="font-semibold">Tags:</span>{" "}
                            {blog.tags}
                          </p>
                          <p className="text-gray-700 mb-4">
                            {truncateHTMLContent(blog.content, 150)}
                          </p>
                          <Link
                            className="text-blue-500 hover:underline font-semibold"
                            to={`/blog/${blog._id}`}
                          >
                            Read More →
                          </Link>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-center items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                      >
                        Previous
                      </button>
                      {[...Array(pagination.totalPages).keys()].map((page) => (
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
                        disabled={currentPage === pagination.totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                      >
                        Next
                      </button>
                    </div>
                    <div className="mt-4 text-center">
                      <p>
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </p>
                      <p>Total Blogs: {pagination.totalBlogs}</p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ShowUser;
