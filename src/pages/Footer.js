import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-300 border-t border-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Brand logo and text */}
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <img
              src="/logo192.png"
              alt="Boardin Logo"
              className="w-8 h-8"
            />
            <span className="font-semibold text-gray-700 text-lg">Boardin</span>
          </div>

          {/* Navigation links */}
          <div className="flex flex-wrap justify-center space-x-6 mb-6 md:mb-0">
            <Link to="/aboutus" className="text-gray-600 hover:text-gray-900 transition duration-300">
              About
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-gray-900 transition duration-300">
              FAQ
            </Link>
            <Link to="/contactus" className="text-gray-600 hover:text-gray-900 transition duration-300">
              Contact Us
            </Link>
            <Link to="/FeedbackPage" className="text-gray-600 hover:text-gray-900 transition duration-300">
              User Feedback
            </Link>
          </div>

          {/* Social media icons */}
          <div className="flex space-x-4">
            <button 
              className="text-gray-500 hover:text-blue-600 transition duration-300"
              aria-label="Visit our Facebook page"
            >
              <FaFacebook size={20} />
            </button>
            <button 
              className="text-gray-500 hover:text-blue-400 transition duration-300"
              aria-label="Visit our Twitter page"
            >
              <FaTwitter size={20} />
            </button>
            <button 
              className="text-gray-500 hover:text-pink-600 transition duration-300"
              aria-label="Visit our Instagram page"
            >
              <FaInstagram size={20} />
            </button>
            <button 
              className="text-gray-500 hover:text-blue-700 transition duration-300"
              aria-label="Visit our LinkedIn page"
            >
              <FaLinkedin size={20} />
            </button>
            <button 
              className="text-gray-500 hover:text-red-600 transition duration-300"
              aria-label="Visit our YouTube page"
            >
              <FaYoutube size={20} />
            </button>
          </div>
        </div>

        {/* Copyright text */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Boardin. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;