import { z } from "zod";

export const AccountSchemas = {
  updateProfile: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  }),
  updateAvatar: z.object({
    avatar: z.string().url(),
  }),
  adminUpdate: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().optional().nullable().or(z.literal("")),
    phone: z.string().optional().nullable().or(z.literal("")),
    email: z.string().email().optional(),
    avatar: z.string().url().optional().nullable().or(z.literal("")),
    status: z.string().optional(),
  }),
};
