"use client";

import { motion } from "framer-motion";
import { Diamond, Crown, Sparkles } from "lucide-react";
import clsx from "clsx";

const packages = [
  { id: 1, name: "50 Diamonds", price: "$0.99", icon: Diamond, color: "primary" },
  { id: 2, name: "100 Diamonds", price: "$1.99", icon: Diamond, color: "primary" },
  { id: 3, name: "250 Diamonds", price: "$4.99", icon: Diamond, color: "primary", popular: true },
  { id: 4, name: "500 Diamonds", price: "$9.99", icon: Diamond, color: "secondary" },
  { id: 5, name: "1000 Diamonds", price: "$18.99", icon: Diamond, color: "secondary" },
  { id: 6, name: "Weekly Pass", price: "$2.99", icon: Sparkles, color: "accent" },
  { id: 7, name: "Monthly Pass", price: "$9.99", icon: Crown, color: "accent" },
];

export default function PricingCards() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Best <span className="text-gradient">Packages</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Choose the package that fits your needs. Get bonus diamonds on larger top-ups.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={clsx(
                "relative p-6 rounded-2xl cursor-pointer transition-all duration-300 group",
                pkg.popular ? "bg-primary/10 border-2 border-primary glow-primary" : "glass-card border border-white/5 hover:border-primary/50 hover:bg-white/5"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className={clsx(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-500",
                  pkg.color === "primary" ? "bg-primary/20 text-primary" : 
                  pkg.color === "secondary" ? "bg-secondary/20 text-secondary" : 
                  "bg-accent/20 text-accent"
                )}>
                  <pkg.icon size={32} />
                </div>
                
                <h3 className="text-white font-bold text-lg mb-1">{pkg.name}</h3>
                <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6">
                  {pkg.price}
                </p>
                
                <button className={clsx(
                  "w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300",
                  pkg.popular ? "bg-primary text-white hover:bg-primary/90" : "bg-white/10 text-white group-hover:bg-primary"
                )}>
                  Buy Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
