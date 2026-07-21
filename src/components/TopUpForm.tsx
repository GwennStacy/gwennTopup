"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, CheckCircle2, AlertCircle, Loader2, Diamond, CreditCard, ChevronRight, Zap, X } from "lucide-react";
import clsx from "clsx";
import CheckoutPoller from "./CheckoutPoller";
const paymentMethods = [
  { 
    id: "aba", 
    name: "ABA KHQR",
    subtitle: "Scan to pay with any banking app"
  },
];

interface PackageType {
  id: string;
  name: string;
  price: number;
  diamonds: number;
  popular: boolean;
  image_url?: string;
  category?: string;
  badge?: string;
}

interface CategoryType {
  id: string;
  name: string;
  sort_order: number;
}

const DiamondSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="blueTop1" x1="15" y1="25" x2="50" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4DE1FF" />
        <stop offset="1" stopColor="#0094FF" />
      </linearGradient>
      <linearGradient id="blueTop2" x1="50" y1="25" x2="50" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#99F0FF" />
        <stop offset="1" stopColor="#33C5FF" />
      </linearGradient>
      <linearGradient id="blueTop3" x1="85" y1="25" x2="50" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00A3FF" />
        <stop offset="1" stopColor="#0057FF" />
      </linearGradient>
      <linearGradient id="blueBot1" x1="15" y1="45" x2="50" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0080FF" />
        <stop offset="1" stopColor="#0037A3" />
      </linearGradient>
      <linearGradient id="blueBot2" x1="85" y1="45" x2="50" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0047D6" />
        <stop offset="1" stopColor="#001452" />
      </linearGradient>
      <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <ellipse cx="50" cy="88" rx="25" ry="6" fill="black" opacity="0.3" />
    <path d="M35 25 L15 45 L50 45 Z" fill="url(#blueTop1)" />
    <path d="M35 25 L65 25 L50 45 Z" fill="url(#blueTop2)" />
    <path d="M65 25 L85 45 L50 45 Z" fill="url(#blueTop3)" />
    <path d="M15 45 L50 45 L50 85 Z" fill="url(#blueBot1)" />
    <path d="M85 45 L50 45 L50 85 Z" fill="url(#blueBot2)" />
    <path d="M35 25 L65 25 L85 45 L50 85 L15 45 Z" stroke="white" strokeWidth="1" strokeOpacity="0.4" strokeLinejoin="round" />
    <path d="M15 45 L85 45" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
    <path d="M35 25 L50 45 L65 25" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
    <path d="M50 45 L50 85" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
    <path d="M60 20 L62 24 L66 26 L62 28 L60 32 L58 28 L54 26 L58 24 Z" fill="white" filter="url(#glowLight)" opacity="0.9" />
    <circle cx="28" cy="38" r="1.5" fill="white" opacity="0.8" />
  </svg>
);

const RedDiamondSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="redTop1" x1="15" y1="25" x2="50" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6B6B" />
        <stop offset="1" stopColor="#E60000" />
      </linearGradient>
      <linearGradient id="redTop2" x1="50" y1="25" x2="50" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFA3A3" />
        <stop offset="1" stopColor="#FF3333" />
      </linearGradient>
      <linearGradient id="redTop3" x1="85" y1="25" x2="50" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E60000" />
        <stop offset="1" stopColor="#990000" />
      </linearGradient>
      <linearGradient id="redBot1" x1="15" y1="45" x2="50" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#CC0000" />
        <stop offset="1" stopColor="#660000" />
      </linearGradient>
      <linearGradient id="redBot2" x1="85" y1="45" x2="50" y2="85" gradientUnits="userSpaceOnUse">
        <stop stopColor="#990000" />
        <stop offset="1" stopColor="#330000" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="88" rx="25" ry="6" fill="black" opacity="0.3" />
    <path d="M35 25 L15 45 L50 45 Z" fill="url(#redTop1)" />
    <path d="M35 25 L65 25 L50 45 Z" fill="url(#redTop2)" />
    <path d="M65 25 L85 45 L50 45 Z" fill="url(#redTop3)" />
    <path d="M15 45 L50 45 L50 85 Z" fill="url(#redBot1)" />
    <path d="M85 45 L50 45 L50 85 Z" fill="url(#redBot2)" />
    <path d="M35 25 L65 25 L85 45 L50 85 L15 45 Z" stroke="white" strokeWidth="1" strokeOpacity="0.4" strokeLinejoin="round" />
    <path d="M15 45 L85 45" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
    <path d="M35 25 L50 45 L65 25" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" />
    <path d="M50 45 L50 85" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
    <path d="M60 20 L62 24 L66 26 L62 28 L60 32 L58 28 L54 26 L58 24 Z" fill="white" filter="url(#glowLight)" opacity="0.9" />
    <circle cx="28" cy="38" r="1.5" fill="white" opacity="0.8" />
  </svg>
);

const GoldCoinSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="50" cy="85" rx="25" ry="8" fill="black" opacity="0.3" />
    <circle cx="50" cy="50" r="35" fill="#FFD700" stroke="#DAA520" strokeWidth="4" />
    <circle cx="50" cy="50" r="28" fill="#FDB813" stroke="#DAA520" strokeWidth="2" />
    <path d="M45 35 L55 35 L55 65 L45 65 Z" fill="#B8860B" />
    <path d="M40 40 L60 40 L60 45 L40 45 Z" fill="#B8860B" />
    <path d="M60 20 L63 25 L68 28 L63 31 L60 36 L57 31 L52 28 L57 25 Z" fill="white" opacity="0.8" />
  </svg>
);

const TokenSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="50" cy="85" rx="25" ry="8" fill="black" opacity="0.3" />
    <path d="M50 15 L85 50 L50 85 L15 50 Z" fill="#9333EA" stroke="#A855F7" strokeWidth="4" strokeLinejoin="round" />
    <path d="M50 25 L75 50 L50 75 L25 50 Z" fill="#6B21A8" />
    <circle cx="50" cy="50" r="10" fill="#FBBF24" />
    <path d="M60 20 L63 25 L68 28 L63 31 L60 36 L57 31 L52 28 L57 25 Z" fill="white" opacity="0.8" />
  </svg>
);

