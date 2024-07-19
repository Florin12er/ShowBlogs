import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import image from "../../public/icon.jpg"; 
import { useParams } from "react-router-dom";

const apiKey = import.meta.env.VITE_APP_API_KEY;

function Settings() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
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
        setFormData({
          username: userData.username || "",
          email: userData.email || "",
        });
        if (userData.profilePicture) {
          setPreviewUrl(`https://blogapi-production-fb2f.up.railway.app/uploads/${userData.profilePicture}`);
        }
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
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
            "x-api-key": apiKey,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user settings");
      }

      const data = await response.json();
      setUser(data.user);

      if (profilePicture) {
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);

        const uploadResponse = await fetch(
          "https://blogapi-production-fb2f.up.railway.app/user/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": apiKey,
            },
            body: formData,
          },
        );

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const uploadData = await uploadResponse.json();
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: uploadData.filePath,
        }));
      }

      alert("User settings updated successfully");
    } catch (error) {
      console.error("Error updating user settings:", error.message);
      alert("Error updating user settings: " + error.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">User Settings</h1>
        {user ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gray-100 p-8 flex flex-col items-center justify-center">
                <div className="mb-4 relative">
                  <img
                    src={previewUrl || image}
                    alt="Profile"
                    className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg"
                  />
                  <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="md:w-2/3 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Update Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user data...</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Settings;

