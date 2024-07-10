import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import image from "../../public/icon.jpg"; // Adjust the path based on your project structure
import NavBar from "../components/NavBar";
const apiKey = import.meta.env.VITE_APP_API_KEY;
function truncateHTMLContent(html, maxLength) {
  const plainText =
    new DOMParser().parseFromString(html, "text/html").body.textContent || "";
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + "..."
    : plainText;
}

function ShowAllUsers() {
  const [users, setUsers] = useState([]);
  const [clickedUserId, setClickedUserId] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://blogapi-production-fb2f.up.railway.app/user",
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
        const jsonData = await response.json();
        setUsers(jsonData); // Assuming API returns an array directly
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    }

    fetchUsers();
  }, []);

  const handleShare = (userId) => {
    // Logic to handle sharing the user profile
    console.log(`Sharing profile of user with ID: ${userId}`);
    // Add your share functionality here (e.g., making an API call to share the profile)
    setClickedUserId(userId); // Set the state to trigger animation
    setTimeout(() => {
      setClickedUserId(null); // Reset after 2 seconds
    }, 2000);
  };

  return (
    <>
      <NavBar />
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">User</h1>
          {users && users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {users.map((user) => (
                <div
                  key={user._id} // Adjust accordingly if the API uses a different ID field
                  className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
                >
                  <img
                    src={user.image || image} // Use imported image as fallback
                    alt="User's profile"
                    className="h-24 w-24 rounded-full mb-4 object-cover"
                  />
                  <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
                  <div className="flex gap-4">
                    <Link
                      to={`/user/${user._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      View Profile
                    </Link>
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
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No users available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ShowAllUsers;
