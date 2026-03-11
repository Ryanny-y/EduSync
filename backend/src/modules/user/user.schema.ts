import z from "zod";
import { Role } from "../../generated/prisma";

export const userDtoSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  fullName: z.string(),

  email: z.email(),

  role: z.enum(Role),
  department: z.string().nullable(),

  createdAt: z.date(),
  updatedAt: z.date(),
});