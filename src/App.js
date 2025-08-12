import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './pages/Header';
import Footer from './pages/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Addbodim from './components/Addbodim';
import Image from './pages/Image';
import Forgetpw from './pages/Forgetpw';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';

import Help from './pages/Footercomponent/Help';
import Aboutus from './pages/Footercomponent/Aboutus';
import Contactus from './pages/Footercomponent/Contactus';
import Rating from './pages/Footercomponent/Rating';
import UniversityPage from './components/UniversityPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import UniversityPropertyDetailPage from './pages/UniversityPropertyDetailPage';

function App() {
  return (
    <>
      <Header />
      <Image />
      
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/addbodim" element={<Addbodim />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgetpw" element={<Forgetpw />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          
          {/* University and Property Routes */}
          <Route path="/university/:universityName" element={<UniversityPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/university/:universityName/property/:propertyId" element={<UniversityPropertyDetailPage />} />
          
          {/* Footer Component Routes */}
          <Route path="/help" element={<Help />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/rating" element={<Rating />} />
        </Routes>
        
      </div>
      <Footer />
    </>
  );
}

export default App;
