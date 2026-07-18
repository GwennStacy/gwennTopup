const mongoose = require('mongoose');
const uri = 'mongodb://skimheng47_db_user:Heng542180@ac-wxzmwzo-shard-00-00.48ykamt.mongodb.net:27017,ac-wxzmwzo-shard-00-01.48ykamt.mongodb.net:27017,ac-wxzmwzo-shard-00-02.48ykamt.mongodb.net:27017/gwenntopup?ssl=true&replicaSet=atlas-1i5ecb-shard-0&authSource=admin&retryWrites=true&w=majority';
async function run() {
  await mongoose.connect(uri);
  const pkg = mongoose.connection.collection('packages');
  const result = await pkg.deleteMany({ game_id: 'mlbb', name: { $regex: 'Global', $options: 'i' } });
  console.log('Deleted Global packages:', result.deletedCount);
  process.exit(0);
}
run();
