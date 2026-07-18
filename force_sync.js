const mongoose = require('mongoose');

async function run() {
  await mongoose.connect("mongodb://skimheng47_db_user:Heng542180@ac-wxzmwzo-shard-00-00.48ykamt.mongodb.net:27017,ac-wxzmwzo-shard-00-01.48ykamt.mongodb.net:27017,ac-wxzmwzo-shard-00-02.48ykamt.mongodb.net:27017/gwenntopup?ssl=true&replicaSet=atlas-1i5ecb-shard-0&authSource=admin&retryWrites=true&w=majority");
  const Package = mongoose.connection.collection('packages');
  
  const res = await fetch("https://api.g2bulk.com/api/v2", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      action: "services",
      key: "179ea8d1d441638e6faa5ea96ec9517f2c93388b12190b24d56b7c7dfb3eb282",
    }),
  });
  
  const services = await res.json();
  let updated = 0;
  
  for (const service of services) {
    const originalPrice = parseFloat(service.rate);
    const result = await Package.updateOne(
      { api_product_id: service.service.toString() },
      { $set: { original_price: originalPrice } }
    );
    if (result.modifiedCount > 0) updated++;
  }
  
  console.log(`Successfully updated ${updated} packages with original_price!`);
  process.exit(0);
}
run();
