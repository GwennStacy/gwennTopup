"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Globe, Menu, X, ChevronDown, User } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <Link href="/" className="flex items-center justify-center group mt-1">
          <div className="relative w-20 h-20 md:w-24 md:h-24 transition-transform duration-300 hover:scale-105 -my-2">
            <Image src="/gwenn-logo-tr.png" alt="Gwenn Topup" fill className="object-contain" priority />
          </div>
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
            <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors">
              <Globe size={16} />
              <span>EN</span>
              <ChevronDown size={14} />
            </button>
            <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Login
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all hover:glow-primary">
              Register
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-gray-300 hover:text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/5 mt-3"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-white font-medium p-2 rounded-lg hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px w-full bg-white/10 my-2"></div>
              <div className="flex items-center justify-between p-2">
                <button className="flex items-center gap-2 text-gray-300">
                  <Globe size={18} /> EN
                </button>
                <div className="flex gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-300">Login</button>
                  <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">Register</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
