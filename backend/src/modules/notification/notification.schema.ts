import { z } from "zod";

export const notificationDtoSchema = z.object({
  id: z.string(),
  type: z.string(),
  message: z.string().nullable().optional(),
  isRead: z.boolean(),
  userId: z.string(),
  senderId: z.string().nullable().optional(),
  classId: z.string().nullable().optional(),
  workId: z.string().nullable().optional(),
  createdAt: z.string(),
});