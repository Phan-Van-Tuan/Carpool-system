export interface Driver {
  account: Account;
  vehicle: Vehicle;
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  isOnline?: boolean;
  documents: Documents;
}

export interface Account {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  rating?: number;
  cancelPercent?: number;
  status: "pending" | "active" | "blocked";
  aesKey?: string;
  totalTrips: number;
  createdAt: Date;
}

export interface Vehicle {
  _id: string;
  make: string;
  vehicleModel: string;
  color: string;
  licensePlate: string;
  type: "sedan" | "suv" | "luxury" | "bike" | "auto";
  seats: number;
}

export interface Documents {
  _id: string;
  number: number;
  documents: {
    name: string;
    document: string[];
    status: "pending" | "verified" | "exprired";
    note?: string;
    expire?: Date;
  }[];
}

export interface registerReqDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  password: string;
  role: string;
  avatar?: string;
  aesKey?: string;
  vehicle: {
    make: string;
    vehicleModel: string;
    color: string;
    licensePlate: string;
    type: "sedan" | "suv" | "luxury" | "bike" | "auto";
    seats: number;
  };
  documents: {
    name: string;
    status: "pending";
    expire?: Date;
  }[];
}
