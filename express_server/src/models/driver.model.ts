import mongoose, { Document, Schema } from "mongoose";

type Status = "pending" | "approved" | "rejected" | "exprired";

export interface IDriver extends Document {
  accountId: mongoose.Types.ObjectId;
  number: number;
  documents: [
    {
      name: string;
      document: string[];
      status: Status;
      note?: string;
      expire?: Date;
    }
  ];
}

const DriverSchema: Schema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    number: { Type: Number },
    documents: [
      {
        name: String,
        document: [String],
        status: String,
        note: String,
        expire: Date,
      },
    ],
  },
  { timestamps: true }
);

const _Driver = mongoose.model<IDriver>("Driver", DriverSchema);
export default _Driver;

export const getAllDriversWithVehicle = async () => {
  const result = await _Driver.aggregate([
    {
      $lookup: {
        from: "vehicles", // Tên collection (viết thường, số nhiều)
        localField: "_id", // Trường ở Driver
        foreignField: "driverId", // Trường ở Vehicle
        as: "vehicle",
      },
    },
    {
      $unwind: {
        path: "$vehicle",
        preserveNullAndEmptyArrays: true, // Để không bị mất driver chưa có vehicle
      },
    },
  ]);

  return result;
};
