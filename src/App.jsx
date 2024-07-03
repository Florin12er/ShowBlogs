import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ShowAllBlogs from "./routes/showAllBlogs";
import ShowBlog from "./routes/showBlog";
import ShowAllUsers from "./routes/showAllUsers";
import ShowUser from "./routes/showUser";
import RequireAuth from "./components/PrivateRoute.jsx";

function App() {
  return (
    <>
      <NavBar />
      <RequireAuth>
        <Routes>
          <Route path="/" element={<ShowAllBlogs />} />
          <Route path="/blog/:id" element={<ShowBlog />} />
          <Route path="/user" element={<ShowAllUsers />} />
          <Route path="/user/:id" element={<ShowUser />} />
        </Routes>
      </RequireAuth>
    </>
  );
}

export default App;

