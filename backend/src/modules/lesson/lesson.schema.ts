import z from "zod";
import { fileSchema, uploadedFileSchema } from "../file/file.schema";

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  classId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),

  materials: z.array(
    z.object({
      id: z.string(),
      file: fileSchema,
    }),
  ),
});

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(1),
  }),
  files: z
    .array(uploadedFileSchema)
    .optional()
    .default([]),
});

export const lessonParamsSchema = z.object({
  params: z.object({
    classId: z.uuid(),
    lessonId: z.uuid().optional(),
  }),
});
