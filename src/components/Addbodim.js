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
    university: '',
    city: '',
    adress: '',
    location: '',
    bedroom: '',
    bathroom: '',
    kitchen: '',
    bed: '',
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      alert('Please login to continue');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // console.log(localStorage.getItem('isLoggedIn')  === "true" )

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!localStorage.getItem('isLoggedIn')  === "true") {
      alert('User not authenticated properly. Please login again.');
      navigate('/login');
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


    if (formData.image) {
      data.append('image', formData.image);
    }

    const token = localStorage.getItem('token');
    console.log("Token before POST:", token); 

    try {
      const response = await fetch('http://localhost:3001/api/properties/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      console.log(token);

      const result = await response.json();
      console.log("resultt",response);

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

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

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

        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <div className="bg-teal-700 text-white p-2 rounded">Add Images</div>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
        />
        <p className="text-xs text-gray-500">Maximum file size: 10 MB</p>

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
          {/* Add more universities as needed */}
        </select>

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
          {/* Add more cities as needed */}
        </select>

        <input
          type="text"
          name="adress"
          placeholder="Enter your address"
          value={formData.adress}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Paste the location link"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

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

        <input
          type="number"
          name="bathroom"
          placeholder="Number of bathrooms"
          value={formData.bathroom}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
        />

        <input
          type="number"
          name="bed"
          placeholder="Number of beds"
          value={formData.bed}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
        />

        <input
          type="number"
          name="kitchen"
          placeholder="Number of kitchens"
          value={formData.kitchen}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
        />

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
