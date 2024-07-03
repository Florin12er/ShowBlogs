import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestBody = { email, resetCode: code, newPassword };
      console.log("Request body:", requestBody);
      const response = await axios.post(
        "https://blogapi-production-fb2f.up.railway.app/user/reset",
        requestBody,
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        setSuccess(true);
        window.location.href = "/login";
      } else {
        console.error("Failed to send reset password");
      }
    } catch (error) {
      console.error(
        "Failed to send reset password:",
        error.message,
        error.stack,
      );
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter email"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="code"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Reset Code
            </label>
            <input
              type="text"
              id="code"
              name="resetCode"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter reset code"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="newPassword"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter new password"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none"
          >
            Reset Password
          </button>
        </form>
        {success && (
          <p className="text-sm text-green-600 mt-4">
            Password reset successfully! You will be redirected to the login
            page.
          </p>
        )}
        <p className="text-sm text-gray-600 mt-4">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
