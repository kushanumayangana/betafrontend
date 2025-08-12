import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3001/api/user/login', {
        emailOrUsername,
        password,
      });

      setMessage(res.data.message);

      if (res.status === 200) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('token', res.data.token);

        setTimeout(() => {
          navigate('/home');
        }, 1000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  // Optional: clear message after 4 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-green-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-teal-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username or Email</label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your username or email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2 text-teal-600 focus:ring-teal-500" />
              Remember Me
            </label>
            <Link to="/Forgetpw" className="text-teal-600 text-sm hover:text-teal-700 hover:underline transition-colors">
              Forgot Password?
            </Link>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Sign In
          </button>
          
          {message && (
            <div className={`text-center p-3 rounded-lg ${
              message.includes('success') || message.includes('Success') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </form>
        
        {/* Register Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-center text-gray-600 mb-4">
            Don't have an account?
          </p>
          <Link
            to="/signup"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 block text-center"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
