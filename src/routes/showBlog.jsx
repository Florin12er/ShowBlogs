import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import DOMPurify from "dompurify";
import NavBar from "../components/NavBar";
import axios from "axios";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import ruby from "react-syntax-highlighter/dist/esm/languages/hljs/ruby"
SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("ruby", ruby)

import {
    atelierDuneLight,
  docco,
  qtcreatorLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

function ShowBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://blogapi-production-fb2f.up.railway.app/blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.data.blog) {
          throw new Error("Blog not found");
        }
        setBlog(response.data.blog);
        setComments(
          response.data.blog.comments.map((comment) => ({
            ...comment,
            uuid: comment._id, // Assuming _id is the unique identifier for comments
          })),
        );
      } catch (error) {
        console.error("Error fetching blog: ", error);
        setError("Error fetching blog. Please try again later.");
      }
    }

    fetchBlog();
  }, [id]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://blogapi-production-fb2f.up.railway.app/blog/${id}/comment`,
        { content: commentContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const newComment = {
        ...response.data.comment,
        uuid: response.data.comment._id,
      };
      setComments([...comments, newComment]);
      setCommentContent("");
    } catch (error) {
      console.error("Error adding comment: ", error);
      setError("Error adding comment. Please try again later.");
    }
  };

  const handleUpdateComment = async (commentId, updatedContent) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://blogapi-production-fb2f.up.railway.app/blog/${id}/comment/${commentId}`,
        { content: updatedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.uuid === commentId
            ? { ...comment, content: updatedContent }
            : comment,
        ),
      );
    } catch (error) {
      console.error("Error updating comment: ", error);
      setError("Error updating comment. Please try again later.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://blogapi-production-fb2f.up.railway.app/blog/${id}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.uuid !== commentId),
      );
    } catch (error) {
      console.error("Error deleting comment: ", error);
      setError("Error deleting comment. Please try again later.");
    }
  };

  if (!blog) {
    return <p>Loading...</p>;
  }

  // Sanitize and render blog content
  const sanitizedHtml = DOMPurify.sanitize(blog.content, {
    ADD_TAGS: ["style"],
    ADD_ATTR: ["style"],
    FORBID_ATTR: ["class"],
  });

  // Prism syntax highlighting component
  const CodeBlock = ({ language, value }) => {
    return (
      <SyntaxHighlighter
        showLineNumbers={true}
        wrapLines
        language={language}
        style={docco}
      >
        {value}
      </SyntaxHighlighter>
    );
  };
  const renderHtmlWithSyntaxHighlighting = (htmlContent) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = htmlContent;
    const codeBlocks = wrapper.querySelectorAll("pre code");
    codeBlocks.forEach((codeBlock) => {
      const language = codeBlock.className.replace("language", "");
      const code = codeBlock.textContent;
      const parent = codeBlock.parentNode;
      const codeBlockHtml = renderToStaticMarkup(
        <CodeBlock language={language} value={code} />,
      );
      parent.innerHTML = codeBlockHtml;
    });
    return wrapper.innerHTML;
  };
  return (
    <>
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
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
          <div className="p-14">
            <div
              className="max-w-3xl prose"
              dangerouslySetInnerHTML={{
                __html: renderHtmlWithSyntaxHighlighting(sanitizedHtml),
              }}
            />
          </div>
        </article>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {comments.length === 0 && <p>No comments yet.</p>}
          {comments.map((comment) => (
            <div key={comment.uuid} className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="text-gray-800">{comment.content}</p>
              <div className="flex mt-2">
                <button
                  onClick={() => {
                    const updatedContent = prompt(
                      "Enter updated content:",
                      comment.content,
                    );
                    if (updatedContent) {
                      handleUpdateComment(comment.uuid, updatedContent);
                    }
                  }}
                  className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this comment?",
                      )
                    ) {
                      handleDeleteComment(comment.uuid);
                    }
                  }}
                  className="text-sm text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Add a Comment</h2>
          <form onSubmit={handleSubmitComment}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Write your comment here..."
              rows="4"
              required
            />
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mt-4 focus:outline-none"
            >
              Add Comment
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ShowBlog;
