import React, { useState, useEffect } from 'react';
import bodim1 from '../assets/bodim1.png';
import bodim2 from '../assets/bodim2.png';
import bodim3 from '../assets/bodim3.png';
import bodim4 from '../assets/bodim4.png';
import bodim5 from '../assets/bodim5.png';
import bodim6 from '../assets/bodim6.png';
import bodim7 from '../assets/bodim7.png';


const ImageSlider = () => {
  const images = [bodim1, bodim2, bodim3, bodim4, bodim5, bodim6,bodim7];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const loop = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Slightly slower transition for better UX

    return () => clearInterval(loop);
  }, [images.length]);

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-4 shadow-xl rounded-xl overflow-hidden">
      {/* Main Image with Gradient Overlay */}
      <div className="relative h-[350px] w-full">
        <img
          src={images[index]}
          alt={`Slide ${index + 1}`}
          className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
        />
        
        {/* Gradient overlay to match header */}
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/30 to-teal-800/10"></div>
        
        {/* Optional text overlay */}
        <div className="absolute bottom-10 left-10 text-white max-w-md">
          <h2 className="text-3xl font-bold mb-2">Find Your Perfect Boarding</h2>
          <p className="text-lg">Safe, affordable places near your university</p>
        </div>
      </div>

      {/* Navigation Dots - styled to match teal theme */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? 'bg-teal-300 w-6' : 'bg-white/50 w-3'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;