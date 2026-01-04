import React, { useEffect, useState } from 'react';

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/feedback');
      if (!res.ok) {
        throw new Error('Failed to fetch feedbacks');
      }
      const data = await res.json();
      
      // Ensure data is an array, if not, try to extract it or default to empty array
      let feedbacksArray = [];
      if (Array.isArray(data)) {
        feedbacksArray = data;
      } else if (data && typeof data === 'object' && Array.isArray(data.feedbacks)) {
        feedbacksArray = data.feedbacks;
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        feedbacksArray = data.data;
      } else {
        console.warn('Unexpected feedback data structure:', data);
        feedbacksArray = [];
      }
      
      setFeedbacks(feedbacksArray);
      setError('');
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks. Please try again later.');
      setFeedbacks([]); // Ensure feedbacks is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Ensure feedbacks is always an array before rendering
  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];

  if (loading) {
    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-600">Loading feedbacks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={fetchFeedbacks}
            className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (safeFeedbacks.length === 0) {
    return (
      <div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-lg font-medium">No feedback yet</p>
          <p className="text-sm">Be the first to share your thoughts!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-teal-50 border-b border-teal-200">
        <h3 className="text-lg font-semibold text-teal-800">
          User Feedbacks ({safeFeedbacks.length})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {safeFeedbacks.map((feedback) => (
          <div key={feedback._id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-semibold text-sm">
                    {feedback.username ? feedback.username.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {feedback.username || 'Anonymous'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    {feedback.createdAt 
                      ? new Date(feedback.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'Recently'
                    }
                  </span>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {feedback.feedback}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
