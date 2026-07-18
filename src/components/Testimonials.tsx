"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Gaming",
    role: "Pro Player",
    content: "I've been using GwennTopup for all my MLBB tournaments. The delivery is always instant and the customer support is top-notch. Highly recommended for any serious gamer.",
    rating: 5,
    avatarColor: "bg-blue-500",
  },
  {
    id: 2,
    name: "Sarah Winters",
    role: "Streamer",
    content: "The best top-up site I've ever used! The UI is incredibly smooth, and they always have the best discounts compared to other platforms.",
    rating: 5,
    avatarColor: "bg-purple-500",
  },
  {
    id: 3,
    name: "John Doe",
    role: "Casual Gamer",
    content: "Very secure and easy to use. I love the fact that they support so many payment methods. Topping up has never been this hassle-free.",
    rating: 4,
    avatarColor: "bg-green-500",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            What Gamers <span className="text-gradient">Say</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Don't just take our word for it. Read reviews from our awesome community.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-20">
            <button 
              onClick={prev}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 hover:glow-primary transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-20">
            <button 
              onClick={next}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 hover:glow-primary transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="overflow-hidden px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-3xl p-8 md:p-12 relative border border-white/10"
              >
                <Quote className="absolute top-8 right-8 text-white/5" size={80} />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      className={i < testimonials[currentIndex].rating ? "text-accent fill-accent" : "text-gray-600"} 
                    />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl text-gray-200 font-medium leading-relaxed mb-8 relative z-10">
                  "{testimonials[currentIndex].content}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${testimonials[currentIndex].avatarColor} flex items-center justify-center text-white font-bold text-xl`}>
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-400 text-sm">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "bg-primary w-8" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
