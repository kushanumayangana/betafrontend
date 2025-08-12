import React from 'react';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            <strong>{comment.user?.username || 'Anonymous'}:</strong> {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
