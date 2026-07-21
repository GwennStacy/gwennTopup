"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const announcements = [
  {
    image: "/mini.png", // The image you just added
    link: "#" // You can add a link here later if you want it to be clickable
  }
  // Add more images here if you want them to slide
];

export default function MiniSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return; // Don't slide if only 1 image
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-12">
      <div className="relative overflow-hidden rounded-xl shadow-lg shadow-blue-900/20 flex items-center h-20 sm:h-24 lg:h-32 w-full">
        
        {/* Scrolling Image Container */}
        <div className="w-full h-full relative">
          <div 
            className="absolute top-0 left-0 w-full transition-transform duration-700 ease-in-out flex flex-col"
            style={{ transform: `translateY(-${currentIndex * (100 / Math.max(1, announcements.length))}%)`, height: `${Math.max(1, announcements.length) * 100}%` }}
          >
            {announcements.map((item, idx) => (
              <a 
                key={idx} 
                href={item.link}
                className="flex-1 w-full relative block"
              >
                <Image 
                  src={item.image} 
                  alt="Banner" 
                  fill
                  className="object-cover sm:object-contain object-center"
                  priority={idx === 0}
                />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
