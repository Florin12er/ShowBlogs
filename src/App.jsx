import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ShowAllBlogs from "./routes/showAllBlogs";
import NavBar from "./components/NavBar";
import ShowBlog from "./routes/showBlog";
import ShowAllUsers from "./routes/showAllUsers";
import ShowUser from "./routes/showUser";
function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<ShowAllBlogs />} />
        <Route path="/blog/:id" element={<ShowBlog />}></Route>
        <Route path="/user" element={<ShowAllUsers />}></Route>
        <Route path="/user/:id" element={<ShowUser/>}></Route>
      </Routes>
    </>
  );
}

export default App;
