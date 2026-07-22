"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function CheckoutPoller({ orderId, checkoutUrl, amount, packageName, userId, zoneId, onClose }: { orderId: string, checkoutUrl?: string, amount: number, packageName?: string, userId?: string, zoneId?: string, onClose?: () => void }) {
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  useEffect(() => {
    if (!checkoutUrl) return;

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
  }, [orderId, checkoutUrl]);

  if (orderStatus === "success") {
    return (
      <div className="relative z-10 flex flex-col items-center py-8 glass-card border border-white/10 rounded-3xl p-8 max-w-sm w-full mx-auto shadow-2xl bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        {/* Receipt Header */}
        <div className="w-full flex flex-col items-center border-b border-dashed border-white/20 pb-6 mb-6">
          <div className="relative w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Image src="/gwenn-logo-tr.png" alt="Gwenn Topup" fill className="object-contain" />
          </div>
          <div className="flex items-center gap-2 text-success mb-2">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold tracking-wider uppercase text-sm">Payment Success</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-wide text-center">
            Thank You!
          </h2>
        </div>

        {/* Receipt Details */}
        <div className="w-full space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm font-medium">Order ID</span>
            <span className="text-white font-bold font-mono">#{orderId}</span>
          </div>
          {userId && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-medium">Player ID</span>
              <span className="text-white font-bold text-sm text-right max-w-[150px] truncate">{userId}</span>
            </div>
          )}
          {zoneId && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-medium">Server ID</span>
              <span className="text-white font-bold text-sm text-right max-w-[150px] truncate">{zoneId}</span>
            </div>
          )}
          {packageName && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm font-medium">Package</span>
              <span className="text-white font-bold text-sm text-right max-w-[150px] truncate">{packageName}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm font-medium">Price</span>
            <span className="text-success font-black text-lg">${amount.toFixed(2)}</span>
          </div>
        </div>

        <button onClick={() => { if (onClose) onClose(); else router.push("/"); }} className="px-8 py-3.5 bg-success hover:bg-success/90 text-white rounded-xl font-bold transition-all w-full shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2">
          Done
        </button>
      </div>
    );
  }

  if (orderStatus === "failed") {
    return (
      <div className="relative z-10 flex flex-col items-center py-8 px-6 glass-card border border-white/10 rounded-3xl p-8 max-w-sm w-full mx-auto shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2 text-red-500 tracking-wide text-center">
          Payment Received!
        </h3>
        <p className="text-gray-300 text-sm max-w-[280px] text-center leading-relaxed font-medium">
          Your payment for #{orderId} was successful, but there was an issue delivering the diamonds immediately. Please contact support.
        </p>
        <button onClick={() => { if (onClose) onClose(); else router.push("/"); }} className="mt-8 px-8 py-3 bg-red-500 hover:bg-red-500/90 text-white rounded-xl font-bold transition-all w-full shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          Done
        </button>
      </div>
    );
  }

  if (orderStatus === "processing") {
    return (
      <div className="relative z-10 flex flex-col items-center py-8 px-6 glass-card border border-white/10 rounded-3xl p-8 max-w-sm w-full mx-auto shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-primary tracking-wide text-center">
          Processing Order...
        </h3>
        <p className="text-gray-300 text-sm max-w-[280px] text-center leading-relaxed font-medium">
          Payment received. We are sending diamonds to your account. Please wait a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[320px] sm:max-w-[420px] mx-auto bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative animate-in zoom-in-95 duration-300 h-[540px] sm:h-[680px]">
      
      {/* Header */}
      <div className="flex justify-between items-center w-full px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 bg-white relative z-20 shrink-0">
        <h2 className="text-gray-800 text-base sm:text-lg font-bold tracking-wide">Secure Checkout</h2>
        <button onClick={() => onClose && onClose()} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full">
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* iframe Container */}
      <div className="w-full flex-1 relative bg-gray-50 flex items-center justify-center">
        {!isIframeLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white">
             <Loader2 className="animate-spin w-10 h-10 text-[#005a70] mb-4" />
             <p className="text-sm font-medium text-gray-500">Connecting to secure gateway...</p>
          </div>
        )}
        
        {checkoutUrl && (
          <iframe 
            src={checkoutUrl}
            className="w-full h-full border-0 absolute inset-0 z-0"
            onLoad={() => setIsIframeLoaded(true)}
            allow="payment"
            title="KHQR Checkout"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation allow-popups-to-escape-sandbox"
          />
        )}
      </div>
    </div>
  );
}
