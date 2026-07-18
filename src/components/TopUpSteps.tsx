"use client";

import { motion } from "framer-motion";
import { Gamepad2, UserCircle, Diamond, CreditCard, CheckCircle2, Zap } from "lucide-react";

const steps = [
  { icon: Gamepad2, title: "Select Game", desc: "Choose your favorite game from our vast catalog." },
  { icon: UserCircle, title: "Enter Player ID", desc: "Provide your game ID and zone ID." },
  { icon: Diamond, title: "Choose Package", desc: "Select the diamond or pass package you need." },
  { icon: CreditCard, title: "Select Payment", desc: "Pay securely with our supported methods." },
  { icon: CheckCircle2, title: "Confirm Order", desc: "Review your details and place the order." },
  { icon: Zap, title: "Receive Instantly", desc: "Diamonds are added to your account instantly." },
];

export default function TopUpSteps() {
  return (
    <section className="py-20 bg-white/[0.02] relative border-y border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            How to <span className="text-gradient">Top Up</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            It only takes a few minutes to top up your account. Follow these simple steps.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Connecting lines for desktop */}
          <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
          <div className="hidden lg:block absolute top-[14rem] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center p-6 glass-card rounded-2xl group hover:glow-primary transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 relative">
                <step.icon size={32} />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(91,95,255,0.5)]">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
