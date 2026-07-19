"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Globe, Menu, X, ChevronDown, User, Moon, Sun } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Games", href: "#games" },
  { name: "Promotions", href: "#promotions" },
  { name: "Order Tracking", href: "#tracking" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial state
    if (typeof document !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        setIsDark(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    const isLightMode = document.documentElement.classList.toggle('light-mode');
    setIsDark(!isLightMode);
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group mt-1 gap-2 md:gap-3">
          <div className="relative w-16 h-16 md:w-20 md:h-20 transition-transform duration-300 hover:scale-105 -my-2">
            <Image src="/gwenn-logo-tr.png" alt="Gwenn Topup" fill className="object-contain" priority />
          </div>
          <span className="text-sm md:text-lg font-black tracking-widest text-white uppercase">
            Gwenn<span className="text-gradient">Topup</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-white/10"></div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Login
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all hover:glow-primary">
              Register
            </button>
          </div>
        </div>

        {/* Mobile Nav Actions */}
        <div className="flex lg:hidden items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
