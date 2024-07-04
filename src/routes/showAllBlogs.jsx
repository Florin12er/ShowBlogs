import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useBlogData} from "../hooks/useBlogData";
import BlogCard from "../components/BlogCard";

function ShowAllBlogs() {
  const [data, setData] = useState([]); // State for storing blog data
  const blogData = useBlogData(); // Custom hook to fetch blog data

  // Update state with fetched blog data
  useEffect(() => {
    setData(blogData);
  }, [blogData]);

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://blogapi-production-fb2f.up.railway.app/user/blog/${id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Update the state to reflect the change
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id
            ? {
                ...item,
                likes: item.likes + 1,
                dislikes: item.dislikes > 0 ? item.dislikes - 1 : item.dislikes,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error liking blog: ", error);
    }
  };

  const handleUnlike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://blogapi-production-fb2f.up.railway.app/user/blog/${id}/unlike`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Update the state to reflect the change
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id
            ? { ...item, likes: item.likes > 0 ? item.likes - 1 : item.likes }
            : item
        )
      );
    } catch (error) {
      console.error("Error unliking blog: ", error);
    }
  };

  const handleDislike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://blogapi-production-fb2f.up.railway.app/user/blog/${id}/dislike`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Update the state to reflect the change
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id
            ? {
                ...item,
                dislikes: item.dislikes + 1,
                likes: item.likes > 0 ? item.likes - 1 : item.likes,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error disliking blog: ", error);
    }
  };

  const handleUndislike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://blogapi-production-fb2f.up.railway.app/user/blog/${id}/undislike`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Update the state to reflect the change
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id
            ? {
                ...item,
                dislikes: item.dislikes > 0 ? item.dislikes - 1 : item.dislikes,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error undisliking blog: ", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">All Blogs:</h1>
          {data && data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  onDislike={handleDislike}
                  onUndislike={handleUndislike}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ShowAllBlogs;

