"use client";

import { motion } from "framer-motion";
import { Tag, Gift, Percent, Coins, ArrowRight } from "lucide-react";

const promotions = [
  {
    title: "Weekly Discounts",
    desc: "Get up to 20% off on all Mobile Legends packages this week.",
    icon: Percent,
    color: "from-primary/40 to-primary/10",
    border: "border-primary/50",
  },
  {
    title: "Instant Cashback",
    desc: "Earn 5% cashback on every top-up over $50 directly to your wallet.",
    icon: Coins,
    color: "from-secondary/40 to-secondary/10",
    border: "border-secondary/50",
  },
  {
    title: "Lucky Draw",
    desc: "Top up today and enter our monthly lucky draw for a PS5.",
    icon: Gift,
    color: "from-accent/40 to-accent/10",
    border: "border-accent/50",
  },
  {
    title: "Coupon Codes",
    desc: "Use code GWENN10 for an extra 10% off your first transaction.",
    icon: Tag,
    color: "from-success/40 to-success/10",
    border: "border-success/50",
  },
];

export default function PromoCarousel() {
  return (
    <section id="promotions" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Exclusive <span className="text-gradient">Promotions</span>
            </h2>
            <p className="text-gray-400 max-w-lg">
              Don't miss out on our limited time offers and special discounts.
            </p>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
             className="flex gap-2"
          >
             <button className="p-3 rounded-full glass border border-white/10 hover:bg-white/10 text-white transition-colors">
                <ArrowRight className="rotate-180" size={20} />
             </button>
             <button className="p-3 rounded-full bg-primary/20 border border-primary text-primary hover:bg-primary hover:text-white transition-all glow-primary">
                <ArrowRight size={20} />
             </button>
          </motion.div>
        </div>

        {/* Carousel Container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar cursor-grab active:cursor-grabbing">
          {promotions.map((promo, idx) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`min-w-[300px] md:min-w-[400px] flex-shrink-0 snap-center p-8 rounded-3xl bg-gradient-to-br ${promo.color} border ${promo.border} backdrop-blur-md relative overflow-hidden group`}
            >
              {/* Decorative circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors duration-500"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white backdrop-blur-sm border border-white/20">
                <promo.icon size={28} />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{promo.title}</h3>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed relative z-10">
                {promo.desc}
              </p>
              
              <button className="mt-8 px-6 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-colors backdrop-blur-sm relative z-10">
                Claim Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
