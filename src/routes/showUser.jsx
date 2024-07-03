import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import image from "../../public/icon.jpg";

function truncateHTMLContent(html, maxLength) {
  const plainText =
    new DOMParser().parseFromString(html, "text/html").body.textContent || "";
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + "..."
    : plainText;
}

function ShowUser() {
  const [clickedUserId, setClickedUserId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchUserAndBlogs() {
      try {
        const token = localStorage.getItem("token");

        // Fetch user details
        const userResponse = await fetch(
          `https://blogapi-production-fb2f.up.railway.app/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch blogs authored by the user
        const blogsResponse = await fetch(
          `https://blogapi-production-fb2f.up.railway.app/blog/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!blogsResponse.ok) {
          throw new Error("Failed to fetch user's blogs");
        }
        const blogsData = await blogsResponse.json();
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchUserAndBlogs();
  }, [id]);

 const handleShare = (userId) => {
    // Logic to handle sharing the user profile
    console.log(`Sharing profile of user with ID: ${userId}`);
    // Add your share functionality here (e.g., making an API call to share the profile)
    setClickedUserId(userId); // Set the state to trigger animation
    setTimeout(() => {
      setClickedUserId(null); // Reset after 2 seconds
    }, 2000);
  };

  const handleImageUpload = () => {
    // Implement image upload functionality here (frontend logic)
    console.log("Image upload functionality to be implemented");
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {user && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-center">User Profile</h1>
              <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
                <img
                  src={user.image || image} // Placeholder image or user's image
                  alt="User Profile"
                  className="h-24 w-24 rounded-full mr-4 object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  <button
                    onClick={handleImageUpload}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                  >
                    Upload Image
                  </button>
                  <button
                    onClick={() => handleShare(user._id)}
                    className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ${
                      clickedUserId === user._id ? "rainbow-animation" : ""
                    }`}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">User's Blogs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white p-6 rounded-lg shadow-lg"
                  >
                    <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                    <p>
                      Links:{" "}
                      <a
                        href={blog.links}
                        className="text-blue-500 hover:underline"
                      >
                        {blog.links}
                      </a>
                    </p>
                    <p className="text-gray-600 mb-2">Tags: {blog.tags}</p>
                    <p className="text-gray-700">
                      {truncateHTMLContent(blog.content, 150)}
                    </p>
                    <Link
                      className="text-blue-500 hover:underline"
                      to={`/blog/${blog._id}`}
                    >
                      Read More
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ShowUser;
