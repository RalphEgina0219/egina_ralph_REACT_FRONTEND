import React, { useState, useEffect } from "react";
import { getPost, storePost } from "../../api/post";
import "./styles/post.css";
import PostCard from "./PostCard";

export default function Post() {
  const { post, setPosts } = useState([]);
  const { message, setMessage } = useState("");
  const { error, setError } = useState("");
  const { processing, setProcessing } = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPost();
        setPosts(response.data.data || response.data);
      } catch (err) {
        console.error("Failed to load posts", err);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (message.trim() && error === "Post cannot be empty") {
      setError("");
    }
  }, [message, error]);

  const submit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Post cannot be empty");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const response = await storePost({ message });
      const newPost = response.data.data || response.data;
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setMessage("");
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        "Failed to share post. please try again.";
      setError(errMsg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="post-container">
      <div className="post-card">
        <form onSubmit={submit} className="post-form">
          <textarea
            value={message}
            placeholder="What is happening?!"
            className="post-textarea"
            onChange={(e) => setMessage(e.target.value)}
            disabled={processing}
          ></textarea>
          {error && <div className="post-error">{error}</div>}

          <div className="post-footer">
            <button
              type="submit"
              className="post-submit-btn"
              disabled={processing || !message.trim()}
            >
              {processing ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

     
    </div>
  );
} 