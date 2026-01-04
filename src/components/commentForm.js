import React, { useState } from 'react';

const CommentForm = ({ onSubmit }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(commentText);
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Write a Comment
        </label>
        <textarea
          id="comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Share your thoughts about this property..."
          required
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting || !commentText.trim()}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          isSubmitting || !commentText.trim()
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : 'bg-teal-600 hover:bg-teal-700 text-white'
        }`}
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
};

export default CommentForm;
