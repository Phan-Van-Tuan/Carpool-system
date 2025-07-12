import { Trip } from "@/types/trip";

export const mockTripRequests: Trip[] = [
  {
    id: "trip-001",
    passenger: {
      id: "p-001",
      name: "Linh Tran",
      rating: 4.7,
      profileImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      phone: "+84 987 654 321",
    },
    pickup: {
      latitude: 10.7769,
      longitude: 106.7009,
      address: "123 Nguyen Hue, District 1, Ho Chi Minh City",
    },
    dropoff: {
      latitude: 10.8231,
      longitude: 106.6297,
      address: "456 Phan Van Tri, Go Vap District, Ho Chi Minh City",
    },
    status: "requested",
    fare: 120000,
    distance: 8.5,
    duration: 25,
    requestTime: new Date(Date.now() - 60000).toISOString(),
    paymentMethod: "card",
    notes: "Please call when you arrive",
  },
];

export const mockActiveTrip: Trip = {
  id: "trip-002",
  passenger: {
    id: "p-002",
    name: "Huy Pham",
    rating: 4.9,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    phone: "+84 909 123 456",
  },
  pickup: {
    latitude: 10.7769,
    longitude: 106.7009,
    address: "123 Nguyen Hue, District 1, Ho Chi Minh City",
  },
  dropoff: {
    latitude: 10.7459,
    longitude: 106.7018,
    address: "789 Nguyen Thi Minh Khai, District 3, Ho Chi Minh City",
  },
  status: "in_progress",
  fare: 85000,
  distance: 5.2,
  duration: 18,
  requestTime: new Date(Date.now() - 1200000).toISOString(),
  acceptTime: new Date(Date.now() - 1140000).toISOString(),
  pickupTime: new Date(Date.now() - 900000).toISOString(),
  paymentMethod: "cash",
};

export const mockTripHistory: Trip[] = [
  {
    id: "trip-003",
    passenger: {
      id: "p-003",
      name: "Tuan Nguyen",
      rating: 4.5,
      profileImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    pickup: {
      latitude: 10.8231,
      longitude: 106.6297,
      address: "456 Phan Van Tri, Go Vap District, Ho Chi Minh City",
    },
    dropoff: {
      latitude: 10.7769,
      longitude: 106.7009,
      address: "123 Nguyen Hue, District 1, Ho Chi Minh City",
    },
    status: "completed",
    fare: 135000,
    distance: 9.8,
    duration: 32,
    requestTime: "2023-06-15T08:30:00Z",
    acceptTime: "2023-06-15T08:32:00Z",
    pickupTime: "2023-06-15T08:45:00Z",
    dropoffTime: "2023-06-15T09:17:00Z",
    paymentMethod: "card",
    rating: 5,
    feedback: "Great driver, very professional",
  },
  {
    id: "trip-004",
    passenger: {
      id: "p-004",
      name: "Mai Le",
      rating: 4.8,
      profileImage:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    pickup: {
      latitude: 10.7459,
      longitude: 106.7018,
      address: "789 Nguyen Thi Minh Khai, District 3, Ho Chi Minh City",
    },
    dropoff: {
      latitude: 10.8019,
      longitude: 106.7505,
      address: "101 Xa Lo Ha Noi, Thu Duc City, Ho Chi Minh City",
    },
    status: "completed",
    fare: 175000,
    distance: 12.3,
    duration: 40,
    requestTime: "2023-06-14T15:10:00Z",
    acceptTime: "2023-06-14T15:12:00Z",
    pickupTime: "2023-06-14T15:25:00Z",
    dropoffTime: "2023-06-14T16:05:00Z",
    paymentMethod: "wallet",
    rating: 4,
    feedback: "Good ride but took a longer route",
  },
  {
    id: "trip-005",
    passenger: {
      id: "p-005",
      name: "Thanh Vo",
      rating: 4.6,
      profileImage:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    pickup: {
      latitude: 10.8019,
      longitude: 106.7505,
      address: "101 Xa Lo Ha Noi, Thu Duc City, Ho Chi Minh City",
    },
    dropoff: {
      latitude: 10.7983,
      longitude: 106.6953,
      address: "202 Nguyen Van Cu, District 5, Ho Chi Minh City",
    },
    status: "completed",
    fare: 95000,
    distance: 6.7,
    duration: 22,
    requestTime: "2023-06-14T10:05:00Z",
    acceptTime: "2023-06-14T10:07:00Z",
    pickupTime: "2023-06-14T10:20:00Z",
    dropoffTime: "2023-06-14T10:42:00Z",
    paymentMethod: "cash",
    rating: 5,
    feedback: "Excellent service",
  },
  {
    id: "trip-006",
    passenger: {
      id: "p-006",
      name: "Hung Tran",
      rating: 4.3,
      profileImage:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    },
    pickup: {
      latitude: 10.7983,
      longitude: 106.6953,
      address: "202 Nguyen Van Cu, District 5, Ho Chi Minh City",
    },
    dropoff: {
      latitude: 10.7769,
      longitude: 106.7009,
      address: "123 Nguyen Hue, District 1, Ho Chi Minh City",
    },
    status: "cancelled",
    fare: 0,
    distance: 4.5,
    duration: 15,
    requestTime: "2023-06-13T18:30:00Z",
    acceptTime: "2023-06-13T18:32:00Z",
    paymentMethod: "card",
  },
];
