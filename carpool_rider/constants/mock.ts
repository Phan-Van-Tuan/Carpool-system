import { Booking } from "@/types";

const mockLocations = [
  {
    address: "Downtown",
    latitude: 21.0278,
    longitude: 105.8342,
    name: "Downtown Area",
  },
  {
    address: "Airport",
    latitude: 21.2187,
    longitude: 105.8047,
    name: "Noi Bai International Airport",
  },
  {
    address: "University",
    latitude: 21.007,
    longitude: 105.843,
    name: "Vietnam National University",
  },
  {
    address: "Shopping Mall",
    latitude: 21.0227,
    longitude: 105.8194,
    name: "Vincom Center",
  },
  {
    address: "Residential Area",
    latitude: 21.0359,
    longitude: 105.7731,
    name: "My Dinh Residential Area",
  },
  {
    address: "Business District",
    latitude: 21.0287,
    longitude: 105.854,
    name: "Hoan Kiem Business District",
  },
  {
    address: "Train Station",
    latitude: 21.0249,
    longitude: 105.8411,
    name: "Hanoi Railway Station",
  },
  {
    address: "Bus Terminal",
    latitude: 21.0414,
    longitude: 105.8093,
    name: "My Dinh Bus Terminal",
  },
  {
    address: "Hospital",
    latitude: 21.0399,
    longitude: 105.8203,
    name: "Bach Mai Hospital",
  },
  {
    address: "Park",
    latitude: 21.0313,
    longitude: 105.8516,
    name: "Hoan Kiem Lake Park",
  },
];
// Generate mock trips based on locations
// const generateMockTrips = (
//   pickup: Location | null,
//   dropoff: Location | null,
//   date: Date | null
// ): Trip[] => {
//   if (!pickup || !dropoff || !date) {
//     return [];
//   }

//   // Create departure times throughout the day
//   const departureTimes = [
//     new Date(date.setHours(7, 0, 0, 0)),
//     new Date(date.setHours(9, 30, 0, 0)),
//     new Date(date.setHours(12, 0, 0, 0)),
//     new Date(date.setHours(14, 30, 0, 0)),
//     new Date(date.setHours(17, 0, 0, 0)),
//     new Date(date.setHours(19, 30, 0, 0)),
//   ];

//   return departureTimes.map((departureTime, index) => {
//     // Calculate a random duration between 30 and 90 minutes
//     const durationMinutes = Math.floor(Math.random() * 60) + 30;
//     const arrivalTime = new Date(
//       departureTime.getTime() + durationMinutes * 60000
//     );

//     // Calculate a random distance between 5 and 30 km
//     const distance = Math.floor(Math.random() * 25) + 5;

//     // Calculate a price based on distance (base price + per km)
//     const price = 10000 + distance * 5000;

//     // Assign a driver and vehicle
//     const driverIndex = index % mockDrivers.length;
//     const driver = mockDrivers[driverIndex];
//     const vehicle = mockVehicles[driverIndex];

//     // Generate a random number of available seats (1-4)
//     const availableSeats = Math.floor(Math.random() * 4) + 1;

