import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const UniversityPage = () => {
  const { universityName } = useParams();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationOptions, setShowLocationOptions] = useState(false);
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
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3001/api/properties/university/${encodeURIComponent(universityName)}`
        );
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
        
        setTimeout(() => setIsLoading(false), 800);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [universityName]);

  // Get current location using browser's geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocoding to get address from coordinates
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then(response => response.json())
          .then(data => {
            const locationName = data.locality || data.city || data.principalSubdivision || 'Your Current Location';
            setSearchForm(prev => ({ ...prev, location: locationName }));
            setShowLocationOptions(false);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error getting location name:', error);
            setSearchForm(prev => ({ ...prev, location: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}` }));
            setShowLocationOptions(false);
            setIsLoading(false);
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your current location. Please make sure location services are enabled.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Share location via WhatsApp
  const shareLocationViaWhatsApp = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out my location: ${mapsUrl}`)}`;
        
        // Open WhatsApp share dialog
        window.open(whatsappUrl, '_blank');
        setShowLocationOptions(false);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your current location for sharing.');
        setIsLoading(false);
      }
    );
  };

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

      if (isMatch) matching.push(property);
      else nonMatching.push(property);
    });

    setFilteredProperties([...matching, ...nonMatching]);
  };

  const getImageArray = (prop) => {
    const imagesField =
      prop.images ||
      prop.imageUrls ||
      prop.imageUrl ||
      prop.image ||
      prop.imagePath ||
      prop.imagesPath ||
      null;

    return Array.isArray(imagesField)
      ? imagesField
      : typeof imagesField === 'string' && imagesField
      ? [imagesField]
      : [];
  };

  const getSrc = (img) => {
    return String(img).startsWith('http') ? img : `http://localhost:3001/uploads/${img}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const sidebarVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(45, 212, 191, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const locationOptionsVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: -10 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const loadingVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0 }
  };

  const loadingDotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-teal-50"
    >
      {/* Animated Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="md:w-1/4 bg-white p-6 shadow-xl sticky top-0 h-full border-r border-teal-100"
      >
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent"
        >
          Filter Properties
        </motion.h2>

        {/* Location Input with Share Options */}
        <div className="relative mb-4">
          <motion.input
            variants={inputVariants}
            whileFocus="focus"
            type="text"
            placeholder="📍 Enter Location"
            value={searchForm.location}
            onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
            onFocus={() => setShowLocationOptions(true)}
            className="w-full border-2 border-gray-200 rounded-xl p-3 text-gray-700 focus:outline-none focus:border-teal-500 bg-gray-50 transition-all duration-300 pr-12"
          />
          
          {/* Location Icon Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLocationOptions(!showLocationOptions)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.button>

          {/* Location Options Dropdown */}
          <AnimatePresence>
            {showLocationOptions && (
              <motion.div
                variants={locationOptionsVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
              >
                <motion.button
                  whileHover={{ backgroundColor: '#f0fdfa' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={getCurrentLocation}
                  className="w-full p-4 text-left flex items-center space-x-3 hover:bg-teal-50 transition-colors duration-200 border-b border-gray-100"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Use Current Location</p>
                    <p className="text-sm text-gray-500">Automatically detect your location</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: '#f0fdfa' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={shareLocationViaWhatsApp}
                  className="w-full p-4 text-left flex items-center space-x-3 hover:bg-teal-50 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Share Location via WhatsApp</p>
                    <p className="text-sm text-gray-500">Share your location with others</p>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close dropdown when clicking outside */}
        {showLocationOptions && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowLocationOptions(false)}
          />
        )}

        <motion.select
          variants={inputVariants}
          whileFocus="focus"
          value={searchForm.gender}
          onChange={(e) => setSearchForm({ ...searchForm, gender: e.target.value })}
          className="w-full mb-4 border-2 border-gray-200 rounded-xl p-3 text-gray-700 focus:outline-none focus:border-teal-500 bg-gray-50 transition-all duration-300"
        >
          <option value="">👥 Choose Gender</option>
          <option value="male">👨 Male</option>
          <option value="female">👩 Female</option>
          <option value="any">🚻 Any</option>
        </motion.select>

        <motion.input
          variants={inputVariants}
          whileFocus="focus"
          type="text"
          placeholder="💰 Price Range (e.g. 10000-20000)"
          value={searchForm.price}
          onChange={(e) => setSearchForm({ ...searchForm, price: e.target.value })}
          className="w-full mb-4 border-2 border-gray-200 rounded-xl p-3 text-gray-700 focus:outline-none focus:border-teal-500 bg-gray-50 transition-all duration-300"
        />

        <motion.input
          variants={inputVariants}
          whileFocus="focus"
          type="number"
          placeholder="🛏️ Number of Bedrooms"
          value={searchForm.bedrooms}
          onChange={(e) => setSearchForm({ ...searchForm, bedrooms: e.target.value })}
          className="w-full mb-4 border-2 border-gray-200 rounded-xl p-3 text-gray-700 focus:outline-none focus:border-teal-500 bg-gray-50 transition-all duration-300"
        />

        <motion.input
          variants={inputVariants}
          whileFocus="focus"
          type="number"
          placeholder="🚿 Number of Bathrooms"
          value={searchForm.bathrooms}
          onChange={(e) => setSearchForm({ ...searchForm, bathrooms: e.target.value })}
          className="w-full mb-6 border-2 border-gray-200 rounded-xl p-3 text-gray-700 focus:outline-none focus:border-teal-500 bg-gray-50 transition-all duration-300"
        />

        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(19, 78, 74, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFilter}
          className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 relative overflow-hidden"
        >
          <span className="relative z-10">✨ Apply Filters</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-700 to-teal-900 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.aside>

      {/* Property Cards Section */}
      <div className="w-full md:w-3/4 p-6">
        {/* Loading Animation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              variants={loadingVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center h-64"
            >
              <motion.div className="flex space-x-2 mb-4">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    variants={loadingDotVariants}
                    className="w-4 h-4 bg-teal-600 rounded-full"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                ))}
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 text-lg"
              >
                Finding perfect homes near {universityName}...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Property Grid */}
        <AnimatePresence>
          {!isLoading && (
            <motion.div
              key="property-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProperties.map((property, index) => {
                const imagesArray = getImageArray(property);
                const mainImage = imagesArray.length > 0 ? getSrc(imagesArray[0]) : null;

                return (
                  <motion.div
                    key={property._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                  >
                    <Link to={`/university/${universityName}/property/${property._id}`}>
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                        {/* Image Container */}
                        <div className="relative overflow-hidden">
                          {mainImage ? (
                            <motion.img
                              src={mainImage}
                              alt={property.title}
                              className="w-full h-48 object-cover"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.4 }}
                            />
                          ) : (
                            <motion.div 
                              className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                              whileHover={{ scale: 1.05 }}
                            >
                              <motion.div 
                                className="text-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                              >
                                <div className="text-5xl mb-2">🏠</div>
                                <p className="text-gray-500 font-medium">No Image Available</p>
                              </motion.div>
                            </motion.div>
                          )}
                          {/* Price Badge */}
                          <motion.div 
                            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <span className="text-teal-700 font-bold text-sm">
                              LKR {property.rent || property.price}
                            </span>
                          </motion.div>
                        </div>

                        {/* Content */}
                        <motion.div 
                          className="p-5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                            {property.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                            {property.description}
                          </p>
                          
                          <div className="space-y-2">
                            <motion.p 
                              className="text-sm text-gray-500 flex items-center"
                              whileHover={{ x: 5 }}
                            >
                              <span className="mr-2">📍</span>
                              {property.location || property.city}
                            </motion.p>
                            
                            {property.bedroom && (
                              <motion.p 
                                className="text-sm text-gray-500 flex items-center"
                                whileHover={{ x: 5 }}
                              >
                                <span className="mr-2">🛏️</span>
                                {property.bedroom} Bedroom{property.bedroom > 1 ? 's' : ''}
                              </motion.p>
                            )}
                            
                            {property.bathroom && (
                              <motion.p 
                                className="text-sm text-gray-500 flex items-center"
                                whileHover={{ x: 5 }}
                              >
                                <span className="mr-2">🚿</span>
                                {property.bathroom} Bathroom{property.bathroom > 1 ? 's' : ''}
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results Message */}
        <AnimatePresence>
          {!isLoading && filteredProperties.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                🏡
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No Properties Found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to find more options near {universityName}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default UniversityPage;