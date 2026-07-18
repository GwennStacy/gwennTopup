import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    const Package = mongoose.models.Package || (await import("@/models/Package")).default;
    const Category = mongoose.models.Category || (await import("@/models/Category")).default;
    const Game = mongoose.models.Game || (await import("@/models/Game")).default;

    // 1. Rename existing string exact matches
    const res1 = await Package.updateMany({ category: "normal" }, { $set: { category: "Normal Top-Up" } });
    const res2 = await Package.updateMany({ category: "pass" }, { $set: { category: "Passes & Deals" } });

    // 2. Auto categorize any packages based on regex
    const packages = await Package.find({});
    const passKeywords = /pass|prime|weekly|monthly|pack|member|starlight|twilight|emblem|materials|deal/i;
    
    let fixedCount = 0;
    for (let pkg of packages) {
      const isPass = passKeywords.test(pkg.name);
      const expectedCat = isPass ? "Passes & Deals" : "Normal Top-Up";
      if (pkg.category !== expectedCat) {
        await Package.updateOne({ _id: pkg._id }, { $set: { category: expectedCat } });
        fixedCount++;
      }
    }

    // 3. Create the two default categories if they don't exist
    const games = await Game.find({});
    let createdCats = 0;
    for (const game of games) {
      const gameId = game.id_string;
      const existing = await Category.countDocuments({ game_id: gameId });
      if (existing === 0) {
        await Category.create({ game_id: gameId, name: "Normal Top-Up", sort_order: 1 });
        await Category.create({ game_id: gameId, name: "Passes & Deals", sort_order: 0 });
        createdCats += 2;
      }
    }

    return NextResponse.json({
      message: "Categories fixed successfully",
      updatedNormal: res1.modifiedCount,
      updatedPass: res2.modifiedCount,
      regexFixed: fixedCount,
      createdDefaultCategories: createdCats
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