//     return {
//       id: `trip-${index + 1}`,
//       driverId: driver.id,
//       vehicleId: vehicle.id,
//       startLocation: pickup.address,
//       endLocation: dropoff.address,
//       waypoints: [],
//       distance,
//       duration: durationMinutes,
//       departureTime,
//       arrivalTime,
//       availableSeats,
//       price,
//       status: "scheduled",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       driver,
//       vehicle,
//     };
//   });
// };
// Mock data for drivers
const mockDrivers = [
  {
    id: "d1",
    userId: "u1",
    licenseNumber: "DL12345678",
    licenseExpiry: new Date("2025-12-31"),
    isVerified: true,
    isActive: true,
    experience: 3,
    user: {
      id: "u1",
      firstName: "John",
      lastName: "Driver",
      email: "john.driver@example.com",
      phone: "+84123456789",
      role: "driver",
      rating: 4.8,
      cancelPercent: 2,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0JTIwbWFufGVufDB8fDB8fHww",
      createdAt: new Date("2021-01-15"),
      updatedAt: new Date("2023-05-20"),
    },
    rating: 4.8,
  },
  {
    id: "d2",
    userId: "u2",
    licenseNumber: "DL87654321",
    licenseExpiry: new Date("2024-10-15"),
    isVerified: true,
    isActive: true,
    experience: 5,
    user: {
      id: "u2",
      firstName: "Sarah",
      lastName: "Smith",
      email: "sarah.smith@example.com",
      phone: "+84987654321",
      role: "driver",
      rating: 4.9,
      cancelPercent: 1,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXQlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D",
      createdAt: new Date("2020-03-10"),
      updatedAt: new Date("2023-06-15"),
    },
    rating: 4.9,
  },
  {
    id: "d3",
    userId: "u3",
    licenseNumber: "DL55667788",
    licenseExpiry: new Date("2025-05-20"),
    isVerified: true,
    isActive: true,
    experience: 2,
    user: {
      id: "u3",
      firstName: "Michael",
      lastName: "Wong",
      email: "michael.wong@example.com",
      phone: "+84555666777",
      role: "driver",
      rating: 4.6,
      cancelPercent: 3,
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXQlMjBtYW58ZW58MHx8MHx8fDA%3D",
      createdAt: new Date("2022-01-05"),
      updatedAt: new Date("2023-04-10"),
    },
    rating: 4.6,
  },
];

// Mock data for vehicles
const mockVehicles = [
  {
    id: "v1",
    driverId: "d1",
    type: "sedan",
    make: "Toyota",
    model: "Camry",
    year: 2021,
    color: "Silver",
    plateNumber: "29A-12345",
    maxSeats: 4,
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRveW90YSUyMGNhbXJ5fGVufDB8fDB8fHww",
    ],
    createdAt: new Date("2021-06-15"),
    updatedAt: new Date("2023-01-10"),
  },
  {
    id: "v2",
    driverId: "d2",
    type: "suv",
    make: "Honda",
    model: "CR-V",
    year: 2022,
    color: "White",
    plateNumber: "30A-54321",
    maxSeats: 5,
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9uZGElMjBjcnZ8ZW58MHx8MHx8fDA%3D",
    ],
    createdAt: new Date("2022-02-20"),
    updatedAt: new Date("2023-03-15"),
  },
  {
    id: "v3",
    driverId: "d3",
    type: "van",
    make: "Ford",
    model: "Transit",
    year: 2020,
    color: "Blue",
    plateNumber: "31A-98765",
    maxSeats: 7,
    isActive: true,
    images: [
      "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9yZCUyMHZhbnxlbnwwfHwwfHx8MA%3D%3D",
    ],
    createdAt: new Date("2020-11-10"),
    updatedAt: new Date("2022-12-05"),
  },
];

