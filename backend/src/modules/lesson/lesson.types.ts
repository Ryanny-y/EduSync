import { z } from "zod";
import { FileType } from "../../generated/prisma";

export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  classId: z.string(),
  createdAt: z.date(),

  materials: z.array(
    z.object({
      id: z.string(),
      file: z.object({
        id: z.string(),
        fileName: z.string(),
        mimeType: z.string(),
        fileType: z.enum(FileType),
        size: z.number(),
        driveFileId: z.string(),
        webViewLink: z.string(),
        webContentLink: z.string(),
      }),
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
    classId: z.string().uuid(),
    lessonId: z.string().uuid().optional(),
  }),
});

export type LessonDto = z.infer<typeof lessonSchema>;
export type CreateLessonDto = z.infer<typeof createLessonSchema>["body"];