import mongoose, { Schema, Document } from "mongoose";

export interface IPackage extends Document {
  game_id: string;
  name: string;
  price: number;
  original_price?: number;
  diamonds: number;
  is_popular: boolean;
  active: boolean;
  api_product_id?: string;
  image_url?: string;
  category?: string;
  badge?: string;
  sort_order?: number;
}

const PackageSchema = new Schema(
  {
    game_id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    original_price: { type: Number, default: 0 },
    diamonds: { type: Number, required: true },
    is_popular: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    api_product_id: { type: String },
    image_url: { type: String },
    category: { type: String, default: "Normal Top-Up" },
    badge: { type: String },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (mongoose.models.Package) {
  delete mongoose.models.Package;
}

export default mongoose.model<IPackage>("Package", PackageSchema);
