"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

// Interface for the static Game config
interface Game {
  id: string;
  name: string;
  publisher: string;
  image: string;
  requiresZoneId: boolean;
  g2bulkCode: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PopularGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("/api/games");
        const data = await res.json();
        if (Array.isArray(data)) {
          setGames(data);
        }
      } catch (err) {
        console.error("Failed to fetch popular games", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <section id="games" className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Popular <span className="text-gradient">Games</span>
            </h2>

          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-primary hover:text-white transition-colors group"
          >
            <span className="font-medium">View All Games</span>
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="glass-card rounded-2xl aspect-square mb-3 md:mb-4 bg-white/5"></div>
                <div className="h-4 md:h-5 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-3 md:h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            ))
          ) : games.length > 0 ? (
            games.map((game, idx) => (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                key={game.id}
                className="h-full"
                custom={idx}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/game/${game.id}`} className="group cursor-pointer block h-full">
                  <div className="glass-card rounded-2xl p-3 md:p-4 border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all duration-300 flex flex-col h-full">
                    <div className="relative rounded-xl overflow-hidden aspect-square mb-3 md:mb-4 shrink-0">
                      {/* Background image */}
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                        <Image
                          src={game.image || "/game-cover.png"}
                          alt={game.name}
                          fill
                          className="object-cover opacity-80"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                        />
                      </div>

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="flex flex-col flex-1 justify-between">
                      <div className="mb-4">
                        <h3 className="text-white font-semibold text-sm md:text-lg truncate group-hover:text-primary transition-colors">
                          {game.name}
                        </h3>
                        <p className="text-gray-500 text-xs md:text-sm truncate">{game.publisher}</p>
                      </div>

                      <button className="w-full py-2 bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white text-sm font-bold rounded-lg transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        Top Up
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              No games found. Add some from the admin dashboard!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
