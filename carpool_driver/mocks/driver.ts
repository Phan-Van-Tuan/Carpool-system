import { Driver } from "@/types/auth";

export const mockDriver: Driver = {
  account: {
    _id: "undefined",
    firstName: "Minh",
    lastName: "Nguyen",
    email: "minh.nguyen@example.com",
    phone: "+84 123 456 789",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    rating: 4.8,
    totalTrips: 1243,
    status: "pending",
    createdAt: new Date("2022-03-15"),
  },
  isOnline: false,
  vehicle: {
    _id: "v-123456",
    make: "Toyota",
    model_: "Vios",
    color: "Silver",
    licensePlate: "51F-123.45",
    type: "sedan",
    seats: 4,
    // image:
    //   "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  },
  earnings: {
    today: 450000,
    week: 3200000,
    month: 12500000,
    total: 145000000,
  },
  documents: {
    _id: "doc",
    number: 3,
    documents: [
      {
        expire: new Date("2025-06-30"),
        status: "pending",
        name: "",
        document: [
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        ],
      },
      {
        expire: new Date("2025-06-30"),
        status: "pending",
        name: "",
        document: [
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        ],
      },
      {
        expire: new Date("2025-06-30"),
        status: "pending",
        name: "",
        document: [
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        ],
      },
    ],
  },
};
