import React, { useState } from 'react';

export default function FeedbackForm({ onFeedbackAdded }) {
  
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem('username');
    if(!username){
        setMessage('Please log in to submit feedback');
        return;
    }
    if(!feedback.trim()){
        setMessage('Feedback cannot be empty');
        return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, feedback })
      });

      if (res.ok) {
        setFeedback('');
        setMessage("Feedback submitted successfully!");
        onFeedbackAdded();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || 'Failed to submit feedback');
      }
    } catch (error) {
      setMessage('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const username = localStorage.getItem('username');

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Display current user */}
      {username && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg">
          <p className="text-teal-800 font-medium">
            Logged in as: <span className="font-bold">{username}</span>
          </p>
        </div>
      )}

      {/* Message display */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-100 border border-green-200 text-green-800' 
            : 'bg-red-100 border border-red-200 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
            Your Feedback
          </label>
          <textarea
            id="feedback"
            placeholder="Share your thoughts, suggestions, or report any issues..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="4"
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting || !feedback.trim()}
          className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
            isSubmitting || !feedback.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
