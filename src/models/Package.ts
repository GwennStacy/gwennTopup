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
  },
  { timestamps: true }
);

export default mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);
