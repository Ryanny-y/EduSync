import z from "zod";
import { fileSchema } from "../file/file.schema";

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  classId: z.string(),
  createdAt: z.date(),

  materials: z.array(
    z.object({
      id: z.string(),
      file: fileSchema,
    })
  ),
});

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string().min(1),
  }),
  files: z.array(z.object({
    originalname: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer),
    size: z.number(),
  })).optional().default([]),
});

export const lessonParamsSchema = z.object({
  params: z.object({
    classId: z.uuid(),
    lessonId: z.uuid().optional(),
  }),
});