import { Request, Response } from "express";
import * as Service from "./admin.service";
import { created, notFound, success } from "../../utils/configs/res";

export const getAccountOverview = async (req: Request, res: Response) => {
  const data = await Service.getAccountOverview();
  return res.json(success(data));
};

export const getConfigs = async (req: Request, res: Response) => {
  const data = await Service.getConfigs();
  return res.status(200).json(success(data));
};

export const configPrice = async (req: Request, res: Response) => {
  const { type, value, info, condition } = req.body;
  const data = await Service.configPrice(type, value, info, condition);
  return res.status(200).json(success(data));
};

// route
export const getAllRoutes = async (req: Request, res: Response) => {
  const data = await Service.getAllRoutes();
  return res.json(success(data));
};

export const createRoute = async (req: Request, res: Response) => {
  const data = await Service.createRoute(req.body);
  return res.status(201).json(created(data, "Route"));
};

export const updateRoute = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await Service.updateRoute(id, req.body);
  return res.json(success(data));
};

export const deleteRoute = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ok = await Service.deleteRoute(id);
  return res.status(204).send(ok);
};
// asignment
export const getAllAssignments = async (req: Request, res: Response) => {
  const data = await Service.getAllAssignments(req.query);
  return res.json(success(data));
};

export const createAssignment = async (req: Request, res: Response) => {
  const data = await Service.createAssignment(req.body);
  return res.status(201).json(created(data, "Assignment"));
};

export const updateAssignment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await Service.updateAssignment(id, req.body);
  return res.json(success(data));
};

export const deleteAssignment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ok = await Service.deleteAssignment(id);
  return res.status(204).send();
};
