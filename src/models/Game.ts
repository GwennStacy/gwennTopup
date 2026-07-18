import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
  id_string: string;
  name: string;
  publisher: string;
  image_url?: string;
  requires_zone_id: boolean;
  active: boolean;
}

const GameSchema = new Schema(
  {
    id_string: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    publisher: { type: String, required: true },
    image_url: { type: String },
    requires_zone_id: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);
