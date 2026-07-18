"use client";

import { motion } from "framer-motion";
import { CreditCard, Wallet, Banknote, Landmark, ScanBarcode, CircleDollarSign } from "lucide-react";

const payments = [
  { name: "ABA Bank", icon: Landmark, color: "text-[#005E82]" },
  { name: "ACLEDA", icon: Landmark, color: "text-[#0D1F3C]" },
  { name: "Wing Bank", icon: Wallet, color: "text-[#8CC63F]" },
  { name: "TrueMoney", icon: Banknote, color: "text-[#F15A24]" },
  { name: "Pi Pay", icon: Wallet, color: "text-[#E91E63]" },
  { name: "Visa", icon: CreditCard, color: "text-[#1A1F71]" },
  { name: "Mastercard", icon: CreditCard, color: "text-[#EB001B]" },
  { name: "KHQR", icon: ScanBarcode, color: "text-[#ED1C24]" },
  { name: "Binance Pay", icon: CircleDollarSign, color: "text-[#F3BA2F]" },
  { name: "PayPal", icon: CreditCard, color: "text-[#003087]" },
];

export default function PaymentLogos() {
  return (
    <section className="py-20 relative bg-[#06080F]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white mb-4"
          >
            Trusted <span className="text-gradient">Payment</span> Methods
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            We support multiple payment channels for your convenience and security.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {payments.map((payment, idx) => (
            <motion.div
              key={payment.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-3 px-6 py-4 glass rounded-xl border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                 <payment.icon size={20} className={payment.color} />
              </div>
              <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">
                {payment.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
