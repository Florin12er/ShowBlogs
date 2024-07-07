import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import githubLogo from "../../public/github-original.svg"; // Adjust path as per your file structure

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      window.location.href = "/"; // Redirect to your dashboard route
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      const response = await axios.post(
        "https://blogapi-production-fb2f.up.railway.app/user/login",
        { email, password },
        { withCredentials: true }
      );
      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      window.location.href = "/";
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const response = await axios.post(
        "https://blogapi-production-fb2f.up.railway.app/user/guest"
      );
      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      window.location.href = "/";
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = "https://blogapi-production-fb2f.up.railway.app/auth/github";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none w-full"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleGuestLogin}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md focus:outline-none w-full mt-2"
          >
            Login as Guest
          </button>
          <button
            type="button"
            onClick={handleGitHubLogin}
            className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-md focus:outline-none w-full mt-2 flex items-center justify-center"
          >
            <img src={githubLogo} alt="GitHub Logo" className="w-6 h-6 mr-2" />
            Login with GitHub
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-600">
              Register here
            </Link>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Forgot your password?{" "}
            <Link
              to="/reset-request"
              className="text-blue-500 hover:text-blue-600"
            >
              Reset here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

