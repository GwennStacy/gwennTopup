const mongoose = require('mongoose');
const uri = 'mongodb://skimheng47_db_user:Heng542180@ac-wxzmwzo-shard-00-00.48ykamt.mongodb.net:27017,ac-wxzmwzo-shard-00-01.48ykamt.mongodb.net:27017,ac-wxzmwzo-shard-00-02.48ykamt.mongodb.net:27017/gwenntopup?ssl=true&replicaSet=atlas-1i5ecb-shard-0&authSource=admin&retryWrites=true&w=majority';
async function run() {
  await mongoose.connect(uri);
  const pkg = mongoose.connection.collection('packages');
  const items = await pkg.find({ api_product_id: { $exists: true } }).toArray();
  console.log('Packages with api_product_id:', items.length);
  if(items.length > 0) {
    console.log('Sample item:', items[0]);
  }
  process.exit(0);
}
run();
