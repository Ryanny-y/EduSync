import z from "zod";
import { FileType } from "../../generated/prisma";

export const fileSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  fileType: z.enum(FileType),
  path: z.string(),
  size: z.number(),
  bucket: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  urlExpiresAt: z.date().nullable().optional(),
  createdAt: z.date(),
});

export const uploadedFileSchema = z.object({
  originalname: z.string(),
  mimetype: z.string(),
  buffer: z.instanceof(Buffer),
  size: z.number(),
});
