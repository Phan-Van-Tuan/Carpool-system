import { UpdateQuery } from "mongoose";
import _Account from "../../models/account.model";
import _Driver from "../../models/driver.model";
import _Vehicle from "../../models/vehicle.model";
import { AppError } from "../../utils/configs/appError";

export const AccountService = {
  getProfile: async (userId: string) => {
    return await _Account.findById(userId).select("-password").lean();
  },

  // for drive
  getMyProfile: async (userId: string) => {
    const account = await _Account.findById(userId).select("-password").lean();
    if (!account) throw new AppError("Account not found", 500);
    const driver = await _Driver.findOne({ accountId: userId }).lean();
    if (!driver) throw new AppError("Driver not found", 500);
    const vehicle = await _Vehicle.findOne({ driverId: driver._id }).lean();
    if (!vehicle) throw new AppError("Vehicle not found", 500);
    return { account, driver, vehicle };
  },

  updateProfile: async (userId: string, data: UpdateQuery<any>) => {
    // console.log(data);
    return await _Account
      .findByIdAndUpdate(userId, data, {
        new: true,
      })
      .select("-password");
  },

  updateAvatar: async (userId: string, avatar: string) => {
    return await _Account
      .findByIdAndUpdate(userId, { avatar }, { new: true })
      .select("-password");
  },

  getActivity: async (userId: string) => {
    return await _Account
      .findById(userId)
      .select("rating cancelPercent totalTrips");
  },
};
