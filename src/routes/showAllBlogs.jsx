import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
function truncateHTMLContent(html, maxLength) {
  const plainText =
    new DOMParser().parseFromString(html, "text/html").body.textContent || "";
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + "..."
    : plainText;
}

function ShowAllBlogs() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://blogapi-production-fb2f.up.railway.app/blog",
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
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);

  return (
<>
            
      <NavBar />
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Blog Showcase</h1>
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((item) => (
              <div key={uuidv4()} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <p>
                  Links:{" "}
                  <a
                    href={item.links}
                    className="text-blue-500 hover:underline mb-4 block"
                  >
                    {item.links}
                  </a>
                </p>
                <p className="text-gray-600 mb-4">Tags: {item.tags}</p>
                <p className="text-gray-700">
                  {truncateHTMLContent(item.content, 150)}
                </p>
                <Link
                  to={`/blog/${item._id}`}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No data available</p>
        )}
      </div>
    </div>
    </>
  );
}

export default ShowAllBlogs;
