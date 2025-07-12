import { Types } from "mongoose";
import { GeoJson } from "../../utils/types/location";
import _Trip from "../../models/trip.model";
import _Booking from "../../models/booking.model";
import _Route from "../../models/route.model";
import { calculatePrice } from "../../utils/core";

interface MatchingTripInput {
  pickup: GeoJson;
  dropoff: GeoJson;
  passengerCount: number;
  departureDate: string; // YYYY-MM-DD
  nearRadiusKm?: number;
}

export const findMatchingTrips = async (input: MatchingTripInput) => {
  const {
    pickup,
    dropoff,
    passengerCount,
    departureDate,
    nearRadiusKm = 20,
  } = input;

  if (!pickup?.geometry?.coordinates || !dropoff?.geometry?.coordinates) {
    throw new Error("Invalid location coordinates");
  }

  if (passengerCount < 1) {
    throw new Error("Invalid passenger count");
  }

  if (!departureDate) {
    throw new Error("Departure date is required");
  }

  const radiusMeters = nearRadiusKm * 1000;
  const startOfDay = new Date(departureDate);
  const endOfDay = new Date(new Date(departureDate).setHours(23, 59, 59, 999));

  if (isNaN(startOfDay.getTime()) || isNaN(endOfDay.getTime())) {
    throw new Error("Invalid date format");
  }

  const trips = await _Trip
    .find({
      departure: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["pending", "scheduled"] },
    })
    .populate({
      path: "driverId",
      populate: {
        path: "accountId",
        select: "-password -refreshToken",
      },
    })
    .populate("vehicleId")
    .lean();

  const matchingTrips = [];

  for (const trip of trips) {
    try {
      if (
        !isValidPoint(trip.startLocation) ||
        !isValidPoint(pickup) ||
        !isValidPoint(dropoff)
      ) {
        continue;
      }

      const vehicle = trip.vehicleId as any;
      if (!vehicle || !vehicle.seats) continue;

      const bookings = await _Booking.find({
        _id: { $in: trip.bookings },
        status: { $in: ["pending", "process"] },
      });

      const bookedSeats = bookings.reduce(
        (sum, b) => sum + (b.passengers || 0),
        0
      );
      const availableSeats = vehicle.seats - bookedSeats;
      if (availableSeats < passengerCount) continue;

      const route = trip.routeId
        ? await _Route.findById(trip.routeId).lean()
        : null;

      const tripDetails = await calculateTripDetails({
        trip,
        route,
        pickup,
        dropoff,
        radiusMeters,
        passengerCount,
        availableSeats,
        vehicle,
      });

      if (tripDetails) {
        matchingTrips.push(tripDetails);
      }
    } catch (error) {
      console.error(`Error processing trip ${trip._id}:`, error);
      continue;
    }
  }

  return {
    size: matchingTrips.length,
    input,
    trips: matchingTrips.sort((a, b) => a.estimatedPrice - b.estimatedPrice),
  };
};

function isValidPoint(location: any): boolean {
  return (
    location?.geometry?.type === "Point" &&
    Array.isArray(location.geometry.coordinates) &&
    location.geometry.coordinates.length === 2 &&
    !isNaN(location.geometry.coordinates[0]) &&
    !isNaN(location.geometry.coordinates[1])
  );
}

async function calculateTripDetails({
  trip,
  route,
  pickup,
  dropoff,
  radiusMeters,
  passengerCount,
  availableSeats,
  vehicle,
}: {
  trip: any;
  route: any;
  pickup: GeoJson;
  dropoff: GeoJson;
  radiusMeters: number;
  passengerCount: number;
  availableSeats: number;
  vehicle: any;
}) {
  const nearStart =
    getDistanceInMeters(
      trip.startLocation.geometry.coordinates as [number, number],
      pickup.geometry.coordinates as [number, number]
    ) <= radiusMeters;

  const nearEndDirect =
    getDistanceInMeters(
      trip.endLocation.geometry.coordinates as [number, number],
      dropoff.geometry.coordinates as [number, number]
    ) <= radiusMeters;

  let nearEndViaRoute = false;
  if (!nearEndDirect && route?.router?.geometry?.type === "LineString") {
    nearEndViaRoute = route.router.geometry.coordinates.some((coord: any) => {
      return (
        getDistanceInMeters(
          coord as [number, number],
          dropoff.geometry.coordinates as [number, number]
        ) <= radiusMeters
      );
    });
  }

  if (!nearStart || !(nearEndDirect || nearEndViaRoute)) {
    return null;
  }

  const distanceFromStartToPickup = getDistanceInMeters(
    trip.startLocation.geometry.coordinates as [number, number],
    pickup.geometry.coordinates as [number, number]
  );

  const estimatedPickupTime = new Date(
    trip.departure.getTime() +
      estimateTravelTimeSeconds(distanceFromStartToPickup)
  );

  const pickupToDropoffDistance = getDistanceInMeters(
    pickup.geometry.coordinates as [number, number],
    dropoff.geometry.coordinates as [number, number]
  );

  const estimatedDropoffTime = new Date(
    estimatedPickupTime.getTime() +
      estimateTravelTimeSeconds(pickupToDropoffDistance)
  );

  const estimatedPrice = (
    await calculatePrice(pickupToDropoffDistance, passengerCount)
  ).priceForOne;

  return {
    ...trip,
    tripId: trip._id,
    estimatedPickupTime: estimatedPickupTime.toISOString(),
    estimatedDropoffTime: estimatedDropoffTime.toISOString(),
    estimatedPrice,
    estimatedDistance: pickupToDropoffDistance,
    availableSeats,
  };
}

export function getDistanceInMeters(
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number]
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function estimateTravelTimeSeconds(
  distanceInMeters: number,
  speedKmh = 30
): number {
  const speedMps = (speedKmh * 1000) / 3600;
  return Math.round(distanceInMeters / speedMps) * 1000;
}
