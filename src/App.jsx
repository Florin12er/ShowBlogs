import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ShowAllBlogs from "./routes/showAllBlogs";
import ShowBlog from "./routes/showBlog";
import ShowAllUsers from "./routes/showAllUsers";
import ShowUser from "./routes/showUser";
import RequireAuth from "./components/PrivateRoute.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import ResetPassword from "./routes/Reset.jsx";
import ResetRequest from "./routes/ResetRequest";


function App() {
  return (
    <>
      <RequireAuth>
        <Routes>
          <Route path="/" element={<ShowAllBlogs />} />
          <Route path="/blog/:id" element={<ShowBlog />} />
          <Route path="/user" element={<ShowAllUsers />} />
          <Route path="/user/:id" element={<ShowUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-request" element={<ResetRequest />} />
          <Route path="/reset" element={<ResetPassword />} />
        </Routes>
      </RequireAuth>
    </>
  );
}

export default App;
