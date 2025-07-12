// validation/route.schema.ts
import { z } from "zod";
import { geoJsonSchema } from "../../utils/types/location";

export const createRoute = z.object({
  name: z.string().min(1),
  from: geoJsonSchema,
  to: geoJsonSchema,
  router: z.any().optional(),
  distance: z.number().optional(),
  duration: z.number().optional(),
  notes: z.string().optional(),
});

export const updateRoute = createRoute.partial();

export const createAssignment = z.object({
  routeId: z.string().min(1),
  driverId: z.string().min(1),
  pattern: z.enum(["even", "odd", "daily", "custom"]),
  // customDays: z.array(z.string()).optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  endDate: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export const updateAssignment = createAssignment.partial();
