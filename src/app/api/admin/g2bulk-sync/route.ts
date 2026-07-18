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
          bestServices.set(key, { service, matchingGame, diamonds, isSpecialPackage });
        }
      }
    }

    // Now save the best services to the database
    for (const { service, matchingGame, diamonds, isSpecialPackage } of bestServices.values()) {
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
        // Update existing (do not overwrite pkg.name so custom names remain intact)
        pkg.original_price = originalPrice;
        pkg.api_product_id = service.service.toString();
        pkg.diamonds = diamonds;
        pkg.active = true;
        await pkg.save();
      } else {
        // Create new
        await Package.create({
          game_id: matchingGame.id_string,
          name: service.name,
          original_price: originalPrice,
          price: defaultSellingPrice,
          diamonds,
          active: true,
          api_product_id: service.service.toString(),
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
