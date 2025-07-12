import _Config from "../models/config.model";
import { AppError } from "./configs/appError";
import { Coordinate, GeoJson, Waypoint } from "./types/location";

export function optimizeWaypointsGreedy(
  start: GeoJson,
  end: GeoJson,
  waypoints: Waypoint[]
): Waypoint[] {
  const visited: boolean[] = new Array(waypoints.length).fill(false);
  const ordered: Waypoint[] = [];
  let currentCoord = start.geometry.coordinates as Coordinate;

  for (let i = 0; i < waypoints.length; i++) {
    let nearestIdx = -1;
    let nearestDist = Infinity;

    for (let j = 0; j < waypoints.length; j++) {
      if (visited[j]) continue;
      const candidateCoord = waypoints[j].location.geometry
        .coordinates as Coordinate;
      const dist = haversine(currentCoord, candidateCoord);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = j;
      }
    }

    if (nearestIdx !== -1) {
      visited[nearestIdx] = true;
      const nextWaypoint = waypoints[nearestIdx];
      ordered.push(nextWaypoint);
      currentCoord = nextWaypoint.location.geometry.coordinates as Coordinate;
    }
  }
  return ordered;
}

interface BookingStats {
  bookingId: string;
  totalDistance: number;
  totalDuration: number;
}

/**
 * Tính tổng distance, duration và departure cho từng bookingId
 */
export function summarizeWaypointsByBooking(
  waypoints: Waypoint[],
  targetBookingId?: string
): BookingStats[] {
  const bookingMap: Map<string, BookingStats> = new Map();

  waypoints.forEach((wp, index) => {
    if (!wp.bookingId) return;

    if (!bookingMap.has(wp.bookingId)) {
      bookingMap.set(wp.bookingId, {
        bookingId: wp.bookingId,
        totalDistance: 0,
        totalDuration: 0,
      });
    }

    const stat = bookingMap.get(wp.bookingId)!;

    stat.totalDistance += wp.distanse || 0;
    stat.totalDuration += wp.duration || 0;
  });

  const allStats = Array.from(bookingMap.values());

  if (targetBookingId) {
    return allStats.filter((s) => s.bookingId === targetBookingId);
  }

  return allStats;
}

export function haversine(coord1: Coordinate, coord2: Coordinate): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function directionVector(
  pickup: Coordinate,
  dropoff: Coordinate
): [number, number] {
  const [x1, y1] = pickup;
  const [x2, y2] = dropoff;
  const dx = x2 - x1,
    dy = y2 - y1;
  const mag = Math.sqrt(dx * dx + dy * dy);
  return [dx / mag, dy / mag];
}

export function cosineSimilarity(
  v1: [number, number],
  v2: [number, number]
): number {
  const dot = v1[0] * v2[0] + v1[1] * v2[1];
  return dot; // cosine similarity, since vectors are normalized
}

export async function calculatePrice(
  distance: number,
  passengers: number = 1
): Promise<{
  totalPrice: number;
  priceForOne: number;
  priceInfo: string;
}> {
  const configs = await _Config.find({
    type: { $in: ["min_price", "standard_price", "tax", "app_fee"] },
  });
  if (!configs) throw new AppError("not found min price config", 500);

  const pricePerKm = configs.filter((doc) => doc.type === "standard_price")[0]
    .value;
  // Chuyển đổi khoảng cách từ mét sang km
  const distanceInKm = distance / 1000;

  // Tính giá cơ bản dựa trên khoảng cách và giá/km
  let basePrice = distanceInKm * pricePerKm;

  const minPrice = configs.filter((doc) => doc.type === "min_price")[0].value;
  // Áp dụng giá tối thiểu cho
  const totalMinPrice = minPrice;
  if (basePrice < totalMinPrice) {
    basePrice = totalMinPrice;
  }

  const appFeePercent = configs.filter((doc) => doc.type === "app_fee")[0]
    .value;
  // Tính thêm phí ứng dụng
  const fee = basePrice * appFeePercent;

  const taxPercent = configs.filter((doc) => doc.type === "tax")[0].value;
  // Tính thuế
  const tax = basePrice * taxPercent;

  // Tổng giá cuối cùng
  const totalPrice = basePrice + fee + tax;

  const priceInfo = `Base Price: ${basePrice.toFixed(
    2
  )} + App Fee: ${fee.toFixed(2)} + Tax: ${tax.toFixed(
    2
  )} = Total Price: ${totalPrice.toFixed(2)} per one passenger `;

  return {
    totalPrice: totalPrice * passengers,
    priceForOne: totalPrice,
    priceInfo,
  };
}
