import { Route, Routes } from "react-router-dom";
import RequireAuth from "./components/PrivateRoute";
import ShowAllBlogs from "./routes/showAllBlogs";
import ShowBlog from "./routes/showBlog";
import ShowAllUsers from "./routes/showAllUsers";
import ShowUser from "./routes/showUser";
import Login from "./routes/Login";
import Register from "./routes/Register";
import ResetPassword from "./routes/Reset";
import ResetRequest from "./routes/ResetRequest";
import Settings from "./routes/Setting";
import GithubCallback from "./routes/GithubCallback"; // Ensure correct import

function App() {
  return (
    <Routes>
      <Route path="/auth/github/callback/:token" element={<GithubCallback />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <ShowAllBlogs />
          </RequireAuth>
        }
      />
      <Route
        path="/blog/:id"
        element={
          <RequireAuth>
            <ShowBlog />
          </RequireAuth>
        }
      />
      <Route
        path="/user"
        element={
          <RequireAuth>
            <ShowAllUsers />
          </RequireAuth>
        }
      />
      <Route
        path="/user/:id"
        element={
          <RequireAuth>
            <ShowUser />
          </RequireAuth>
        }
      />
      <Route
        path="/settings/:id"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-request" element={<ResetRequest />} />
      <Route path="/reset" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;

