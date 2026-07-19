"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import Countdown from "react-countdown";
import { X, Loader2 } from "lucide-react";

export default function CheckoutPoller({ orderId, khqrString, khqrUrl, amount, onClose }: { orderId: string, khqrString: string, khqrUrl?: string, amount: number, onClose?: () => void }) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [expiresAt] = useState(Date.now() + 3 * 60 * 1000); // 3 minutes timer

  useEffect(() => {
    if (!khqrString && !khqrUrl) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/check/${orderId}`);
        const data = await res.json();
        
        if (data.status === "success" || data.status === "failed" || data.status === "processing") {
          setOrderStatus(data.status);
          if (data.status === "success" || data.status === "failed") {
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId, khqrString]);

  if (orderStatus === "success") {
    return (
      <div className="relative z-10 flex flex-col items-center py-8">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6 border border-success/30 shadow-lg shadow-success/20">
          <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2 text-success tracking-wide">
          Payment Successful!
        </h3>
        <p className="text-gray-400 text-sm max-w-[280px] text-center leading-relaxed font-medium">
          Your order #{orderId} has been paid and diamonds have been sent successfully.
        </p>
        <button onClick={() => { if (onClose) onClose(); else router.push("/"); }} className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors w-full">
          Done
        </button>
      </div>
    );
  }

  if (orderStatus === "failed") {
    return (
      <div className="relative z-10 flex flex-col items-center py-8 px-4">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30 shadow-lg shadow-red-500/20">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2 text-red-500 tracking-wide">
          Payment Received!
        </h3>
        <p className="text-gray-400 text-sm max-w-[280px] text-center leading-relaxed font-medium">
          Your payment for #{orderId} was successful, but there was an issue delivering the diamonds immediately. Please contact support to receive your items.
        </p>
        <button onClick={() => { if (onClose) onClose(); else router.push("/"); }} className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors w-full">
          Done
        </button>
      </div>
    );
  }

  if (orderStatus === "processing") {
    return (
      <div className="relative z-10 flex flex-col items-center py-8 px-4">
        <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30 shadow-lg shadow-blue-500/20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-blue-500 tracking-wide text-center">
          Processing Order...
        </h3>
        <p className="text-gray-400 text-sm max-w-[280px] text-center leading-relaxed font-medium">
          Payment received. We are sending diamonds to your account. Please wait a moment.
        </p>
      </div>
    );
  }

  // Countdown renderer
  const renderer = ({ minutes, seconds, completed }: any) => {
    if (completed) return <span className="text-red-500 font-bold">00:00</span>;
    return (
      <span className="font-semibold text-gray-700 text-sm">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[340px] mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl pb-6">
      {/* Header with KHQRcc and Timer */}
      <div className="flex justify-between items-center w-full px-6 py-4 border-b border-gray-100">
        <h2 className="text-gray-700 text-lg font-semibold tracking-wide">KHQRcc</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-50/80 rounded-full px-3 py-1 shadow-sm border border-gray-100">
            <svg className="w-4 h-4 text-[#00E5FF] animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="40" />
            </svg>
            <Countdown date={expiresAt} renderer={renderer} />
          </div>
          <button onClick={() => onClose && onClose()} className="text-[#00E5FF] hover:text-[#00cce6] transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="w-full px-6 mt-4 flex flex-col items-center">
        
        {/* Simple Price Header */}
        <div className="mb-6 text-center">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Payment</p>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-3xl font-extrabold text-gray-900">{amount.toFixed(2)}</span>
            <span className="text-base font-bold text-gray-500">USD</span>
          </div>
        </div>

        {/* Minimal QR Code Area */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          {(khqrString || khqrUrl) ? (
            <div className="relative flex justify-center items-center">
              {khqrUrl ? (
                <img src={khqrUrl} alt="KHQR" className="w-[200px] h-[200px] object-contain" />
              ) : (
                <QRCode value={khqrString} size={200} level="M" />
              )}
            </div>
          ) : (
            <div className="w-[200px] h-[200px] bg-gray-50 flex items-center justify-center rounded-xl">
              <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-4 max-w-[200px] leading-relaxed">
          Scan with any Mobile Banking App supporting KHQR
        </p>
        
        <a 
          href="abamobilebank://ababank.com?type=payway&qr=https://link.payway.com.kh/ABAPAY0D482570t"
          className="mt-6 w-full py-3.5 bg-[#005a70] hover:bg-[#00475a] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#005a70]/30 transition-all sm:hidden"
        >
          <span className="bg-[#e42528] px-2 py-0.5 rounded text-[10px] tracking-wider">ABA</span>
          Open in ABA Mobile
        </a>
      </div>
    </div>
  );
}
