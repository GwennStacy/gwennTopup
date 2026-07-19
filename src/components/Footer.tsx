"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Gamepad2, Globe, MessageCircle, MonitorPlay, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="bg-black/20 pt-16 pb-8 border-t border-white/5 mt-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center group mb-6 gap-3">
              <div className="relative w-20 h-20 md:w-28 md:h-28 transition-transform duration-300 hover:scale-105">
                <Image src="/gwenn-logo-tr.png" alt="Gwenn Topup" fill className="object-contain" priority />
              </div>
              <span className="text-lg md:text-xl font-black tracking-widest text-white uppercase">
                Gwenn<span className="text-gradient">Topup</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The fastest and most secure game top-up platform. Instant delivery, trusted by thousands of gamers worldwide. Level up your gaming experience today.
            </p>
            <div className="flex gap-4 pt-4">
              {[Globe, MessageCircle, MonitorPlay, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 hover:glow-primary transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "Games", "About Us", "Contact", "Terms of Service", "Privacy Policy"].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>123 Gaming Street, Cyber City, Digital World 90210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={18} className="text-primary shrink-0" />
                <span>support@gwenntopup.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 bg-primary hover:bg-primary/90 text-white px-4 rounded-md text-sm font-medium transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} GwennTopup. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
             {/* Payment Logos Placeholder */}
             <div className="text-gray-500 text-sm font-medium">Supported Payments: </div>
             <div className="flex gap-2 opacity-50">
                <div className="h-6 w-10 bg-white/20 rounded"></div>
                <div className="h-6 w-10 bg-white/20 rounded"></div>
                <div className="h-6 w-10 bg-white/20 rounded"></div>
                <div className="h-6 w-10 bg-white/20 rounded"></div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
