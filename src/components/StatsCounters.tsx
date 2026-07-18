"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ShoppingCart, Users, Trophy, Clock } from "lucide-react";

const stats = [
  { icon: ShoppingCart, value: 100000, suffix: "+", label: "Orders Completed" },
  { icon: Users, value: 50000, suffix: "+", label: "Happy Customers" },
  { icon: Trophy, value: 99.9, suffix: "%", label: "Success Rate" },
  { icon: Clock, value: 24, suffix: "/7", label: "Customer Support" },
];

function Counter({ from, to, duration = 2, suffix = "" }: { from: number; to: number; duration?: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(from + (to - from) * progress);
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(to);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, from, to, duration]);

  const displayValue = to % 1 === 0 ? Math.floor(count) : count.toFixed(1);
  const formattedValue = typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue;

  return (
    <span ref={nodeRef}>
      {formattedValue}{suffix}
    </span>
  );
}

export default function StatsCounters() {
  return (
    <section className="py-20 relative bg-primary/5 border-y border-white/5">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                <stat.icon size={24} />
              </div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                <Counter from={0} to={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
