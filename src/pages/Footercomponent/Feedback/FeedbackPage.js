import React, { useState } from 'react';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

export default function FeedbackPage() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            User Feedback
          </h1>
          <p className="text-gray-600 text-lg">
            Share your thoughts and help us improve your experience
          </p>
        </div>

        {/* Feedback Form */}
        <div className="mb-8">
          <FeedbackForm onFeedbackAdded={() => setRefresh(!refresh)} />
        </div>

        {/* Feedback List */}
        <div>
          <FeedbackList key={refresh} />
        </div>
      </div>
    </div>
  );
}
