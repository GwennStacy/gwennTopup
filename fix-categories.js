const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

async function fixCategories() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  const Package = mongoose.models.Package || mongoose.model("Package", new mongoose.Schema({}, { strict: false }));
  
  const res1 = await Package.updateMany({ category: "normal" }, { $set: { category: "Normal Top-Up" } });
  console.log(`Updated ${res1.modifiedCount} 'normal' packages to 'Normal Top-Up'`);
  
  const res2 = await Package.updateMany({ category: "pass" }, { $set: { category: "Passes & Deals" } });
  console.log(`Updated ${res2.modifiedCount} 'pass' packages to 'Passes & Deals'`);

  // Auto categorize any packages that somehow got wrong based on regex
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
  console.log(`Auto-categorized ${fixedCount} packages based on names.`);

  // Also create the two default categories if they don't exist
  const Category = mongoose.models.Category || mongoose.model("Category", new mongoose.Schema({
    game_id: String, name: String, sort_order: Number
  }));
  
  const games = await mongoose.connection.db.collection('games').find({}).toArray();
  for (const game of games) {
    const gameId = game.id_string;
    const existing = await Category.countDocuments({ game_id: gameId });
    if (existing === 0) {
      await Category.create({ game_id: gameId, name: "Normal Top-Up", sort_order: 1 });
      await Category.create({ game_id: gameId, name: "Passes & Deals", sort_order: 0 });
      console.log(`Created default categories for game ${gameId}`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

fixCategories().catch(console.error);
