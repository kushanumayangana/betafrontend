import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Addbodim() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gender: '',
    rent: '',
    monthly: false,
    ownerName: '',
    contact: '',
    email: '',
    image: null,
    images: [],
    university: '',
    city: '',
    adress: '',
    location: '',
    bedroom: '',
    bathroom: '',
    kitchen: '',
    bed: '',
  });
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      alert('Please login to continue');
      navigate('/login');
    }
  }, [navigate]);

  // cleanup preview object URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const selected = Array.from(files || []);
      const limited = selected.slice(0, 5);
      const combined = [...formData.images, ...limited].slice(0, 5);
      const newPreviews = limited.map((f) => URL.createObjectURL(f));

      setFormData((prev) => ({
        ...prev,
        images: combined,
        image: combined[0] || null,
      }));

      setPreviews((prev) => [...prev, ...newPreviews]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages, image: newImages[0] || null };
    });

    setPreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });

    setErrors((prev) => ({ ...prev, image: '' }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://www.google.com/maps/@${latitude},${longitude},15z`;
        setFormData((prev) => ({ ...prev, location: locationUrl }));
        window.open(locationUrl, '_blank'); // Open Google Maps with the current location
      }, (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please check your browser settings.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => {
    const digits = String(phone || '').replace(/\D/g, '');
    return digits.length >= 9 && digits.length <= 15;
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'Title is required (minimum 5 characters).';
    }
    if (!formData.description || formData.description.trim().length < 20) {
      newErrors.description = 'Description is required (minimum 20 characters).';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender preference.';
    }
    if (formData.rent === '' || isNaN(Number(formData.rent)) || Number(formData.rent) <= 0) {
      newErrors.rent = 'Enter a valid positive rent amount.';
    }
    if (!formData.ownerName || formData.ownerName.trim().length < 3) {
      newErrors.ownerName = 'Owner name is required (minimum 3 characters).';
    }
    if (!formData.contact || !isValidPhone(formData.contact)) {
      newErrors.contact = 'Enter a valid contact number (9-15 digits).';
    }
    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.university) {
      newErrors.university = 'Please select a university.';
    }
    if (!formData.city) {
      newErrors.city = 'Please select a city.';
    }
    if (!formData.adress || formData.adress.trim().length < 5) {
      newErrors.adress = 'Address is required (minimum 5 characters).';
    }
    ['bedroom', 'bathroom', 'bed', 'kitchen'].forEach((key) => {
      const val = formData[key];
      if (val !== '' && (isNaN(Number(val)) || Number(val) < 0)) {
        newErrors[key] = 'Enter a valid non-negative number.';
      }
    });

    // Images validation (1-5)
    if (!formData.images || formData.images.length === 0) {
      newErrors.image = 'Please upload at least one image (max 5).';
    } else if (formData.images.length > 5) {
      newErrors.image = 'You can upload up to 5 images.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('gender', formData.gender);
    data.append('rent', formData.rent);
    data.append('monthly', formData.monthly);
    data.append('ownerName', formData.ownerName);
    data.append('contact', formData.contact);
    data.append('email', formData.email);
    data.append('university', formData.university);
    data.append('city', formData.city);
    data.append('adress', formData.adress);
    data.append('location', formData.location);
    data.append('bedroom', formData.bedroom);
    data.append('bathroom', formData.bathroom);
    data.append('kitchen', formData.kitchen);
    data.append('bed', formData.bed);

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((file) => data.append('images', file));
      data.append('image', formData.images[0]);
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3001/api/properties/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Property posted successfully!');
        navigate('/');
      } else {
        alert('Failed to post property: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error posting property:', error);
      alert('Error posting property');
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-[1000px] mx-auto p-8 border rounded shadow space-y-4"
      >
        <div className="bg-teal-700 text-white p-2 rounded">Property Description</div>

        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.description && <p className="text-red-600 text-sm">{errors.description}</p>}

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male Only</option>
          <option value="Female">Female Only</option>
          <option value="Both">Both</option>
        </select>
        {errors.gender && <p className="text-red-600 text-sm">{errors.gender}</p>}

        <div className="bg-teal-700 text-white p-2 rounded">Property Price</div>

        <input
          type="number"
          name="rent"
          placeholder="Rent in Rs (numbers only)"
          value={formData.rent}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          min="0"
        />
        {errors.rent && <p className="text-red-600 text-sm">{errors.rent}</p>}

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="monthly"
            checked={formData.monthly}
            onChange={handleChange}
          />
          <span>Payment Duration: Monthly</span>
        </label>

        <div className="bg-teal-700 text-white p-2 rounded">Property Owner Details</div>

        <input
          type="text"
          name="ownerName"
          placeholder="Rented By (Owner Name)"
          value={formData.ownerName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.ownerName && <p className="text-red-600 text-sm">{errors.ownerName}</p>}

        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          pattern="^\+?\d{9,15}$"
        />
        {errors.contact && <p className="text-red-600 text-sm">{errors.contact}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

        <div className="bg-teal-700 text-white p-2 rounded">Add Images</div>

        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="w-full"
        />
        <p className="text-xs text-gray-500">Select up to 5 images. Maximum file size: 10 MB each</p>
        {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}

        {/* previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {previews.map((url, i) => (
              <div key={i} className="relative w-28 h-28 rounded overflow-hidden border">
                <img src={url} alt={`preview-${i}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-teal-700 text-white p-2 rounded">Add Location</div>

        <select
          name="university"
          value={formData.university}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select University</option>
          <option value="University of Sri Jayewardenepura">University of Sri Jayewardenepura</option>
          <option value="University of Kelaniya">University of Kelaniya</option>
          <option value="University of Ruhuna">University Of Ruhuna</option>
          <option value="University of Vavniya">University of Vavniya</option>
          <option value="University Of Colombo">University Of Colombo</option>
          <option value="Rajarata University Of Sri Lanka">Rajarata University Of Sri Lanka</option>
          <option value="University Of Jafna">University Of Jafna</option>
          <option value="University Of Peradeniya">University Of Peradeniya</option>
          <option value="Sabaragamuwa University Of Sri Lanka">Sabaragamuwa University Of Sri Lanka</option>
          <option value="University Of Moratuwa">University Of Moratuwa</option>
          <option value="Estern University of Sri Lanka">Estern University of Sri Lanka</option>
          <option value="Uwa Wellassa University Of Sri Lanka">Uwa Wellassa University Of Sri Lanka</option>
          <option value="South Estern University Of Sri Lanka">South Estern University Of Sri Lanka</option>
          <option value="University of the Visual and Performing Arts">University of the Visual and Performing Arts</option>
        </select>
        {errors.university && <p className="text-red-600 text-sm">{errors.university}</p>}

        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select your city</option>
          <option value="Colombo">Colombo</option>
          <option value="Jayawardanapura">Jayawardanapura</option>
          <option value="Galle">Galle</option>
        </select>
        {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}

        <input
          type="text"
          name="adress"
          placeholder="Enter your address"
          value={formData.adress}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.adress && <p className="text-red-600 text-sm">{errors.adress}</p>}

        <input
          type="text"
          name="location"
          placeholder="Paste the location link"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>}

        <button
          type="button"
          onClick={getCurrentLocation}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Use Current Location
        </button>

        <div className="bg-teal-700 text-white p-2 rounded">Facilities</div>

        <input
          type="number"
          name="bedroom"
          placeholder="Number of bedrooms"
          value={formData.bedroom}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
        />
        {errors.bedroom && <p className="text-red-600 text-sm">{errors.bedroom}</p>}

        <input
          type="number"
          name="bathroom"
          placeholder="Number of bathrooms"
          value={formData.bathroom}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
        />
        {errors.bathroom && <p className="text-red-600 text-sm">{errors.bathroom}</p>}

        <input
          type="number"
          name="bed"
          placeholder="Number of beds"
          value={formData.bed}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
        />
        {errors.bed && <p className="text-red-600 text-sm">{errors.bed}</p>}

        <input
          type="number"
          name="kitchen"
          placeholder="Number of kitchens"
          value={formData.kitchen}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
        />
        {errors.kitchen && <p className="text-red-600 text-sm">{errors.kitchen}</p>}

        <div className="text-center">
          <button
            type="submit"
            className="bg-black text-white py-2 px-10 rounded-full hover:bg-gray-800 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Addbodim;