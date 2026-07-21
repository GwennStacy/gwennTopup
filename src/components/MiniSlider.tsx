"use client";
import { useEffect, useState } from "react";
import { Coins } from "lucide-react"; // Assume lucide-react is installed, as it's common

const announcements = [
  "🔥 100% winning rate! Recharge 8 points to get 10 credits. Come and participate in the points lottery!",
  "💎 Get 10% Extra Bonus on all Free Fire Top-ups exclusively for Cambodia server!",
  "🎮 Valorant Points are now available at discounted prices!",
  "✨ Welcome to GwennTopup - Your trusted partner for instant game credits."
];

export default function MiniSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500/80 to-blue-700/90 shadow-lg shadow-blue-900/20 flex items-center h-16 sm:h-20 px-4 sm:px-6 backdrop-blur-sm border border-blue-400/20">
        
        {/* Left Icon */}
        <div className="flex-shrink-0 z-10 flex items-center justify-center mr-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center shadow-inner">
            <Coins className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Scrolling Text Container */}
        <div className="flex-grow relative h-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full transition-transform duration-700 ease-in-out flex flex-col"
            style={{ transform: `translateY(-${currentIndex * (100 / announcements.length)}%)`, height: `${announcements.length * 100}%` }}
          >
            {announcements.map((text, idx) => (
              <div 
                key={idx} 
                className="flex-1 flex items-center text-white font-medium text-xs sm:text-sm md:text-base pr-4"
              >
                <span className="line-clamp-2">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Button */}
        <div className="flex-shrink-0 z-10 ml-2">
          <button className="bg-white text-blue-700 font-bold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm shadow-md hover:bg-gray-100 transition-colors hover:shadow-lg active:scale-95">
            GO
          </button>
        </div>

      </div>
    </div>
  );
}
