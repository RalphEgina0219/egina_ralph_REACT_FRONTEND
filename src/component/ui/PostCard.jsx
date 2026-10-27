import React from 'react';
import './styles/postCard.css';

export default function PostCard({ post }) {
  return (
    <div className="post-item">
      <div className="post-content">
        <div className="post-header">
          <span className="post-username">
            {post.user?.name || 'Guest User'}
            </span>

            <small className="post-timestamp">
              {post.created_at ? new Date(post.created_at).toLocaleString() : 'Just Now'}
            </small>
        </div>
        <p className="post-message">{post.message}</p>
      </div>
    </div>
  );
}