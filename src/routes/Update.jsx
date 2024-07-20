import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import NavBar from "../components/NavBar";

function Update() {
  const { id } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");
  const [links, setLinks] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const TinyMceApiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  const apiKey = import.meta.env.VITE_APP_API_KEY;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://blogapi-production-fb2f.up.railway.app/blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": apiKey,
            },
          },
        );
        const blog = response.data.blog;
        setTitle(blog.title);
        setLinks(blog.links);
        setTags(blog.tags);
        setEditorContent(blog.content);
        if (blog.thumbnail) {
          setThumbnailPreview(
            `https://blogapi-production-fb2f.up.railway.app${blog.thumbnail}`,
          );
        }
      } catch (error) {
        setError("Error fetching blog: " + error.message);
      }
    };
    fetchBlog();
  }, [id, apiKey]);

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleLinksChange = (event) => {
    setLinks(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !editorContent) {
      setError("Title and content are required.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", username);
      formData.append("links", links);
      formData.append("tags", tags);
      formData.append("content", editorContent);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const response = await axios.put(
        `https://blogapi-production-fb2f.up.railway.app/blog/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": apiKey,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Blog update response:", response);

      alert("Blog updated successfully!");
      navigate(`/blog/${id}`);
    } catch (error) {
      setError("Error updating blog: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4">
        <div className="max-w-7xl text-2xl mx-auto my-20 border-2 border-solid border-gray-300 p-6 bg-white rounded shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-center">Update Blog</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label htmlFor="title" className="block mb-1">
                Title:
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="w-full border-2 border-solid border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="links" className="block mb-1">
                Links:
              </label>
              <input
                type="text"
                name="links"
                id="links"
                value={links}
                onChange={handleLinksChange}
                className="w-full border-2 border-solid border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="tags" className="block mb-1">
                Tags:
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={tags}
                onChange={handleTagsChange}
                className="w-full border-2 border-solid border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="thumbnail" className="block mb-1">
                Thumbnail:
              </label>
              <input
                type="file"
                name="thumbnail"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="sr-only"
              />
              <label
                htmlFor="thumbnail"
                className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span>Upload a file</span>
              </label>
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="ml-4 h-36 w-36 object-cover rounded-md"
                />
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block mb-1">
                Content:
              </label>
              <Editor
                apiKey={TinyMceApiKey}
                initialValue={editorContent}
                init={{
                  height: 900,
                  width: "100%",
                  resize: false,
                  selector: "textarea",
                  menubar: true,
                  codesample_languages: [
                    { text: "HTML/XML", value: "markup" },
                    { text: "JavaScript", value: "javascript" },
                    { text: "CSS", value: "css" },
                    { text: "PHP", value: "php" },
                    { text: "Ruby", value: "ruby" },
                    { text: "Python", value: "python" },
                    { text: "Java", value: "java" },
                    { text: "C", value: "c" },
                    { text: "C#", value: "csharp" },
                    { text: "C++", value: "cpp" },
                  ],
                  plugins:
                    "codesample fullscreen wordcount code emoticons anchor image preview",
                  toolbar:
                    "fullscreen undo redo | backcolor forecolor bold italic | alignleft aligncenter alignright alignjustify | indent | codesample code | emoticons | anchor image",
                  content_style: "body { font-size: 24px; }",
                }}
                onEditorChange={handleEditorChange}
              />
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Update;
