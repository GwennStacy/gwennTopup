"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import clsx from "clsx";

const faqs = [
  {
    question: "How long does it take to receive my diamonds?",
    answer: "Most top-ups are processed instantly. Once your payment is confirmed, the diamonds will be added to your game account within seconds. In rare cases, it might take up to 5 minutes.",
  },
  {
    question: "Is it safe to top up on GwennTopup?",
    answer: "Absolutely! We are an authorized partner for the games we support. All transactions are secure, and we never ask for your account password—only your Player ID is needed.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept a wide range of local and international payment methods including ABA Bank, Wing, TrueMoney, Visa, Mastercard, KHQR, Binance Pay, and PayPal.",
  },
  {
    question: "What should I do if I entered the wrong Player ID?",
    answer: "Unfortunately, if the top-up was successful to a valid but incorrect ID, we cannot reverse the transaction. Please double-check your Player ID and Zone ID before confirming your order.",
  },
  {
    question: "Do you offer refunds for failed transactions?",
    answer: "Yes, if your payment was deducted but the order failed, our system will automatically initiate a refund. You can also contact our 24/7 support team for immediate assistance.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/3 sticky top-32"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
              <MessageCircleQuestion size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Have questions? We're here to help. If you don't find the answer you're looking for, feel free to contact our support team.
            </p>
            <button className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/10 flex items-center gap-2">
              Contact Support
            </button>
          </motion.div>

          <div className="lg:w-2/3 space-y-4 w-full">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={clsx(
                  "glass-card border rounded-xl overflow-hidden transition-colors duration-300",
                  openIndex === idx ? "border-primary/50 bg-white/5" : "border-white/10"
                )}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={clsx("font-semibold text-lg transition-colors", openIndex === idx ? "text-primary" : "text-white")}>
                    {faq.question}
                  </span>
                  <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300", openIndex === idx ? "bg-primary text-white rotate-180" : "bg-white/10 text-gray-400")}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