const GameDiamond = ({ gameId, amount, isActive, imageUrl, className = "" }: { gameId?: string, amount: number, isActive: boolean, imageUrl?: string, className?: string }) => {
  const count = amount >= 500 ? 5 : amount >= 250 ? 3 : amount >= 100 ? 2 : 1;
  
  if (imageUrl) {
    return (
      <div className={clsx("relative flex items-center justify-center h-full w-full", className)}>
        <div className={clsx("absolute inset-0 bg-blue-500/20 blur-xl rounded-full transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0")}></div>
        <img src={imageUrl} alt="Package Image" className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110" />
      </div>
    );
  }

  const Icon = gameId === "freefire" ? RedDiamondSVG : 
               gameId === "pubgm" ? GoldCoinSVG : 
               gameId === "hok" ? TokenSVG : 
               DiamondSVG; // Default (MLBB etc)
               
  return (
    <div className={clsx("relative flex items-center justify-center h-full w-full", className)}>
      {/* Background glow that only shows when active */}
      <div className={clsx("absolute inset-0 blur-2xl rounded-full transition-opacity duration-300", 
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40",
        gameId === "freefire" ? "bg-red-500/30" : 
        gameId === "pubgm" ? "bg-yellow-500/30" : 
        gameId === "hok" ? "bg-purple-500/30" : 
        "bg-blue-500/30"
      )}></div>
      
      {count === 1 && (
        <Icon className="w-14 h-14 relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-6" />
      )}
      
      {count === 2 && (
        <>
          <Icon className="w-10 h-10 absolute left-1/2 -translate-x-[90%] top-2 z-0 drop-shadow-lg opacity-90 transition-transform duration-500 group-hover:-translate-x-[110%] group-hover:rotate-[-10deg]" />
          <Icon className="w-14 h-14 relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-6" />
        </>
      )}

      {count === 3 && (
        <>
          <Icon className="w-9 h-9 absolute left-1/2 -translate-x-[120%] top-4 z-0 drop-shadow-md opacity-80 transition-transform duration-500 group-hover:-translate-x-[140%] group-hover:-rotate-12" />
          <Icon className="w-10 h-10 absolute left-1/2 translate-x-[20%] top-2 z-0 drop-shadow-lg opacity-90 transition-transform duration-500 group-hover:translate-x-[40%] group-hover:rotate-12" />
          <Icon className="w-14 h-14 relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2" />
        </>
      )}

      {count === 5 && (
        <>
          <Icon className="w-8 h-8 absolute left-1/2 -translate-x-[140%] top-4 z-0 opacity-80 drop-shadow-md transition-transform duration-500 group-hover:-translate-x-[160%] group-hover:-rotate-12" />
          <Icon className="w-10 h-10 absolute left-1/2 -translate-x-[80%] top-1 z-10 opacity-95 drop-shadow-lg transition-transform duration-500 group-hover:-translate-x-[100%] group-hover:-translate-y-2 group-hover:-rotate-6" />
          <Icon className="w-9 h-9 absolute left-1/2 translate-x-[10%] top-1 z-0 opacity-90 drop-shadow-md transition-transform duration-500 group-hover:translate-x-[30%] group-hover:-translate-y-1 group-hover:rotate-12" />
          <Icon className="w-10 h-10 absolute left-1/2 translate-x-[50%] top-5 z-10 opacity-90 drop-shadow-lg transition-transform duration-500 group-hover:translate-x-[70%] group-hover:rotate-6" />
          <Icon className="w-14 h-14 relative z-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1" />
        </>
      )}
    </div>
  );
};

