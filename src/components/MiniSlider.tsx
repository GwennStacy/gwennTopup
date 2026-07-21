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
      {/* We use an aspect ratio container so the slider has a defined height based on the width */}
      <div className="relative overflow-hidden rounded-xl shadow-lg shadow-blue-900/20 w-full aspect-[4/1] sm:aspect-[6/1] md:aspect-[8/1] lg:aspect-[10/1]">
        
        {/* Scrolling Image Container */}
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
                className="object-contain sm:object-fill object-center"
                priority={idx === 0}
              />
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
