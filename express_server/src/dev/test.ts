import _Booking from "../models/booking.model";
import _Config from "../models/config.model";

export const test = async () => {
  // console.log("Bắt đầu chạy hàm test");
};

const drivers = [
  {
    id: "e45661b7-45e9-4444-ad92-fe9fb25cd7f6",
    customerId: "aba52025-e385-4ca7-9711-36eff1832717",
    pickup: '{"geometry": {"coordinates": [21.0368973,105.8346667]}}',
    dropoff: '{"geometry": {"coordinates": [106.685671, 10.76533]}}',
    departure: "2025-04-24T06:04:19.724943",
    passengers: 4,
    price: 30888,
  },
  {
    id: "b18c4b62-74ac-4a17-a74f-5c5416e85733",
    customerId: "d6f7bd13-4473-40ab-8081-f98fa38b5c04",
    pickup: '{"geometry": {"coordinates": [21.0352231,105.8402594]}}',
    dropoff: '{"geometry": {"coordinates": [106.683888, 10.774932]}}',
    departure: "2025-04-24T05:26:19.725088",
    passengers: 4,
    price: 90368,
  },
  {
    id: "d657e737-6e44-4fea-8afb-8f8e8dbe1b83",
    customerId: "af25cb01-191f-4c33-8976-d7d17803b3de",
    pickup: '{"geometry": {"coordinates": [21.0349181,105.8502969]}}',
    dropoff: '{"geometry": {"coordinates": [106.704613, 10.786847]}}',
    departure: "2025-04-24T05:22:19.725337",
    passengers: 4,
    price: 50289,
  },
];