export const mockTrips = [
  {
    _id: "booking1",
    tripId: "trip1",
    userId: "1",
    pickup: "Downtown",
    dropoff: "Airport",
    pickupTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
    dropoffTime: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
    passengers: 2,
    price: 150000,
    status: "finished",
    paymentStatus: "finished",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    trip: {
      id: "trip1",
      driverId: "d1",
      vehicleId: "v1",
      startLocation: "Downtown",
      endLocation: "Airport",
      waypoints: [],
      distance: 15.5,
      duration: 35,
      departureTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
      arrivalTime: new Date(Date.now() + 1000 * 60 * 60 * 3),
      availableSeats: 2,
      price: 75000,
      status: "scheduled",
      createdAt: new Date(),
      updatedAt: new Date(),
      driver: {
        id: "d1",
        userId: "u1",
        licenseNumber: "DL12345678",
        licenseExpiry: new Date("2025-12-31"),
        isVerified: true,
        isActive: true,
        experience: 3,
        user: {
          id: "u1",
          firstName: "John",
          lastName: "Driver",
          email: "john.driver@example.com",
          phone: "+84123456789",
          role: "driver",
          rating: 4.8,
          cancelPercent: 2,
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0JTIwbWFufGVufDB8fDB8fHww",
          createdAt: new Date("2021-01-15"),
          updatedAt: new Date("2023-05-20"),
        },
        rating: 4.8,
      },
      vehicle: {
        id: "v1",
        driverId: "d1",
        type: "sedan",
        make: "Toyota",
        model: "Camry",
        year: 2021,
        color: "Silver",
        plateNumber: "29A-12345",
        maxSeats: 4,
        isActive: true,
        images: [
          "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRveW90YSUyMGNhbXJ5fGVufDB8fDB8fHww",
        ],
        createdAt: new Date("2021-06-15"),
        updatedAt: new Date("2023-01-10"),
      },
    },
  },
  {
    id: "booking2",
    tripId: "trip2",
    userId: "1",
    pickup: "University",
    dropoff: "Shopping Mall",
    pickupTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    dropoffTime: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30
    ), // 2 days ago + 30 minutes
    passengers: 1,
    price: 45000,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "cash",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    trip: {
      id: "trip2",
      driverId: "d2",
      vehicleId: "v2",
      startLocation: "University",
      endLocation: "Shopping Mall",
      waypoints: [],
      distance: 8.2,
      duration: 20,
      departureTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      arrivalTime: new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30
      ),
      availableSeats: 3,
      price: 45000,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
      driver: {
        id: "d2",
        userId: "u2",
        licenseNumber: "DL87654321",
        licenseExpiry: new Date("2024-10-15"),
        isVerified: true,
        isActive: true,
        experience: 5,
        user: {
          id: "u2",
          firstName: "Sarah",
          lastName: "Smith",
          email: "sarah.smith@example.com",
          phone: "+84987654321",
          role: "driver",
          rating: 4.9,
          cancelPercent: 1,
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXQlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D",
          createdAt: new Date("2020-03-10"),
          updatedAt: new Date("2023-06-15"),
        },
        rating: 4.9,
      },
      vehicle: {
        id: "v2",
        driverId: "d2",
        type: "suv",
        make: "Honda",
        model: "CR-V",
        year: 2022,
        color: "White",
        plateNumber: "30A-54321",
        maxSeats: 5,
        isActive: true,
        images: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9uZGElMjBjcnZ8ZW58MHx8MHx8fDA%3D",
        ],
        createdAt: new Date("2022-02-20"),
        updatedAt: new Date("2023-03-15"),
      },
    },
  },
  {
    id: "booking3",
    tripId: "trip3",
    userId: "1",
    pickup: "Residential Area",
    dropoff: "Business District",
    pickupTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    dropoffTime: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 45
    ), // 5 days ago + 45 minutes
    passengers: 3,
    price: 180000,
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    trip: {
      id: "trip3",
      driverId: "d3",
      vehicleId: "v3",
      startLocation: "Residential Area",
      endLocation: "Business District",
      waypoints: [],
      distance: 12.0,
      duration: 25,
      departureTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      arrivalTime: new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 45
      ),
      availableSeats: 4,
      price: 60000,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
      driver: {
        id: "d3",
        userId: "u3",
        licenseNumber: "DL55667788",
        licenseExpiry: new Date("2025-05-20"),
        isVerified: true,
        isActive: true,
        experience: 2,
        user: {
          id: "u3",
          firstName: "Michael",
          lastName: "Wong",
          email: "michael.wong@example.com",
          phone: "+84555666777",
          role: "driver",
          rating: 4.6,
          cancelPercent: 3,
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXQlMjBtYW58ZW58MHx8MHx8fDA%3D",
          createdAt: new Date("2022-01-05"),
          updatedAt: new Date("2023-04-10"),
        },
        rating: 4.6,
      },
      vehicle: {
        id: "v3",
        driverId: "d3",
        type: "van",
        make: "Ford",
        model: "Transit",
        year: 2020,
        color: "Blue",
        plateNumber: "31A-98765",
        maxSeats: 7,
        isActive: true,
        images: [
          "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9yZCUyMHZhbnxlbnwwfHwwfHx8MA%3D%3D",
        ],
        createdAt: new Date("2020-11-10"),
        updatedAt: new Date("2022-12-05"),
      },
    },
  },
];
