import { z } from "zod";

export const documentEntrySchema = z.object({
  name: z.string(),
  document: z.array(z.string().url()),
  expire: z.coerce.date().optional(),
});

export const vehicleSchema = z.object({
  type: z.enum(["standard", "vip", "limousine", "minibus"]),
  make: z.string(),
  vehicleModel: z.string(),
  color: z.string(),
  year: z.number().min(1900).max(new Date().getFullYear()).optional(),
  images: z.array(z.string().url()).optional(),
  licensePlate: z.string(),
  seats: z.number().min(1).max(60),
});

export const driverRegistration = z.object({
  number: z.number(),
  documents: z.array(documentEntrySchema),
  vehicle: vehicleSchema,
});

export const updateDriver = z.object({
  number: z.number().optional(),
  documents: z.array(documentEntrySchema).optional(),
  vehicle: vehicleSchema.partial().optional(), // có thể cập nhật 1 phần
});
