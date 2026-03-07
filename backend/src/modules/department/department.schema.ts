import { z } from "zod";

export const createDepartmentBodySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Department name is required"),
  }),
});

export const updateDepartmentBodySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Department name is required"),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const departmentParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const departmentDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
});