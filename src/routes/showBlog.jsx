import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ShowBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://blogapi-production-fb2f.up.railway.app/blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setBlog(jsonData.blog); // Assuming the API returns { blog: {...} }
      } catch (error) {
        console.error("Error fetching blog: ", error);
      }
    }

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow-lg">
        <header className="p-6 bg-gray-100 rounded-t-lg">
          <h1 className="text-4xl font-bold text-center">{blog.title}</h1>
          <div className="mt-4">
            <p className="text-gray-600 mb-2">Tags: {blog.tags}</p>
            <p className="text-gray-600">
              Links:{" "}
              <a href={blog.links} className="text-blue-500 hover:underline">
                {blog.links}
              </a>
            </p>
          </div>
        </header>
        <div className="p-6">
          <div
            className="text-gray-700 prose"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>
    </div>
  );
}

export default ShowBlog;
