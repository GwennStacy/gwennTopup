import { config } from 'dotenv';
config({ path: '.env.local' });
import mongoose from 'mongoose';
import connectToDatabase from './src/lib/mongodb';
import Game from './src/models/Game';

async function run() {
  await connectToDatabase();
  const games = await Game.find({});
  console.log(games);
  mongoose.disconnect();
}
run();
