import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";

function Settings() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  // Fetch user data
  useEffect(() => {
    async function fetchUser() {
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
        setFormData({
          username: userData.username || "",
          email: userData.email || "",
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchUser();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://blogapi-production-fb2f.up.railway.app/user/settings",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user settings");
      }

      const data = await response.json();
      alert("updated user");

      // Optionally, update user state to reflect changes
      setUser(data.user);

      // Optionally, show a success message or redirect
    } catch (error) {
      console.error("Error updating user settings:", error.message);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          User Settings
        </h1>
        {user ? (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Current Information
            </h2>
            <div className="mb-4">
              <p className="text-gray-700">
                <span className="font-semibold">Username:</span> {user.username}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-700">Loading...</p>
        )}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Update User Information
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-2">
                Username:
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-2">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none"
            >
              Update Settings
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Settings;
