import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UniversityPage = () => {
  const { universityName } = useParams();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchForm, setSearchForm] = useState({
    location: '',
    gender: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/properties/university/${encodeURIComponent(universityName)}`
        );
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data); // default display
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [universityName]);

  const handleFilter = () => {
    const location = searchForm.location.trim().toLowerCase();
    const gender = searchForm.gender.trim().toLowerCase();
    const price = searchForm.price.trim();
    const bedrooms = searchForm.bedrooms.trim();
    const bathrooms = searchForm.bathrooms.trim();

    const matching = [];
    const nonMatching = [];

    properties.forEach((property) => {
      const matchLocation = location && property.location?.toLowerCase().includes(location);
      const matchGender = gender && property.gender?.toLowerCase() === gender;
      const matchBedrooms = bedrooms && property.bedroom?.toString() === bedrooms;
      const matchBathrooms = bathrooms && property.bathroom?.toString() === bathrooms;

      let matchPrice = true;
      if (price.includes('-')) {
        const [min, max] = price.split('-').map(Number);
        matchPrice = property.price >= min && property.price <= max;
      }

      const isMatch =
        (location && matchLocation) ||
        (gender && matchGender) ||
        (price && matchPrice) ||
        (bedrooms && matchBedrooms) ||
        (bathrooms && matchBathrooms);

      if (isMatch) {
        matching.push(property);
      } else {
        nonMatching.push(property);
      }
    });

    setFilteredProperties([...matching, ...nonMatching]);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="md:w-1/4 bg-white p-6 shadow-lg sticky top-0 h-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Filter Properties</h2>

        <input
          type="text"
          placeholder="Enter Location"
          value={searchForm.location}
          onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
          className="w-full mb-4 border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={searchForm.gender}
          onChange={(e) => setSearchForm({ ...searchForm, gender: e.target.value })}
          className="w-full mb-4 border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="any">Any</option>
        </select>

        <input
          type="text"
          placeholder="Price Range (e.g. 10000-20000)"
          value={searchForm.price}
          onChange={(e) => setSearchForm({ ...searchForm, price: e.target.value })}
          className="w-full mb-4 border border-gray-300 rounded-md p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Number of Bedrooms"
          value={searchForm.bedrooms}
          onChange={(e) => setSearchForm({ ...searchForm, bedrooms: e.target.value })}
          className="w-full mb-4 border border-gray-300 rounded-md p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Number of Bathrooms"
          value={searchForm.bathrooms}
          onChange={(e) => setSearchForm({ ...searchForm, bathrooms: e.target.value })}
          className="w-full mb-6 border border-gray-300 rounded-md p-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleFilter}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 rounded-md shadow-md transition duration-300"
        >
          Apply Filters
        </button>
      </aside>

      {/* Property Cards */}
      <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {filteredProperties.map((property) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link to={`/university/${universityName}/property/${property._id}`}>
              <div className="relative border rounded p-3 shadow-md hover:shadow-xl transition duration-300 bg-white">
        
               {(property.gender?.toLowerCase() === 'male' || property.gender?.toLowerCase() === 'female') && (
      <span className={`absolute bottom-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded
        ${property.gender?.toLowerCase() === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
        {property.gender?.toLowerCase() === 'male' ? '👨 Male' : '👩 Female'}
      </span>
    )}
              
                <img
                  src={`http://localhost:3001/uploads/${property.image}`}
                  alt={property.title}
                  className="w-full h-40 object-cover rounded"
                />

                <h3 className="font-bold mt-2 flex items-center text-black">
                  {property.title}
                  {searchForm.location &&
                    property.location?.toLowerCase().includes(searchForm.location.toLowerCase()) && (
                      <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                        Near You
                      </span>
                    )}
                </h3>
                <p className="text-gray-700">📍 {property.location}</p>
                <p className="text-gray-700">Room: {property.bedroom}</p>
                <p className="text-gray-700">Bath: {property.bathroom}</p>
                <p className="text-gray-700">📞 {property.contactNumber}</p>
                <p className="text-black font-semibold">LKR {property.price}</p>
                <p className="text-sm text-gray-500">
                  {property.monthly ? 'Per Month' : 'Just Once'}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UniversityPage;
