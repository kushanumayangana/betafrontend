import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Header = () => {
  return (
    <nav className="bg-teal-700 text-white px-2 py-4 flex justify-between items-center">
      {/* Left side: Logo */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="w-14 h-14 rounded-full border-2 border-black overflow-hidden flex items-center justify-center">
          <img
            src={logo}
            alt="logo"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Right side: Navigation links */}
      <div className="flex space-x-10 text-white font-medium">
        <Link to="/Dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/Addbodim" className="hover:underline">
          Post Add
        </Link>
         <Link to="/Login" className="hover:underline">
          Login
        </Link>
        <button
          onClick={() => localStorage.removeItem('isLoggedIn')}
          className="hover:underline"
        >
          Logout
        </button>
        
        
        
      </div>
    </nav>
  );
};

export default Header;
