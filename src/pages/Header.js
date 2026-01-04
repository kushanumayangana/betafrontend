import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const animationShownRef = useRef(false);

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const loginStatus = localStorage.getItem('isLoggedIn');
      const wasLoggedIn = isLoggedIn;
      const newLoginStatus = !!(token && loginStatus === 'true');
      
      setIsLoggedIn(newLoginStatus);
      
      // If user just logged in (wasn't logged in before, but is now) and animation hasn't been shown
      if (!wasLoggedIn && newLoginStatus && !animationShownRef.current) {
        handleLoginSuccess();
      }
    };

    checkAuthStatus();

    // Listen for storage changes (when logout happens in other tabs)
    window.addEventListener('storage', checkAuthStatus);
    
    // Custom event listener for logout
    window.addEventListener('logout', checkAuthStatus);
    
    // Custom event listener for successful login
    window.addEventListener('login-success', handleLoginSuccess);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('logout', checkAuthStatus);
      window.removeEventListener('login-success', handleLoginSuccess);
    };
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    // Check in localStorage if animation already shown for this login
    if (localStorage.getItem("loginAnimationShown") === "true") return;
  
    // Mark as shown in both ref & localStorage
    animationShownRef.current = true;
    localStorage.setItem("loginAnimationShown", "true");
  
    setShowLoginSuccess(true);
  
  
    // Hide after 2 seconds
    setTimeout(() => {
      setShowLoginSuccess(false);
      window.location.reload();
    }, 2000);
  };
  

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('emailForOtp');
    
    // Update local state
    setIsLoggedIn(false);
    
    // Reset animation ref on logout
    animationShownRef.current = false;
    
    // Dispatch custom event for other components
    window.dispatchEvent(new Event('logout'));
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <>
      {/* Login Success Animation */}
      {showLoginSuccess && (
        <div className="fixed inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h2 className="text-3xl font-bold mb-2">Login Successful!</h2>
            <p className="text-xl">Welcome back! Refreshing...</p>
            <div className="mt-4">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo with animation */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden transition-all duration-300 group-hover:rotate-6 group-hover:shadow-lg">
              <img
                src={logo}
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold hidden md:block text-white">BoardingFinder</span>
          </Link>

          {/* Navigation with animated underline */}
          <div className="flex space-x-6">
            {isLoggedIn ? (
              // Show these when logged in
              <>
                <Link 
                  to="/Dashboard"
                  className="relative px-3 py-2 font-medium text-white hover:text-teal-100 transition-colors"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  to="/Addbodim"
                  className="relative px-3 py-2 font-medium text-white hover:text-teal-100 transition-colors"
                >
                  Post Add
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 font-medium text-white hover:text-teal-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              // Show this when logged out
              <Link 
                to="/Login"
                className="relative px-3 py-2 font-medium text-white hover:text-teal-100 transition-colors"
              >
                Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;