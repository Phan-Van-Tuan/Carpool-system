import mongoose, { Schema } from "mongoose";

export interface ILocation {
  accountId: mongoose.Types.ObjectId;
  location: string;
  timestamp: Date;
}

