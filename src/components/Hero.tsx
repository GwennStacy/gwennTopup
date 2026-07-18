"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/banners/gwen.png",
    // title: "Epic Gaming Deals",
    // subtitle: "Top-up and get up to 20% bonus diamonds today!"
  },
  {
    id: 2,
    image: "/banners/pubg.jpg",

    title: "Instant Delivery",
    subtitle: "Get your game credits in seconds, securely."
  },
  {
    id: 3,
    image: "/banners/freefire.jpg",
    title: "Play Like A Pro",
    subtitle: "Unlock exclusive skins and characters."
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000); // Auto slide every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-24 pb-8 md:pt-32 md:pb-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden group shadow-[0_0_40px_rgba(91,95,255,0.15)] border border-white/5">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slides[currentIndex].image}
                alt={slides[currentIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-3/4 lg:w-2/3">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 md:mb-4 tracking-tight"
                >
                  {slides[currentIndex].title}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-base md:text-xl text-gray-300 max-w-xl"
                >
                  {slides[currentIndex].subtitle}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full glass border border-white/10 bg-black/20 hover:bg-primary/50 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full glass border border-white/10 bg-black/20 hover:bg-primary/50 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${currentIndex === idx
                  ? "w-8 h-2 bg-primary shadow-[0_0_10px_rgba(91,95,255,0.8)]"
                  : "w-2 h-2 bg-white/40 hover:bg-white/80"
                  }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
