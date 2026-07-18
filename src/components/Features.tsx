"use client";

import { motion } from "framer-motion";
import { Zap, Headset, ShieldCheck, Users, Tag, RefreshCcw } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Delivery", desc: "Get your diamonds instantly in your account as soon as the payment is confirmed.", color: "text-accent" },
  { icon: Headset, title: "24/7 Support", desc: "Our dedicated support team is available around the clock to help you with any issues.", color: "text-primary" },
  { icon: ShieldCheck, title: "Secure Payments", desc: "All transactions are encrypted and processed securely through trusted gateways.", color: "text-success" },
  { icon: Users, title: "Trusted by Thousands", desc: "Over 100,000 satisfied gamers trust us for their daily top-up needs.", color: "text-secondary" },
  { icon: Tag, title: "Best Prices", desc: "We offer the most competitive prices and frequent discounts on all packages.", color: "text-accent" },
  { icon: RefreshCcw, title: "Easy Refund Policy", desc: "Didn't receive your items? We offer a hassle-free refund process.", color: "text-primary" },
];

export default function Features() {
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
            Why Choose <span className="text-gradient">GwennTopup</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            We provide the best top-up experience with features designed for gamers.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 glass-card rounded-2xl group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                <feature.icon size={28} className={feature.color} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
