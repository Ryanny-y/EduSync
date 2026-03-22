import z from "zod";

export const conversationDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  isOnline: z.boolean(),
  lastSeenAt: z.string(),
  lastMessage: z.string().nullable(),
  lastMessageAt: z.date().nullable(),
});
