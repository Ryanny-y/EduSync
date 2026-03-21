import { Request, Response } from "express";
import prisma from "../../config/client";

export const getMessages = async (req: Request<{ conversationId: string }>, res: Response) => {
  const { conversationId } = req.params;

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });

  res.json(messages);
};