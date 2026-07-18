import mongoose, { Schema, Document } from "mongoose";
import "./Package"; // Ensure Package schema is registered for populate
import "./Game"; // Ensure Game schema is registered for populate

export interface IOrder extends Document {
  order_id: string;
  game_id: mongoose.Types.ObjectId;
  package_id: mongoose.Types.ObjectId;
  user_id: string; // The player ID
  zone_id?: string;
  payment_method: string;
  total_price: number;
  original_price?: number;
  profit?: number;
  status: "pending" | "processing" | "success" | "failed";
  khqr_string?: string;
  khqr_url?: string;
}

const OrderSchema = new Schema(
  {
    order_id: { type: String, required: true, unique: true },
    game_id: { type: Schema.Types.ObjectId, ref: "Game", required: true },
    package_id: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    user_id: { type: String, required: true },
    zone_id: { type: String },
    payment_method: { type: String, required: true },
    total_price: { type: Number, required: true },
    original_price: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "processing", "success", "failed"],
      default: "pending",
    },
    khqr_string: { type: String },
    khqr_url: { type: String },
  },
  { timestamps: true }
);

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.model<IOrder>("Order", OrderSchema);
