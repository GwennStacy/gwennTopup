require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const PackageSchema = new mongoose.Schema({ name: String, game_id: String });
  const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);
  const res = await Package.deleteMany({
    game_id: 'mlbb',
    name: { $regex: /Brazil|Turkey|Russia|Exclusive|Special|Adventure|Global/i }
  });
  console.log('Deleted', res.deletedCount, 'unwanted packages.');
  process.exit(0);
}).catch(console.error);
