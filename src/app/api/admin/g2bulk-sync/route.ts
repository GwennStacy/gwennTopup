import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import Game from "@/models/Game";
import Package from "@/models/Package";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.G2BULK_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: "G2BULK_API_KEY is not defined in .env.local" 
      }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Fetch services from G2Bulk SMM API
    const response = await fetch("https://api.g2bulk.com/api/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        action: "services",
        key: apiKey,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ success: false, error: data.error }, { status: 400 });
    }

    if (!Array.isArray(data)) {
      return NextResponse.json({ success: false, error: "Invalid response format from G2Bulk" }, { status: 500 });
    }

    let syncedCount = 0;

    // Fetch active games from MongoDB
    const games = await Game.find({ active: true }).lean() as any[];

    // Map to keep track of the best service for each (game_id, identifier) combination
    const bestServices = new Map<string, any>();

    for (const service of data) {
      // Find matching game in our configured games
      const matchingGame = games.find(g => {
        if (!service.category) return false;
        
        // Strict matching for MLBB to allow both Mobile Legends and Mobile Legends Global
        if (g.id_string === "mlbb" || g.g2bulkCode === "mlbb") {
          return service.category === "Mobile Legends" || service.category === "Mobile Legends Global";
        }

        // Strict matching for Free Fire
        if (g.id_string === "ff" || g.id_string === "freefire" || g.g2bulkCode === "freefire") {
          return service.category === "Freefire SGMY";
        }
        
        return service.category.toLowerCase().includes(g.name.toLowerCase()) || 
               g.name.toLowerCase().includes(service.category.toLowerCase());
      });

      if (matchingGame) {
        // Try to extract diamonds from the name (e.g., "50 Diamonds" -> 50)
        let diamondsMatch = service.name.match(/(\d+)\s*(diamonds?|dm|uc|coins)/i);
        let diamonds = diamondsMatch ? parseInt(diamondsMatch[1], 10) : 0;
        
        if (diamonds === 0) {
           // fallback: just find the first number in the name
           const numMatch = service.name.match(/(\d+)/);
           if (numMatch) diamonds = parseInt(numMatch[1], 10);
        }

        let displayName = service.name;
        let badge = "";

        // Add Bonus for Free Fire Cambodia Server (10% bonus for standard packages)
        if (matchingGame.id_string === "freefire" || matchingGame.id_string === "ff" || matchingGame.g2bulkCode === "freefire_sg") {
           const lowerName = service.name.toLowerCase();
           const isStandardPackage = diamonds >= 100 && 
             !lowerName.includes("less is more") && 
             !lowerName.includes("level") && 
             !lowerName.includes("pass") && 
             !lowerName.includes("weekly") && 
             !lowerName.includes("monthly") &&
             !lowerName.includes("membership");

           if (isStandardPackage) {
              const bonus = Math.floor(diamonds * 0.10);
              diamonds = diamonds + bonus;
              displayName = `${diamonds - bonus} 💎 + ${bonus} Bonus`;
              badge = "🔥 ថែម " + bonus;
           } else if (diamonds > 0 && !lowerName.includes("level") && !lowerName.includes("weekly") && !lowerName.includes("monthly") && !lowerName.includes("less is more")) {
              displayName = `${diamonds} 💎`;
           }
        }

        const isSpecialPackage = diamonds === 0;
        
        // For special packages, group by a cleaned version of the name
        // For numeric packages, group by diamond count
        let key = "";
        if (isSpecialPackage) {
           const cleanName = service.name.toLowerCase().replace(/ global/g, '').replace(/[^a-z0-9]/g, '');
           key = `${matchingGame.id_string}-special-${cleanName}`;
        } else {
           key = `${matchingGame.id_string}-${diamonds}`;
        }

        const currentRate = parseFloat(service.rate);
        const existingBest = bestServices.get(key);
        
        if (!existingBest || currentRate < parseFloat(existingBest.service.rate)) {
          bestServices.set(key, { service, matchingGame, diamonds, isSpecialPackage, displayName, badge });
        }
      }
    }

    // Now save the best services to the database
    for (const { service, matchingGame, diamonds, isSpecialPackage, displayName, badge } of bestServices.values()) {
      // Add 20% margin to rate for selling price, or keep rate as is if you want standard pricing
      const originalPrice = parseFloat(service.rate);
      const defaultSellingPrice = parseFloat((originalPrice * 1.2).toFixed(2));

      let pkg = null;
      
      if (isSpecialPackage) {
        // Try to find by api_product_id first, then by name
        pkg = await Package.findOne({ api_product_id: service.service.toString() });
        if (!pkg) {
          pkg = await Package.findOne({ game_id: matchingGame.id_string, name: service.name });
        }
      } else {
        // Find existing package by game_id and diamonds to avoid duplicates
        pkg = await Package.findOne({ game_id: matchingGame.id_string, diamonds });
        
        // If we accidentally found a special package that had its diamonds set to 1 or something previously, ignore it
        if (pkg && pkg.diamonds === 0 && pkg.name !== service.name) {
            pkg = null;
        }
      }
      
      if (pkg) {
        // Update existing (do not overwrite pkg.name or category so custom values remain intact)
        // Also don't overwrite pkg.active so packages closed by admin stay closed
        pkg.original_price = originalPrice;
        pkg.api_product_id = service.service.toString();
        pkg.diamonds = diamonds;
        // Optionally update the badge if one was generated
        if (badge && !pkg.badge) {
           pkg.badge = badge;
        }
        await pkg.save();
      } else {
        // Create new
        const passKeywords = /pass|prime|weekly|monthly|pack|member|starlight|twilight|emblem|materials|deal|membership/i;
        const defaultCategory = passKeywords.test(service.name) ? "Passes & Deals" : "Normal Top-Up";

        await Package.create({
          game_id: matchingGame.id_string,
          name: displayName || service.name,
          original_price: originalPrice,
          price: defaultSellingPrice,
          diamonds,
          active: true,
          api_product_id: service.service.toString(),
          category: defaultCategory,
          badge: badge || undefined,
        });
      }

      syncedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${syncedCount} packages from G2Bulk API.` 
    });

  } catch (error: any) {
    console.error("G2Bulk Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message || "An error occurred during sync" }, { status: 500 });
  }
}
