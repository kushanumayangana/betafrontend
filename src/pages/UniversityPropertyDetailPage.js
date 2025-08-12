import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import CommentForm from '../components/commentForm';
import CommentList from '../components/commentList';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const UniversityPropertyDetailPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/properties/${propertyId}`);
        if (!res.ok) throw new Error(`Failed to fetch property. Status: ${res.status}`);
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details.');
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/properties/${propertyId}/comments`);
        if (!res.ok) throw new Error(`Failed to fetch comments. Status: ${res.status}`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments.');
      }
    };

    fetchProperty();
    fetchComments();
  }, [propertyId]);

  const handleNewComment = async (text) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setCommentError('You must be logged in to comment.');
      return;
    }

    console.log('Token for comment:', token);
    console.log('Comment text:', text);
    console.log('Property ID:', propertyId);

    try {
      const res = await fetch(`http://localhost:3001/api/properties/${propertyId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error response data:', errorData);
        throw new Error(errorData.message || `Failed to post comment. Status: ${res.status}`);
      }

      const newComment = await res.json();
      console.log('New comment created:', newComment);
      setComments((prev) => [...prev, newComment]);
      setCommentError('');
    } catch (err) {
      console.error('Error adding comment:', err);
      if (err.message.toLowerCase().includes('token') || err.message.toLowerCase().includes('unauthorized')) {
        setCommentError('Session expired or invalid token. Please log in again.');
      } else {
        setCommentError(err.message || 'Failed to add comment.');
      }
    }
  };

  if (error) {
    return (
      <motion.div
        {...fadeInUp}
        className="max-w-4xl mx-auto p-6 text-center text-red-600 font-semibold"
      >
        {error}
      </motion.div>
    );
  }

  if (!property) {
    return (
      <motion.div
        {...fadeInUp}
        className="max-w-4xl mx-auto p-6 text-center text-gray-500 italic"
      >
        Loading property details...
      </motion.div>
    );
  }

  return (
    <motion.main
      {...fadeInUp}
      className="max-w-5xl mx-auto p-8 bg-white rounded-3xl shadow-lg mt-12 mb-20"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl font-extrabold text-black mb-8 tracking-tight drop-shadow-sm"
      >
        {property.title}
      </motion.h1>

      {/* Image with scale hover */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="overflow-hidden rounded-2xl shadow-xl mb-10 cursor-pointer"
      >
        <img
          src={`http://localhost:3001/uploads/${property.imageUrl}`}
          alt={property.title}
          className="w-full h-[400px] object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Property Info Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="grid gap-10 md:grid-cols-2 text-gray-900 text-lg"
      >
        <div className="space-y-5">
          <p>
            <span className="font-semibold text-black">Description:</span> {property.description}
          </p>
          <p>
            <span className="font-semibold text-black">Owner:</span> {property.ownerName}
          </p>
          <p>
            <span className="font-semibold text-black">Contact:</span>{' '}
            <a
              href={`tel:${property.contactNumber}`}
              className="text-gray-700 hover:underline"
              title="Call Owner"
            >
              {property.contactNumber}
            </a>
          </p>
          <p>
            <span className="font-semibold text-black">University:</span> {property.university}
          </p>
          
          <p>
            <span className="font-semibold text-black">Location:</span> {property.city},{' '}
            {property.adress}
          </p>
        </div>
      

        <div className="space-y-5">
          <p className="text-black text-xl font-semibold">
            Price: LKR {property.price}{' '}
            <span className="text-gray-600 text-base font-normal">
              ({property.monthly ? 'Per Month' : 'One Time'})
            </span>
          </p>
          <p>
            <span className="font-semibold text-black">Rooms:</span>{' '}
            {property.bedroom} Bedrooms | {property.bathroom} Bathrooms | {property.kitchen} Kitchen
          </p>
          <p>
            
          <p className="font-semibold text-black">Target Gender : {property.gender}
            </p> 
          
          </p>
          {/* Add more details here if needed */}
        </div>
      </motion.section>

      {/* Divider */}
      <motion.hr
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="my-12 border-gray-300"
      />

      {/* Comments Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-black mb-6">Leave a Comment</h2>

        {commentError && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700 font-semibold shadow-inner">
            {commentError}
          </div>
        )}

        <CommentForm onSubmit={handleNewComment} />

        <h2 className="mt-14 mb-8 text-3xl font-bold text-black">Comments</h2>

        <CommentList comments={comments} />
      </motion.section>
    </motion.main>
  );
};

export default UniversityPropertyDetailPage;
