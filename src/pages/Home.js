import React from 'react';
import { Link } from 'react-router-dom';


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
  return (
    <div className="">
      
      {/* 🏫 University Grid */}
      <div className="max-w-7xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-teal-700">
          Select Your University
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {universities.map((uni, index) => (
            <Link
              key={index}
              to={`/university/${encodeURIComponent(uni.name)}`}
              className="text-center transform hover:scale-105 transition-transform duration-300"
            >
              <img
                src={uni.image}
                alt={uni.name}
                className="w-24 h-24 mx-auto mb-2 object-contain rounded-md shadow"
              />
              <p className="text-sm font-semibold text-gray-700">{uni.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
