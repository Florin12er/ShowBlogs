import { Link } from "react-router-dom";
import { truncateHTMLContent } from "../hooks/useBlogData";

function BlogCard({ blog, onLike, onUnlike, onDislike, onUndislike }) {
  return (
    <div key={blog._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
      {blog.thumbnail && (
        <img
          src={`https://blogapi-1jcl.onrender.com${blog.thumbnail}`}
          alt={blog.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
        <h3 className="text-lg mb-2">Author: {blog.author}</h3>
        <p className="text-gray-600 mb-2">
          Links:{" "}
          <a
            href={blog.links}
            className="text-blue-500 hover:underline"
          >
            {blog.links}
          </a>
        </p>
        <p className="text-gray-600 mb-4">Tags: {blog.tags}</p>
        <p className="text-gray-700 mb-4">
          {truncateHTMLContent(blog.content, 150)}
        </p>
        <Link
          to={`/blog/${blog._id}`}
          className="text-blue-500 hover:underline block mb-4"
        >
          Read More →
        </Link>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() =>
                blog.likes > 0 ? onUnlike(blog._id) : onLike(blog._id)
              }
              className={`flex items-center px-3 py-1 rounded-md ${
                blog.likes > 0
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="mr-1"
              >
                <path
                  fill="currentColor"
                  d="m20.27 16.265l.705-4.08a1.666 1.666 0 0 0-1.64-1.95h-5.181a.833.833 0 0 1-.822-.969l.663-4.045a4.783 4.783 0 0 0-.09-1.973a1.635 1.635 0 0 0-1.092-1.137l-.145-.047a1.346 1.346 0 0 0-.994.068c-.34.164-.588.463-.68.818l-.476 1.834a7.628 7.628 0 0 1-.656 1.679c-.415.777-1.057 1.4-1.725 1.975l-1.439 1.24a1.67 1.67 0 0 0-.572 1.406l.812 9.393A1.666 1.666 0 0 0 8.597 22h4.648c3.482 0 6.453-2.426 7.025-5.735"
                ></path>
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M2.968 9.485a.75.75 0 0 1 .78.685l.97 11.236a1.237 1.237 0 1 1-2.468.107V10.234a.75.75 0 0 1 .718-.749"
                  clipRule="evenodd"
                ></path>
              </svg>
              {blog.likes > 0 ? blog.likes : "Like"}
            </button>
            <button
              onClick={() =>
                blog.dislikes > 0 ? onUndislike(blog._id) : onDislike(blog._id)
              }
              className={`flex items-center px-3 py-1 rounded-md ${
                blog.dislikes > 0
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className="mr-1"
              >
                <path
                  fill="currentColor"
                  d="m20.27 8.485l.705 4.08a1.666 1.666 0 0 1-1.64 1.95h-5.181a.833.833 0 0 0-.822.969l.663 4.045a4.78 4.78 0 0 1-.09 1.974c-.139.533-.55.962-1.092 1.136l-.145.047c-.328.105-.685.08-.994-.068a1.264 1.264 0 0 1-.68-.818l-.476-1.834a7.627 7.627 0 0 0-.656-1.679c-.415-.777-1.057-1.4-1.725-1.975l-1.439-1.24a1.668 1.668 0 0 1-.572-1.406l.812-9.393A1.666 1.666 0 0 1 8.597 2.75h4.648c3.482 0 6.453 2.426 7.025 5.735"
                ></path>
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M2.968 15.265a.75.75 0 0 0 .78-.685l.97-11.236a1.237 1.237 0 1 0-2.468-.107v11.279a.75.75 0 0 0 .718.75"
                  clipRule="evenodd"
                ></path>
              </svg>
              {blog.dislikes > 0 ? blog.dislikes : "Dislike"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;

