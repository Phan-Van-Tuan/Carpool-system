import mongoose from "mongoose";
import _Account, { AStatus, Role } from "../../models/account.model";
import _Assignment, { IAssignment } from "../../models/assignment.model";
import _Config from "../../models/config.model";
import _Route, { IRoute } from "../../models/route.model";
import { AppError } from "../../utils/configs/appError";
import _Driver, { getAllDriversWithVehicle } from "../../models/driver.model";
import _Trip from "../../models/trip.model";
import _Vehicle from "../../models/vehicle.model";
import { GeoJson } from "../../utils/types/location";
import { getDistanceFromGoongAPI } from "../../utils/plugins/map";

export const getAccountOverview = async () => {
  const allAccounts = await _Account.find();

  const summary = {
    all: {
      total: allAccounts.length,
      roles: {
        rider: 0,
        driver: 0,
        system: 0,
      },
    },
    webUser: {
      total: 0,
      roles: {
        owner: 0,
        admin: 0,
        support: 0,
      },
    },
    riderUser: {
      total: 0,
      status: {
        active: 0,
        pending: 0,
        blocked: 0,
      },
    },
    driverUser: {
      total: 0,
      status: {
        active: 0,
        pending: 0,
        blocked: 0,
      },
    },
  };

  for (const acc of allAccounts) {
    const role = acc.role;
    const status = acc.status;

    // Tổng theo vai trò
    if (role === Role.RIDER) {
      summary.all.roles.rider += 1;
      summary.riderUser.total += 1;
      summary.riderUser.status[status || AStatus.PENDING] += 1;
    }

    if (role === Role.DRIVER) {
      summary.all.roles.driver += 1;
      summary.driverUser.total += 1;
      summary.driverUser.status[status || AStatus.PENDING] += 1;
    }

    if (role === Role.ADMIN || role === Role.OWNER) {
      summary.all.roles.system += 1;
      summary.webUser.total += 1;
      summary.webUser.roles[role] += 1;
    }
  }

  const drivers = await getAllDriversWithVehicle();

  return { summary, allAccounts, drivers };
};

export const getConfigs = async () => {
  const Configs = await _Config.find();
  return Configs;
};

export const configPrice = async (
  type: string,
  value: number,
  info: string,
  condition: string
) => {
  const existingConfig = await _Config.findOne({ type });
  if (existingConfig) {
    // Nếu đã tồn tại, cập nhật giá
    existingConfig.value = value;
    existingConfig.info = info;
    existingConfig.condition = condition;
    await existingConfig.save();
    return existingConfig;
  } else {
    throw new AppError("Config type is invalid!", 400);
  }
};

// route
export const getAllRoutes = async () => {
  const routes = await _Route.find().sort({ createdAt: -1 });
  return routes;
};

export const createRoute = async (data: Partial<IRoute>): Promise<IRoute> => {
  const { distance, duration } = await getDistanceFromGoongAPI(
    data.from as GeoJson,
    data.to as GeoJson
  );
  return await _Route.create({ ...data, distance, duration });
};

export const updateRoute = async (
  id: string,
  update: Partial<IRoute>
): Promise<IRoute | null> => {
  return await _Route.findByIdAndUpdate(id, update, { new: true });
};

export const deleteRoute = async (id: string): Promise<boolean> => {
  const result = await _Route.findByIdAndDelete(id);
  return !!result;
};

export const getAllAssignments = async (
  filters: any
): Promise<IAssignment[]> => {
  const query: any = {};
  if (filters.driverId)
    query.driverId = new mongoose.Types.ObjectId(filters.driverId);
  if (filters.status) query.status = filters.status;

  return await _Assignment.find(query).sort({ createdAt: -1 });
};

export const createAssignment = async (
  data: Partial<IAssignment>
): Promise<IAssignment> => {
  const assignment = await _Assignment.create(data);

  const route = await _Route.findById(assignment.routeId);
  if (!route) throw new Error("Route not found");

  const vehicle = await _Vehicle.findOne({ driverId: assignment.driverId });
  if (!vehicle) throw new Error("Vehicle not found");

  const customDays = assignment.customDays || [];

  const tripDates =
    customDays.length > 0 ? customDays : [new Date().toISOString()]; // Mặc định dùng giờ hiện tại nếu không có customDays

  for (const dayStr of tripDates) {
    const departureDate = new Date(dayStr); // Sử dụng trực tiếp ISO string chuẩn
    if (isNaN(departureDate.getTime())) {
      console.warn("Invalid departure date:", dayStr);
      continue; // Bỏ qua nếu ngày không hợp lệ
    }

    const historyNote = `Tạo bởi phân công ngày ${departureDate.toISOString()}`;

    await _Trip.create({
      driverId: assignment.driverId,
      vehicleId: vehicle._id,
      routeId: route._id,
      assignmentId: assignment._id,
      startLocation: route.from,
      endLocation: route.to,
      distance: route.distance || 0,
      duration: route.duration || 0,
      bookings: [],
      history: historyNote,
      departure: departureDate,
      status: "scheduled",
    });
  }

  return assignment;
};

export const updateAssignment = async (
  id: string,
  update: Partial<IAssignment>
): Promise<IAssignment | null> => {
  const assignment = await _Assignment.findByIdAndUpdate(id, update, {
    new: true,
  });

  // if (!assignment) return null;
  // const vehicle = await _Vehicle.findOne({ driverId: assignment.driverId });
  // if (!vehicle) return null;
  // // Đồng bộ Trip tương ứng
  // await _Trip.findOneAndUpdate(
  //   { assignmentId: assignment._id },
  //   {
  //     driverId: assignment.driverId,
  //     vehicleId: vehicle._id,
  //     ...(assignment.routeId
  //       ? await (async () => {
  //           const route = await _Route.findById(assignment.routeId);
  //           if (!route) return {};
  //           return {
  //             routeId: route._id,
  //             startLocation: route.from,
  //             endLocation: route.to,
  //             waypoints: [route.from, route.to],
  //             distance: route.distance,
  //             duration: route.duration,
  //           };
  //         })()
  //       : {}),
  //   }
  // );

  return assignment;
};

export const deleteAssignment = async (id: string): Promise<boolean> => {
  const assignment = await _Assignment.findByIdAndDelete(id);
  if (!assignment) return false;

  // Xoá Trip tương ứng
  await _Trip.deleteOne({ assignmentId: assignment._id });

  return true;
};
