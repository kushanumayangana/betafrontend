import React from 'react';
import { Link } from 'react-router-dom';

// University images (unchanged)
import uoj from '../assets/uoj.png';
import uok from '../assets/Uok.jpg';
import Uor from '../assets/Uor.jpg';
import Uov from '../assets/Uov.png';
import Uoc from '../assets/Uoc.jpg';
import Uorj from '../assets/Uorj.jpg';
import Uoj from '../assets/Uoj.jpg';
import Uop from '../assets/Uop.jpg';
import Uos from '../assets/Uos.jpg';
import Uom from '../assets/Uom.jpg';
import Est from '../assets/Est.png';
import Uwu from '../assets/Uwu.jpg';
import Seu from '../assets/Seu.png';
import Uovp from '../assets/Uovp.png';

const universities = [
  { name: 'University of Sri Jayewardenepura', image: uoj },
  { name: 'University of Kelaniya', image: uok },
  { name: 'University of Ruhuna', image: Uor },
  { name: 'University of Vavniya', image: Uov },
  { name: 'University Of Colombo', image: Uoc },
  { name: 'Rajarata University Of Sri Lanka', image: Uorj },
  { name: 'University Of Jafna', image: Uoj },
  { name: 'University Of Peradeniya', image: Uop },
  { name: 'Sabaragamuwa University Of Sri Lanka', image: Uos },
  { name: 'University Of Moratuwa', image: Uom },
  { name: 'Estern University of Sri Lanka', image: Est },
  { name: 'Uwa Wellassa University Of Sri Lanka', image: Uwu },
  { name: 'South Estern University Of Sri Lanka', image: Seu },
  { name: 'University of the Visual and Performing Arts', image: Uovp }
];

const HomePage = () => {
  const features = [
    {
      title: "Efficiency",
      description: "Streamlined search and advertisement with filtering.",
      bg: "from-teal-500 to-teal-600"
    },
    {
      title: "Reliability",
      description: "A centralized, dependable platform with verified information.",
      bg: "from-teal-500 to-teal-600"
    },
    
    {
      title: "Accessibility",
      description: "Mobile-responsive design for use on any device",
      bg: "from-teal-500 to-teal-600"
    },
    {
      title: "Transparency",
      description: "Comprehensive and detailed listing information",
      bg: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white pb-12">
      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-teal-800 mb-8">
          Your Perfect Boarding Solution
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${feature.bg} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="opacity-90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* University Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-700 mb-8">
            Select Your University
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {universities.map((uni, index) => (
              <Link
                key={index}
                to={`/university/${encodeURIComponent(uni.name)}`}
                className="group text-center"
              >
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-teal-100 group-hover:border-teal-300">
                  <div className="w-20 h-20 mx-auto mb-4 p-2 bg-teal-50 rounded-full flex items-center justify-center">
                    <img
                      src={uni.image}
                      alt={uni.name}
                      className="max-h-14 max-w-14 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-sm font-semibold text-teal-800 group-hover:text-teal-600 transition-colors">
                    {uni.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;