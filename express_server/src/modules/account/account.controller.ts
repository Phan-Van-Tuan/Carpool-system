import { Request, Response } from "express";
import { AccountService } from "./account.service";
import { success } from "../../utils/configs/res";

export const AccountController = {
  getProfile: async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (userId === "me") {
      const driver = await AccountService.getMyProfile(req.user.id);
      return res.json(success(driver));
    } else {
      const user = await AccountService.getProfile(userId);
      return res.json(success(user));
    }
  },

  updateProfile: async (req: Request, res: Response) => {
    const { status, ...data } = req.body;
    const updated = await AccountService.updateProfile(req.user.id, data);
    res.json(updated);
  },

  adminUpdate: async (req: Request, res: Response) => {
    const data = req.body;
    const updated = await AccountService.updateProfile(req.params.id, data);
    res.json(updated);
  },

  updateAvatar: async (req: Request, res: Response) => {
    const { avatar } = req.body;
    const updated = await AccountService.updateAvatar(req.user.id, avatar);
    res.json(updated);
  },

  getActivity: async (req: Request, res: Response) => {
    const stats = await AccountService.getActivity(req.user.id);
    res.json(stats);
  },
};
