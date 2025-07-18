import mongoose, { Document, Schema } from "mongoose";

export interface IHelp extends Document {
  accountId: mongoose.Types.ObjectId;
  issue: string;
  content: string;
  image: string[];
}

const HelpSchema: Schema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    issue: { type: String, required: true },
    content: { type: String, required: true },
    image: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IHelp>("Help", HelpSchema);
