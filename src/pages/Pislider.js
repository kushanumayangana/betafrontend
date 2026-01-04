import React, { useState, useEffect } from "react";

const PropertyImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  // Ensure valid images array
  const validImages = Array.isArray(images) ? images : images ? [images] : [];

  useEffect(() => {
    if (validImages.length > 1) {
      const loop = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % validImages.length);
      }, 3000);

      return () => clearInterval(loop);
    }
  }, [validImages.length]);

  if (validImages.length === 0) {
    return (
      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-1">🏠</div>
          <p className="text-sm">No Image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-md">
      <img
        src={`http://localhost:3001/uploads/${validImages[index]}`}
        alt={`Property ${index + 1}`}
        className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

      {/* Navigation Dots */}
      {validImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {validImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === index ? "bg-teal-400 w-6" : "bg-white/50 w-3"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImageSlider;
