import React from 'react';

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">💬</div>
        <p className="text-lg font-medium">No comments yet</p>
        <p className="text-sm">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <div key={comment._id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-semibold text-sm">
                  {(comment.user?.username || comment.username || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-gray-900">
                  {comment.user?.username || comment.username || 'Anonymous'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {comment.createdAt 
                    ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'Recently'
                  }
                </span>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {comment.text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
