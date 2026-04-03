import { z } from "zod";
import { WorkType } from "@prisma/client";
import { fileSchema, uploadedFileSchema } from "../file/file.schema";

export const workSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  type: z.enum(WorkType),
  dueDate: z.iso.date().nullable(),
  classId: z.string(),
  workLinks: z
    .string()
    .transform((val) => JSON.parse(val))
    .pipe(z.array(z.url()))
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  materials: z.array(
    z.object({
      id: z.string(),
      file: fileSchema,
    }),
  ),
  submissionStats: z.object({
    total: z.number(),
    submitted: z.number(),
    graded: z.number(),
    missing: z.number(),
  }),
});

export const createWorkSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    type: z.enum(WorkType),
    dueDate: z.iso.datetime().optional(),
    workLinks: z
      .string()
      .transform((val) => JSON.parse(val))
      .pipe(z.array(z.url()))
      .optional(),
  }),
  files: z.array(uploadedFileSchema).optional(),
});

export const updateWorkSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    type: z.enum(WorkType).optional(),
    dueDate: z.iso.datetime().optional(),
    workLinks: z
      .string()
      .transform((val) => JSON.parse(val))
      .pipe(z.array(z.url()))
      .optional(),
    removedMaterialIds: z.string().optional(),
  }),
  files: z.array(uploadedFileSchema).optional(),
});

export const workParamsSchema = z.object({
  params: z.object({
    classId: z.uuid(),
    workId: z.uuid().optional(),
  }),
});
