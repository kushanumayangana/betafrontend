import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [comments, setComments] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/properties/user/${username}`);
        setProperties(res.data);
        console.log('Fetched properties:', res.data);
        
        // Debug image data
        res.data.forEach((prop, index) => {
          console.log(`Property ${index + 1}:`, {
            title: prop.title,
            imageUrl: prop.imageUrl,
            imagePath: prop.imageUrl ? `http://localhost:3001/uploads/${prop.imageUrl}` : 'No image'
          });
        });

        // Fetch comments for each property
        const commentsData = {};
        for (const prop of res.data) {
          try {
            const commentsRes = await axios.get(`http://localhost:3001/api/properties/${prop._id}/comments`);
            commentsData[prop._id] = commentsRes.data;
            console.log(`Comments for property ${prop._id}:`, commentsRes.data);
            // Debug each comment structure
            commentsRes.data.forEach((comment, index) => {
              console.log(`Comment ${index + 1}:`, {
                text: comment.text,
                username: comment.username,
                user: comment.user,
                author: comment.author,
                createdBy: comment.createdBy,
                createdAt: comment.createdAt,
                fullComment: comment
              });
            });
          } catch (err) {
            console.error(`Error fetching comments for property ${prop._id}:`, err);
            commentsData[prop._id] = [];
          }
        }
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching properties:', err);
      }
    };
    fetchUserProperties();
  }, [username]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      console.log('Deleting property with ID:', id);
      
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      const response = await axios.delete(`http://localhost:3001/api/properties/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Delete response:', response);
      setProperties(properties.filter((prop) => prop._id !== id));
      setShowDeleteConfirm(null); // Close confirmation dialog
    } catch (err) {
      console.error('Delete failed', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.');
      } else {
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  const confirmDelete = (propertyId, propertyTitle) => {
    setShowDeleteConfirm({ id: propertyId, title: propertyTitle });
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const openEditModal = (property) => {
    setEditForm({
      title: property.title || '',
      description: property.description || '',
      price: property.price || '',
      university: property.university || '',
      location: property.location || '',
      city: property.city || '',
      adress: property.adress || '',
      bedroom: property.bedroom || '',
      bathroom: property.bathroom || '',
      kitchen: property.kitchen || '',
      gender: property.gender || '',
      monthly: property.monthly || false,
      ownerName: property.ownerName || '',
      contact: property.contact || property.contactNumber || '',
      email: property.email || ''
    });
    setShowEditModal(property._id);
  };

  const closeEditModal = () => {
    setShowEditModal(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      const response = await axios.put(`http://localhost:3001/api/properties/${showEditModal}`, editForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update the property in the local state
      setProperties(properties.map(prop => 
        prop._id === showEditModal ? { ...prop, ...editForm } : prop
      ));

      alert('Property updated successfully!');
      closeEditModal();
    } catch (err) {
      console.error('Edit failed:', err);
      alert(err.response?.data?.message || 'Failed to update property. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-800 mb-4">My Posted Ads</h1>
          <p className="text-gray-600 text-lg">Manage your property listings</p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Properties Yet</h3>
              <p className="text-gray-500">You haven't posted any properties yet. Start by creating your first listing!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop) => (
              <div key={prop._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  {prop.imageUrl ? (
                    <img 
                      src={`http://localhost:3001/uploads/${prop.imageUrl}`} 
                      alt={prop.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Image failed to load:', prop.imageUrl);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center text-gray-500"
                    style={{ display: prop.imageUrl ? 'none' : 'flex' }}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏠</div>
                      <p className="text-sm">No Image</p>
                    </div>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Rs. {prop.price}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{prop.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{prop.description}</p>
                  
                  {/* Property Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-semibold text-teal-600 mr-2">🏫</span>
                      {prop.university}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-semibold text-teal-600 mr-2">📍</span>
                      {prop.location || prop.city || 'Location not specified'}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      💬 Comments ({comments[prop._id]?.length || 0})
                    </h4>
                    {comments[prop._id] && comments[prop._id].length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {comments[prop._id].slice(0, 3).map((comment, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                            <p className="text-gray-600 font-medium">
                              {comment.username || comment.user || comment.author || comment.createdBy || 'Anonymous'} :
                            </p>
                            <p className="text-gray-700 line-clamp-2">{comment.text}</p>
                          </div>
                        ))}
                        {comments[prop._id].length > 3 && (
                          <p className="text-xs text-teal-600 font-medium">
                            +{comments[prop._id].length - 3} more comments
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No comments yet</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => openEditModal(prop)}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(prop._id, prop.title)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-teal-800">Edit Property</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">University</label>
                  <input
                    type="text"
                    name="university"
                    value={editForm.university}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={editForm.city}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="adress"
                    value={editForm.adress}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    name="bedroom"
                    value={editForm.bedroom}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    name="bathroom"
                    value={editForm.bathroom}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kitchen</label>
                  <input
                    type="text"
                    name="kitchen"
                    value={editForm.kitchen}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={editForm.gender}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="any">Any</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={editForm.ownerName}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="text"
                    name="contact"
                    value={editForm.contact}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="monthly"
                      checked={editForm.monthly}
                      onChange={handleEditChange}
                      className="mr-2 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Monthly Payment</span>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-4 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-200 font-semibold disabled:opacity-50"
                >
                  {editLoading ? 'Updating...' : 'Update Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<span className="font-semibold">{showDeleteConfirm.title}</span>"?
              </p>
              <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
              
              <div className="flex space-x-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm.id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
