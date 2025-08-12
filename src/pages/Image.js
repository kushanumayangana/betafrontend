import React, { useState, useEffect } from 'react';
import bodim1 from '../assets/bodim1.png';
import bodim2 from '../assets/bodim2.png';
import bodim3 from '../assets/bodim3.png';
import bodim4 from '../assets/bodim4.png';
import bodim5 from '../assets/bodim5.png';
import bodim6 from '../assets/bodim6.png';

const ImageSlider = () => {
  const images = [bodim1, bodim2, bodim3, bodim4,bodim5,bodim6];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const loop = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(loop);
  }, [images.length]);
  return (
    <div className="relative w-full max-w-7xl mx-auto mt-4">
      <img
        src={images[index]}
        alt={`Slide ${index + 1}`}
        className="w-full h-[400px] object-cover rounded-xl shadow-lg transition-all duration-700 ease-in-out"
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? 'bg-white' : 'bg-White-400'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
