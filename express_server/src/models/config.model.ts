import mongoose, { Schema, model } from "mongoose";

export interface IConfig extends Document {
  type:
    | "standard_price"
    | "premium_price"
    | "vip_price"
    | "tax"
    | "app_fee"
    | "min_price";
  value: number;
  info?: string;
  condition?: string;
}

const ConfigSchema = new Schema({
  type: { type: String, require, unique: true },
  value: { type: Number, require },
  info: { type: String },
  condition: { type: String },
});

const _Config = model<IConfig>("Config", ConfigSchema);
export default _Config;
