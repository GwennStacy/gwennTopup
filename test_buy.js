const mongoose = require('mongoose');

const uri = 'mongodb://skimheng47_db_user:Heng542180@ac-wxzmwzo-shard-00-00.48ykamt.mongodb.net:27017,ac-wxzmwzo-shard-00-01.48ykamt.mongodb.net:27017,ac-wxzmwzo-shard-00-02.48ykamt.mongodb.net:27017/gwenntopup?ssl=true&replicaSet=atlas-1i5ecb-shard-0&authSource=admin&retryWrites=true&w=majority';
const G2BULK_API_KEY = "179ea8d1d441638e6faa5ea96ec9517f2c93388b12190b24d56b7c7dfb3eb282";

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  const packages = await db.collection('packages').find({ game_id: 'mlbb', active: true, api_product_id: { $exists: true, $ne: null } }).sort({ price: 1 }).limit(1).toArray();
  const pkg = packages[0];
  console.log('Using Package:', pkg);
  
  if (!pkg || !pkg.api_product_id) {
     console.log('No synced package found.');
     mongoose.disconnect();
     return;
  }
  
  const linksToTry = [
    "322485725(3625)",
    "322485725|3625",
    "322485725 3625",
    "322485725"
  ];
  
  for (const link of linksToTry) {
      console.log(`\nTrying link format: ${link}`);
      const params = new URLSearchParams({
        key: G2BULK_API_KEY,
        action: "add",
        service: pkg.api_product_id,
        link: link,
        quantity: "1" 
      });
      
      const response = await fetch("https://api.g2bulk.com/api/v2", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      
      const data = await response.json();
      console.log("Order Response:", data);
      
      if (data.order) {
          console.log("SUCCESS! Order ID:", data.order);
          break;
      }
      
      if (data.error && data.error.toLowerCase().includes('balance')) {
          console.log("Insufficient balance, cannot proceed.");
          break;
      }
      // If error is about invalid link format, try the next one.
  }
  
  mongoose.disconnect();
}

main().catch(console.error);
