import { Route, Routes } from "react-router-dom";
import RequireAuth from "./components/PrivateRoute";
import NavBar from "./components/NavBar";
import ShowAllBlogs from "./routes/showAllBlogs";
import ShowBlog from "./routes/showBlog";
import ShowAllUsers from "./routes/showAllUsers";
import ShowUser from "./routes/showUser";
import Login from "./routes/Login";
import Register from "./routes/Register";
import ResetPassword from "./routes/Reset";
import ResetRequest from "./routes/ResetRequest";
import Settings from "./routes/Setting";
import GitHubCallback from "./routes/GithubCallback";

import YourBlogs from "./routes/YourBlogs";
import Update from "./routes/Update";
import { ThemeProvider } from "./components/ThemeContext";
function App() {
  return (
    <>
        <Routes>
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
          <Route path="/auth/github" element={<GitHubCallback/>} /> {/* Add GitHubCallback route */}
        </Routes>
    </>
  );
}

export default App;

