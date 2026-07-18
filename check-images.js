const mongoose = require('mongoose');
require('dotenv').config({path: '.env.local'});
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const pkgs = await mongoose.connection.db.collection('packages').find({ image_url: { $exists: true, $ne: null } }).toArray();
  console.log(pkgs.map(p => ({name: p.name, img: p.image_url})));
  process.exit(0);
});
