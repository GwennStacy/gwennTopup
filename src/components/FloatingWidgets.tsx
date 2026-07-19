"use client";

import { Bell, Send } from "lucide-react";
import Link from "next/link";

export default function FloatingWidgets() {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3">
      {/* Notification Bell */}
      <button 
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#1A1F2E] border border-white/5 text-gray-300 hover:text-white hover:bg-[#252B3D] transition-all shadow-lg"
        title="Notifications"
      >
        <Bell size={20} />
        {/* Notification Dot */}
        <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-[#1A1F2E]"></span>
      </button>

      {/* Telegram Link */}
      <Link 
        href="https://t.me/Siv_kimheng"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1A1F2E] border border-[#0088cc]/50 text-[#0088cc] hover:text-white hover:bg-[#0088cc] hover:shadow-[0_0_20px_rgba(0,136,204,0.5)] transition-all shadow-lg"
        title="Contact on Telegram"
      >
        <Send size={20} className="ml-[-2px] mt-[2px]" />
      </Link>
    </div>
  );
}
