import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopUpForm from "@/components/TopUpForm";
import Image from "next/image";
import { Gamepad2 } from "lucide-react";

import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import Game from "@/models/Game";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GameTopUpPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  await connectToDatabase();
  const dbGame = await Game.findOne({ id_string: id, active: true }).lean() as any;

  let gameData = null;
  if (dbGame) {
    gameData = {
      id: dbGame.id_string,
      name: dbGame.name,
      publisher: dbGame.publisher,
      image: dbGame.image_url || "/game/default.jpg",
      requiresZoneId: dbGame.requires_zone_id,
      g2bulkCode: dbGame.id_string
    };
  }

  if (!gameData) {
    return (
      <main className="min-h-screen bg-[#090B12] text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Game Not Found</h1>
      </main>
    );
  }

  const gameName = gameData.name;
  const publisher = gameData.publisher;
  const gameApiId = gameData.g2bulkCode;
  const imageUrl = gameData.image;

  await connectToDatabase();
  // Fetch packages for this game
  const Package = mongoose.models.Package || (await import("@/models/Package")).default;
  const packagesData = await Package.find({ game_id: id, active: true }).sort({ sort_order: 1, price: 1 }).lean();
  
  const CategoryModel = mongoose.models.Category || (await import("@/models/Category")).default;
  const categoriesData = await CategoryModel.find({ game_id: id }).sort({ sort_order: 1 }).lean();

  // Serialize Mongoose objects for Client Component
  const packages = packagesData.map((pkg: any) => ({
    id: pkg._id.toString(),
    name: pkg.name,
    price: pkg.price,
    diamonds: pkg.diamonds,
    popular: pkg.is_popular,
    image_url: pkg.image_url,
    category: pkg.category,
    badge: pkg.badge,
  }));

  const categories = categoriesData.map((cat: any) => ({
    id: cat._id.toString(),
    name: cat.name,
    sort_order: cat.sort_order,
  }));

  return (
    <main className="min-h-screen bg-[#090B12] text-white">
      <Navbar />
      
      {/* Game Banner Header */}
      <div className="relative h-[30vh] md:h-[40vh] min-h-[250px] md:min-h-[300px] w-full mt-[72px] md:mt-[88px] overflow-hidden">
        {/* Blurred Background Banner */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={`${gameName} Banner`}
            fill
            className="object-cover blur-sm opacity-40 mix-blend-screen"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B12] via-[#090B12]/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-end pb-8 md:pb-12">
          <div className="flex flex-row items-end gap-4 md:gap-6 text-left">
            {/* Game Icon */}
            <div className="w-24 h-24 md:w-40 md:h-40 rounded-2xl md:rounded-3xl glass-card border border-white/20 p-1.5 md:p-2 overflow-hidden shadow-[0_0_30px_rgba(91,95,255,0.3)] shrink-0">
              <div className="w-full h-full relative rounded-xl md:rounded-2xl overflow-hidden bg-primary/20 flex items-center justify-center">
                <Gamepad2 size={48} className="text-primary opacity-50 absolute md:w-16 md:h-16" />
                <Image
                  src={imageUrl}
                  alt={`${gameName} Icon`}
                  fill
                  sizes="(max-width: 768px) 96px, 160px"
                  className="object-cover mix-blend-screen"
                />
              </div>
            </div>
            
            {/* Game Info */}
            <div className="mb-2 md:mb-4">
              <h1 className="text-2xl md:text-5xl font-extrabold text-white mb-1 md:mb-2">{gameName}</h1>
              <p className="text-primary font-medium text-sm md:text-lg mb-3 md:mb-4">{publisher}</p>
              
              <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-start">
                <div className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/10 border border-white/10 text-xs md:text-sm font-medium">
                  Instant Delivery
                </div>
                <div className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/10 border border-white/10 text-xs md:text-sm font-medium">
                  Secure Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Up Form Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-12">
        <TopUpForm gameId={gameApiId} requiresZoneId={gameData.requiresZoneId} packages={packages} categories={categories} />
      </div>

      <Footer />
    </main>
  );
}
