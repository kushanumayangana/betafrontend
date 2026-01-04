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

const buildImageUrl = (img) => {
  if (!img) return null;

  if (typeof img === 'object') {
    const possible = img.url || img.path || img.filename || img.fileName || img.imageUrl;
    img = possible || null;
  }

  if (!img) return null;

  const str = String(img);
  if (str.startsWith('http')) return str;
  return `http://localhost:3001/uploads/${str}`;
};

const normalizeImages = (property) => {
  if (!property) return [];
  const fields = [
    property.images,
    property.imageUrls,
    property.imageUrl,
    property.image,
    property.imagePath,
    property.imagesPath,
  ];

  for (const f of fields) {
    if (!f) continue;
    if (Array.isArray(f) && f.length > 0) {
      return f.map(buildImageUrl).filter(Boolean);
    }
    if (typeof f === 'string' && f.trim()) {
      return [buildImageUrl(f)].filter(Boolean);
    }
    if (typeof f === 'object' && Object.keys(f).length > 0) {
      return [buildImageUrl(f)].filter(Boolean);
    }
  }
  return [];
};

const UniversityPropertyDetailPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [images, setImages] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [locationLink, setLocationLink] = useState(''); // Added state for location link

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/properties/${propertyId}`);
        if (!res.ok) throw new Error(`Failed to fetch property. Status: ${res.status}`);
        const data = await res.json();
        const normalized = Array.isArray(data)
          ? data[0]
          : (data && typeof data === 'object' && data.property) ? data.property : data;
        setProperty(normalized);
        const imgs = normalizeImages(normalized);
        setImages(imgs);
        setSelectedIdx(0);
        console.log('Fetched property:', data);
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

    try {
      const res = await fetch(`http://localhost:3001/api/properties/${propertyId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to post comment. Status: ${res.status}`);
      }

      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setCommentError('');
    } catch (err) {
      console.error('Error adding comment:', err);
      if ((err.message || '').toLowerCase().includes('token') || (err.message || '').toLowerCase().includes('unauthorized')) {
        setCommentError('Session expired or invalid token. Please log in again.');
      } else {
        setCommentError(err.message || 'Failed to add comment.');
      }
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://www.google.com/maps/@${latitude},${longitude},15z`;
        setLocationLink(locationUrl); // Set the location link
      }, (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please check your browser settings.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
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
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-4xl font-extrabold text-black mb-8 tracking-tight drop-shadow-sm"
      >
        {property.title}
      </motion.h1>

      {/* Gallery: main image + thumbnails */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="overflow-hidden rounded-2xl shadow-xl mb-10 cursor-pointer"
      >
        {images.length > 0 ? (
          <div>
            <img
              src={images[selectedIdx]}
              alt={`${property.title} - ${selectedIdx + 1}`}
              className="w-full h-[400px] object-cover rounded-t-2xl"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />

            {images.length > 1 && (
              <div className="mt-3 px-3 pb-3 flex gap-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIdx(idx)}
                    className={`w-28 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${idx === selectedIdx ? 'border-teal-600' : 'border-transparent'} shadow-sm`}
                    title={`View image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          (() => {
            const imageKey = property.imageUrl || property.image || property.imagePath;
            const src = imageKey ? (String(imageKey).startsWith('http') ? imageKey : `http://localhost:3001/uploads/${imageKey}`) : null;
            return src ? (
              <img
                src={src}
                alt={property.title}
                className="w-full h-[400px] object-cover"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-gray-500">
                <div className="text-center w-full">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p>No Image</p>
                </div>
              </div>
            );
          })()
        )}
      </motion.div>

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
            {(() => {
              const contactNum = property.contactNumber || property.contact || property.phone || property.phoneNumber;
              return contactNum ? (
                <a
                  href={`tel:${contactNum}`}
                  className="text-gray-700 hover:underline"
                  title="Call Owner"
                >
                  {contactNum}
                </a>
              ) : (
                <span className="text-gray-500">Not provided</span>
              );
            })()}
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
            Price: LKR {property.rent || property.price} per month
          </p>
          <p>
            <span className="font-semibold text-black">Rooms:</span>{' '}
            {property.bedroom} Bedrooms | {property.bathroom} Bathrooms | {property.kitchen} Kitchen
          </p>
          <p>
            <span className="font-semibold text-black">Target Gender:</span> {property.gender}
          </p>
        </div>
      </motion.section>

      <motion.hr
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="my-12 border-gray-300"
      />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-black mb-6">Share Your Location</h2>
        <button
          onClick={getCurrentLocation}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Get Current Location
        </button>
        {locationLink && (
          <div className="mt-4">
            <p className="text-gray-700">Your Location Link:</p>
            <a href={locationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {locationLink}
            </a>
          </div>
        )}
      </motion.section>

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