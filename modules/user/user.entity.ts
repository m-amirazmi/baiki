// modules/user/user.entity.ts
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),

  password: z.string().min(6).optional(), // optional if Google only
  role: z.enum(["admin", "technician", "store"]),
  tenantId: z.string().uuid(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
