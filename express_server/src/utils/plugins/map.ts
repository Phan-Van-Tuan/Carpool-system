import e from "express";
import { AppError } from "../configs/appError";
import config from "../configs/variable";
import { Coordinate, GeoJson, Waypoint } from "../types/location";
import axios from "axios";

const GOONG_API_KEY = config.GOONG_API_KEY;

export interface GoongDistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      status: string;
      duration: { text: string; value: number };
      distance: { text: string; value: number };
    }>;
  }>;
}

export async function getDistanceMatrix(
  waypoints: Waypoint[],
  origin: GeoJson
): Promise<{
  updatedWaypoints: Waypoint[];
  totalDistance: number;
  totalDuration: number;
}> {
  const apiKey = process.env.GOONG_API_KEY || "YOUR_API_KEY";
  const vehicle = "car";

  const origins = `${origin.geometry.coordinates[1]},${origin.geometry.coordinates[0]}`;
  const destinations = waypoints
    .map(
      (w) =>
        `${w.location.geometry.coordinates[1]},${w.location.geometry.coordinates[0]}`
    )
    .join("|");

  try {
    const response = await axios.get<GoongDistanceMatrixResponse>(
      `https://rsapi.goong.io/DistanceMatrix?origins=${origins}&destinations=${destinations}&vehicle=${vehicle}&api_key=${apiKey}`
    );

    const elements = response.data.rows[0]?.elements;

    if (!elements || elements.length !== waypoints.length) {
      throw new Error("Invalid or mismatched response from Goong API");
    }

    let totalDistance = 0;
    let totalDuration = 0;

    const updatedWaypoints = waypoints.map((wp, index) => {
      const element = elements[index];

      totalDistance += element.distance.value;
      totalDuration += element.duration.value;

      return {
        ...wp,
        distanse: element.distance.value,
        duration: element.duration.value,
      };
    });

    return {
      updatedWaypoints,
      totalDistance,
      totalDuration,
    };
  } catch (error) {
    throw new Error(`Goong API error: ${error}`);
  }
}

// Tính distance và duration cho booking
export function calculateBookingMetrics(
  pickup: GeoJson,
  dropoff: GeoJson,
  routeData: { elements: any[] }
) {
  // Tìm index của pickup và dropoff trong waypoints
  const pickupStr = `${pickup.geometry.coordinates[1]},${pickup.geometry.coordinates[0]}`;
  const dropoffStr = `${dropoff.geometry.coordinates[1]},${dropoff.geometry.coordinates[0]}`;

  const pickupIdx = routeData.elements.findIndex((e: any, i: number) =>
    e.distance.text.includes(pickupStr)
  );
  const dropoffIdx = routeData.elements.findIndex((e: any, i: number) =>
    e.distance.text.includes(dropoffStr)
  );

  if (pickupIdx === -1 || dropoffIdx === -1) {
    return { distance: 0, duration: 0 };
  }

  return {
    distance: routeData.elements[pickupIdx].distance.value,
    duration: routeData.elements[pickupIdx].duration.value,
  };
}

// Tính thời gian khởi hành
export function calculateDepartureTime(
  tripDeparture: Date,
  routeData: { elements: any[] },
  pickup: GeoJson
): Date {
  const pickupStr = `${pickup.geometry.coordinates[1]},${pickup.geometry.coordinates[0]}`;
  const pickupIdx = routeData.elements.findIndex((e: any, i: number) =>
    e.distance.text.includes(pickupStr)
  );
  if (pickupIdx === -1) return tripDeparture;

  const timeToPickup = routeData.elements[pickupIdx].duration.value; // Giây
  return new Date(tripDeparture.getTime() + timeToPickup * 1000);
}

export async function validateRouteWithGoong(allPoints: Coordinate[]) {
  if (allPoints.length < 2) return false;
  const coords = allPoints.map((p) => p.join(","));
  const origin = coords[0];
  const destination = coords[coords.length - 1];
  const waypoints = coords.slice(1, -1).join("|");

  const url = `https://rsapi.goong.io/DistanceMatrix?origins=${origin}&destinations=${destination}&waypoints=${waypoints}&api_key=${GOONG_API_KEY}`;

  try {
    const res = await axios.get(url);
    const distance = res.data.routes[0].legs.reduce(
      (sum: number, leg: any) => sum + leg.distance.value,
      0
    );
    const duration = res.data.routes[0].legs.reduce(
      (sum: number, leg: any) => sum + leg.duration.value,
      0
    );
    return distance < 15000 && duration < 1800;
  } catch (err: any) {
    console.error("Goong API error", err);
    return false;
  }
}

export const getDistanceFromGoongAPI = async (
  pickup: GeoJson,
  dropoff: GeoJson
): Promise<{ distance: number; duration: number }> => {
  try {
    const response = await axios.get("https://rsapi.goong.io/Direction", {
      params: {
        origin: `${pickup.geometry.coordinates[1]},${pickup.geometry.coordinates[0]}`,
        destination: `${dropoff.geometry.coordinates[1]},${dropoff.geometry.coordinates[0]}`,
        vehicle: "car",
        api_key: GOONG_API_KEY,
      },
    });
    const distance = response.data.routes[0].legs[0].distance.value;
    const duration = response.data.routes[0].legs[0].duration.value;

    return { distance, duration }; // { m , s}
  } catch (error) {
    console.error("Error getting distance from Goong API:", error);
    throw error;
  }
};