export default function TopUpForm({ gameId, gameApiId, requiresZoneId = false, packages = [], categories = [] }: { gameId: string, gameApiId?: string, requiresZoneId?: boolean, packages?: PackageType[], categories?: CategoryType[] }) {
  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>("aba");
  
  const [orderResult, setOrderResult] = useState<{ orderId: string, khqrString: string, khqrUrl: string, amount: number } | null>(null);

  // Combine explicitly created categories with any categories already assigned to packages
  const usedCategories = Array.from(new Set(packages.map(p => p.category || "Normal Top-Up")));
  const dbCategories = categories || [];
  
  const categoryGroups = [
    ...dbCategories,
    ...usedCategories
      .filter(catName => !dbCategories.some(c => c.name === catName))
      .map((catName, idx) => ({ id: catName, name: catName, sort_order: 999 + idx }))
  ].sort((a, b) => a.sort_order - b.sort_order);

  const renderPackageCard = (pkg: PackageType) => (
    <div
      key={pkg.id}
      onClick={() => setSelectedPackage(pkg.id)}
      className={clsx(
        "relative p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-300 border flex flex-col items-center justify-start gap-1.5 sm:gap-2 group overflow-hidden text-center",
        selectedPackage === pkg.id
          ? "bg-gradient-to-b from-secondary/20 to-secondary/5 border-secondary shadow-[0_4px_20px_rgba(139,92,246,0.3)] scale-[1.02] z-10"
          : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 hover:scale-[1.01]"
      )}
    >
      {/* Subtle active background glow */}
      {selectedPackage === pkg.id && (
        <div className="absolute inset-0 bg-secondary/10 blur-xl pointer-events-none"></div>
      )}

      {/* Bonus Tag (Top Right) */}
      {(pkg.badge || pkg.popular) && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-bl-md shadow-lg z-20 flex items-center gap-1">
          <Zap size={8} className="fill-white hidden sm:block" /> {pkg.badge || "Hot"}
        </div>
      )}
      
      {/* Premium Diamond Cluster */}
      <div className="w-full h-16 sm:h-20 shrink-0 flex items-center justify-center relative z-10 px-2 mt-2">
        <GameDiamond gameId={gameId} amount={pkg.diamonds || pkg.price * 50} isActive={selectedPackage === pkg.id} imageUrl={pkg.image_url} />
      </div>
      
      {/* Price and Name */}
      <div className="flex flex-col relative z-10 w-full mt-0.5 sm:mt-1">
        <span className="font-black text-sm sm:text-lg text-[#FACC15] drop-shadow-md leading-none">
          ${pkg.price.toFixed(2)}
        </span>
        <span className={clsx("font-semibold text-[9px] sm:text-xs mt-1 sm:mt-1.5 leading-tight line-clamp-2 px-1", selectedPackage === pkg.id ? "text-white" : "text-gray-300")}>
          {pkg.name}
        </span>
      </div>
    </div>
  );

  const handleCheckId = async () => {
    if (!userId) return;
    
    setIsChecking(true);
    setPlayerName(null);
    setCheckError(null);

    try {
      // Call our internal secure API
      const response = await fetch("/api/check-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: gameApiId || gameId,
          userId: userId,
          zoneId: zoneId || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.valid === "valid") {
        setPlayerName(data.name);
      } else {
        setCheckError(data.error || "Invalid Player ID or Zone ID.");
      }
    } catch (err) {
      setCheckError("Failed to verify ID. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBuyNow = async () => {
    if (!userId || !selectedPackage || !selectedPayment) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: gameId,
          packageId: selectedPackage,
          userId: userId,
          zoneId: zoneId || undefined,
          paymentMethod: selectedPayment,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        if (data.checkout_url) {
          setOrderResult({
            orderId: data.order_id,
            checkoutUrl: data.checkout_url,
            amount: selectedPkgData?.price || 0
          } as any);
        }
        setIsSubmitting(false);
      } else {
        alert(data.error || "Failed to create order. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const selectedPkgData = packages.find((p) => p.id === selectedPackage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-28 lg:pb-0">
      {/* Main Form Area */}
      <div className="lg:col-span-2 space-y-5">
        
        {/* Step 1: Account Info */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">1</span>
            Enter Account Details
          </h2>
          
          <div className="flex flex-row gap-3">
            <div className={clsx(requiresZoneId ? "flex-[6]" : "w-full")}>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
            
            {requiresZoneId && (
              <div className="flex-[4]">
                <input
                  type="text"
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  placeholder="Zone ID"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleCheckId}
              disabled={!userId || isChecking}
              className="w-full sm:w-auto px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium transition-all flex items-center justify-center gap-2 glow-primary"
            >
              {isChecking ? <Loader2 size={18} className="animate-spin" /> : <User size={18} />}
              Verify ID
            </button>
            
            {playerName && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-success bg-success/10 px-4 py-2 rounded-lg border border-success/20 w-full sm:w-auto">
                <CheckCircle2 size={18} />
                <span className="font-medium">{playerName}</span>
              </motion.div>
            )}
            
            {checkError && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20 w-full sm:w-auto">
                <AlertCircle size={18} />
                <span className="font-medium text-sm">{checkError}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Step 2: Select Package */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm">2</span>
            Select Package (កញ្ចប់ទិញ)
          </h2>
          
          {packages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No packages available for this game yet.</div>
          ) : (
            <div className="flex flex-col gap-6">
              {categoryGroups.map((cat, idx) => {
                const groupPackages = packages.filter(pkg => (pkg.category || "Normal Top-Up") === cat.name);
                if (groupPackages.length === 0) return null;
                
                const isPass = cat.name.toLowerCase().includes("pass") || cat.name.toLowerCase().includes("deal");
                const colorClass = isPass ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" : "bg-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]";
                
                return (
                  <div key={cat.id}>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <div className={clsx("w-2 h-2 rounded-full", colorClass)}></div>
                      {cat.name}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
                      {groupPackages.map(pkg => renderPackageCard(pkg))}
                    </div>
                    {/* Visual Divider if not the last non-empty group */}
                    {idx < categoryGroups.length - 1 && (
                      <div className="w-full h-px bg-white/5 mt-6 mb-2"></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 3: Select Payment */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-accent"></div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm">3</span>
            Select Payment Method
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={clsx(
                  "p-4 rounded-xl cursor-pointer transition-all duration-300 border flex items-center gap-4",
                  selectedPayment === method.id
                    ? "bg-accent/20 border-accent"
                    : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
                )}
              >
                {/* Checkbox */}
                <div className={clsx("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 hidden sm:flex", selectedPayment === method.id ? "border-accent" : "border-gray-500")}>
                   {selectedPayment === method.id && <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>}
                </div>
                
                {/* Custom Logo for ABA KHQR */}
                {method.id === "aba" && (
                  <div className="flex flex-col rounded-lg overflow-hidden shrink-0 w-14 h-14 shadow-md">
                    <div className="bg-[#005a70] h-[65%] flex items-center justify-center text-white font-bold text-sm tracking-wider">ABA<span className="text-red-500 text-[10px] absolute translate-x-3 -translate-y-1">'</span></div>
                    <div className="bg-[#e42528] h-[35%] flex items-center justify-center text-white text-[9px] font-bold tracking-widest">KH<span className="text-[10px]">QR</span></div>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className={clsx("font-bold text-lg", selectedPayment === method.id ? "text-white" : "text-gray-200")}>{method.name}</span>
                  {/* @ts-ignore */}
                  {method.subtitle && <span className="text-xs text-gray-400 mt-0.5">{method.subtitle}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout Sidebar (Desktop) & Mobile Inline Summary */}
      <div className="lg:col-span-1 pb-24 lg:pb-0">
        <div className="glass-card p-6 rounded-3xl border border-white/5 sticky top-24">
          <h3 className="text-lg font-bold text-white mb-6 pb-4 border-b border-white/10">Order Summary</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Account:</span>
              <span className="text-white font-medium">{playerName || userId || "Not verified"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Package:</span>
              <span className="text-white font-medium">{selectedPkgData?.name || "None"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Payment:</span>
              <span className="text-white font-medium">{paymentMethods.find(m => m.id === selectedPayment)?.name || "None"}</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mb-8 flex justify-between items-end">
            <span className="text-gray-400">Total</span>
            <span className="text-3xl font-bold text-white">${selectedPkgData?.price.toFixed(2) || "0.00"}</span>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={!userId || !selectedPackage || !selectedPayment || isSubmitting}
            className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white font-bold text-lg transition-all items-center justify-center gap-2 glow-primary hidden lg:flex"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Buy Now <ChevronRight size={20} /></>}
          </button>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass-card border-t border-white/10 z-40 lg:hidden flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Total Payment</div>
          <div className="text-xl font-bold text-white">${selectedPkgData?.price.toFixed(2) || "0.00"}</div>
        </div>
        <button
          onClick={handleBuyNow}
          disabled={!userId || !selectedPackage || !selectedPayment || isSubmitting}
          className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-white font-bold transition-all flex items-center justify-center gap-2 glow-primary"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Buy Now <ChevronRight size={18} /></>}
        </button>
      </div>

      {orderResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <CheckoutPoller
            orderId={orderResult.orderId}
            checkoutUrl={(orderResult as any).checkoutUrl}
            amount={orderResult.amount}
            onClose={() => { setOrderResult(null); window.location.reload(); }}
          />
        </div>
      )}

    </div>
  );
};
