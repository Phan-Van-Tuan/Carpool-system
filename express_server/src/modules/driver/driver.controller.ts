import { Request, Response } from "express";
import * as DriverService from "./driver.service";
import { created, success } from "../../utils/configs/res";

export const register = async (req: Request, res: Response) => {
  const result = await DriverService.registerDriver(req.body);
  return res.status(201).json(created(result, "Driver"));
};

export const update = async (req: Request, res: Response) => {
  const { data } = req.body;
  const result = await DriverService.updateDriver(req.user.id, data);
  return res.json(success(result));
};

export const adminUpdate = async (req: Request, res: Response) => {
  const { data } = req.body;
  const result = await DriverService.updateDriver(req.params.driverId, data);
  return res.json(success(result));
};

export const getMe = async (req: Request, res: Response) => {
  const result = await DriverService.getDriverProfile(req.user.id);
  return res.json(success(result));
};

export const getTripHistory = async (req: Request, res: Response) => {
  const result = await DriverService.getTripHistory(
    req.user.id,
    req.query.period as string,
    req.query.offset as unknown as number
  );
  // console.log("Trip history result:", result);
  return res.json(success(result));
};

export const getUpcomingTrip = async (req: Request, res: Response) => {
  const result = await DriverService.getUpcomingTrip(req.user.id);
  // console.log("Upcoming trip result:", result);
  return res.json(success(result));
};

export const startTrip = async (req: Request, res: Response) => {
  const result = await DriverService.startTrip(req.params.id);
  // console.log("Start trip result:", result);
  return res.json(success(result));
};

export const finishTrip = async (req: Request, res: Response) => {
  const result = await DriverService.finishTrip(req.params.id, req.body.note);
  return res.json(success(result));
};

export const getTripDetail = async (req: Request, res: Response) => {
  const result = await DriverService.getTripDetail(req.user.id, req.params.id);
  return res.json(success(result));
};
