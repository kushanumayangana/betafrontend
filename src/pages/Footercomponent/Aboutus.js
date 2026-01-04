import React from 'react';

function About() {
  return (
    <div className="max-w-[1000px] mx-auto p-8 border rounded shadow space-y-4">
      <div className="bg-teal-700 text-white p-2 rounded">About Us</div>
      <p className="text-gray-700">
        Welcome to our platform! We are dedicated to helping you find the perfect property to rent. Our mission is to provide a seamless experience for both property owners and renters.
      </p>
      <p className="text-gray-700">
        Our team is committed to ensuring that you have access to the best listings and support throughout your journey. Whether you are looking for a cozy apartment or a spacious house, we have something for everyone.
      </p>
      <p className="text-gray-700">
        Thank you for choosing us, and we look forward to assisting you in finding your next home!
      </p>
      <div className="bg-teal-700 text-white p-2 rounded">Contact Us</div>
      <p className="text-gray-700">
        If you have any questions or need assistance, feel free to reach out to us at:
      </p>
      <p className="text-gray-700">
        Email: bodimfind@gmail.com
      </p>
      <p className="text-gray-700">
        Phone: +94 77 123 4567
      </p>
    </div>
  );
}

export default About;