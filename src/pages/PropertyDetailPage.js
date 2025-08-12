// src/pages/PropertyDetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import comment components — adjust path if needed
import CommentForm from '../components/commentForm';
import CommentList from '../components/commentList';

const PropertyDetailPage = () => {
  const { id } = useParams();  // property ID from URL params
  const [property, setProperty] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch property details
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/properties/${id}`);
        if (!res.ok) throw new Error('Failed to fetch property data');
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error('Error loading property:', err);
      }
    };

    // Fetch comments for this property
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/properties/${id}/comments`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error('Error loading comments:', err);
      }
    };

    fetchProperty();
    fetchComments();
  }, [id]);

  // Handle new comment submission
 const handleNewComment = async (text) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found – user must be logged in');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3001/api/properties/${id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text }), // Make sure your backend expects 'text'
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Comment failed:', errorData.message);
      return;
    }

    console.log('Comment posted successfully');
  } catch (error) {
    console.error('Error posting comment:', error.message);
  }
};



  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{property.title}</h2>

      <motion.img
        src={`http://localhost:3001/uploads/${property.imageUrl}`}
        alt={property.title}
        className="w-full h-[400px] object-cover rounded-xl mb-6"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-base">
        <div>
          
          <p><strong>Description:</strong> {property.description}</p>
          <p><strong>Owner:</strong> {property.ownerName}</p>
          <p><strong>Contact:</strong> {property.contactNumber}</p>
          <p><strong>Email:</strong> {property.email}</p>
          <p><strong>University:</strong> {property.university}</p>
          <p><strong>City:</strong> {property.city}</p>
          <p><strong>Address:</strong> {property.adress}</p>
          <p><strong>Location:</strong> {property.location}</p>
        </div>
        <div>
          <p><strong>Gender:</strong> {property.gender}</p>
          <p><strong>Bedroom:</strong> {property.bedroom}</p>
          <p><strong>Bathroom:</strong> {property.bathroom}</p>
          <p><strong>Kitchen:</strong> {property.kitchen}</p>
          <p><strong>Bed:</strong> {property.bed}</p>
          <p><strong>Price:</strong> LKR {property.price}</p>
          <p><strong>Payment Type:</strong> {property.monthly ? 'Per Month' : 'Just Once'}</p>
        </div>
      </div>

      <motion.div
        className="mt-8 text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow">
          Contact Owner
        </button>
      </motion.div>

      {/* Comments Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <CommentList comments={comments} />
        <h3 className="text-xl font-semibold mt-6 mb-2">Leave a Comment</h3>
        <CommentForm onSubmit={handleNewComment} />
      </div>
    </motion.div>
  );
};

export default PropertyDetailPage;
