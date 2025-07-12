import { GeoJson } from "@/types/base";
import { PlacePrediction } from "@/types/extend";
import { format } from "date-fns";

export function toRgba(hex: string, opacity: number) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function toGeoJson(place: PlacePrediction): GeoJson {
  return {
    type: "Point",
    geometry: {
      type: "Point",
      coordinates: [0, 0],
    },
    properties: {
      description: place.description,
      place_id: place.place_id,
    },
  };
}

export const formatTime = (date: Date) => {
  try {
    return format(new Date(date), "h:mm a");
  } catch (error) {
    return "Invalid time";
  }
};

export const formatDate = (date: Date) => {
  try {
    return format(new Date(date), "MMM dd, yyyy");
  } catch (error) {
    return "Invalid time";
  }
};

export const formatDayOfWeek = (date: Date) => {
  try {
    // Format date without date-fns dependency
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  } catch (error) {
    return "Invalid date";
  }
};

export const arrivalTime = (departure: Date, duration: number) => {
  return new Date(new Date(departure).getTime() + duration * 1000);
};

export function formatMoney(amount: number, currency: string = "VND"): string {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatDistance(distance: number): string {
  if (distance >= 1000) {
    const km = distance / 1000;
    return `${km.toFixed(1)} km`;
  } else {
    const roundedMeters = Math.round(distance / 100) * 100;
    return `${roundedMeters} m`;
  }
}

export const formatDateVi = (date: Date) => {
  try {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
};

export function formatPhoneNumberToE164(phone: string) {
  // Giả sử phone là string số điện thoại có hoặc không có +84 hoặc 0 đầu
  let formatted = phone.trim();

  // Nếu bắt đầu bằng 0, thay bằng +84
  if (formatted.startsWith("0")) {
    formatted = "+84" + formatted.substring(1);
  }

  // Nếu đã bắt đầu bằng +, giữ nguyên
  if (!formatted.startsWith("+")) {
    formatted = "+" + formatted;
  }

  return formatted;
}
