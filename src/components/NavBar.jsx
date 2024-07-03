import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="bg-white border-b-2 border-solid border-black shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-4xl font-bold">Blogs</div>
        <ul className="flex space-x-4">
          <li className="hover:text-blue-500 font-bold cursor-pointer">
            <Link to="/user">See Users</Link>
          </li>
          <li className="hover:text-blue-500 font-bold cursor-pointer">
            <Link to="/">See Blogs</Link>
          </li>
          <li className="hover:text-blue-500 font-bold cursor-pointer">
            <Link to="https://blog-maker-two.vercel.app/">Blog Maker</Link>
          </li>
        </ul>
        <form>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
}

export default NavBar;
