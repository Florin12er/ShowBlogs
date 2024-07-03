import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ResetRequest() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://blogapi-production-fb2f.up.railway.app/user/request-reset",
        { email },
      );
      if (response.status === 200) {
        setSuccess(true);
        window.location.href = "/reset";
      } else {
        setError("Failed to send reset code");
      }
    } catch (error) {
      setError("Failed to send reset code");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Please enter your email address. We will send you a reset code.
        </p>
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
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none"
          >
            Send Reset Code
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm">
              Reset code sent successfully!
            </p>
          )}
        </form>
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

export default ResetRequest;
