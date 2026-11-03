import { useEffect, useState } from "react";
import { getPost, storePost } from "../../api/post";
import "./styles/post.css";
import PostCard from "./PostCard";

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

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
        err.response?.data?.errors?.message?.[0] ||
        err.message ||
        "Failed to share post. Please try again.";
      console.error("Failed to share post", err);
      setError(errMsg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="post-container">
      <div className="post-card">
        <h1 className="post-title">Create Post</h1>
        <form onSubmit={submit} className="post-form">
          <textarea
            value={message}
            placeholder="What's on your mind?"
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

      <div className="post-feed-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id || Math.random()} post={post} />
          ))
        ) : (
          <div className="post-empty-state">No posts shared yet.</div>
        )}
      </div>
    </div>
  );
}