import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  game_id: string;
  name: string;
  sort_order: number;
}

const CategorySchema = new Schema(
  {
    game_id: { type: String, required: true },
    name: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

export default mongoose.model<ICategory>("Category", CategorySchema);
