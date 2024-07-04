import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

function Update() {
  const username = localStorage.getItem("username");
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");
  const [links, setLinks] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY; // Assuming this is correctly set up

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !editorContent) {
      setError("Title and content are required.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://blogapi-production-fb2f.up.railway.app/blog/new",
        {
          title,
          author: username,
          links,
          tags,
          content: editorContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Blog creation response:", response);

      alert("Blog created successfully!");
      setTitle("");
      setLinks("");
      setTags("");
      setEditorContent("");
      setError(null);
    } catch (error) {
      setError("Error creating blog: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            <label htmlFor="content" className="block mb-1">
              Content:
            </label>
            <Editor
              apiKey={apiKey}
              initialValue=""
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
                  "codesample wordcount code emoticons anchor image preview",
                toolbar:
                  "undo redo | preview wordcount | bold italic | alignleft aligncenter alignright justify | indent | codesample code | emoticons | anchor image",
                content_style: "body { font-size: 24px; }",
              }}
              onEditorChange={handleEditorChange}
            />
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Posting...' : 'Post Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Update;

