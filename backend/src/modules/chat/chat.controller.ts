import { Request, Response } from "express";
import prisma from "../../config/client";
import {
  getUserConversations,
  getOrCreateConversation,
  createMessage,
} from "./chat.service";
import { mapConversationToDto } from "./chat.mapper";


// GET MESSAGES (SECURE)
export const getMessages = async (
  req: Request<{ conversationId: string }>,
  res: Response
) => {
  const { conversationId } = req.params;
  const userId = req.userId!;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { teacherId: userId },
        { studentId: userId },
      ],
    },
  });

  if (!conversation) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: {
      sender: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  res.json(messages);
};


// GET MY CONVERSATIONS
export const getMyConversations = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const role = req.role!;

  const conversations = await getUserConversations(userId, role);

  const result = conversations.map((conv) =>
    mapConversationToDto(conv, role)
  );

  res.json(result);
};


// CREATE OR GET CONVERSATION
export const createOrGetConversation = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const role = req.role!;
  const { receiverId, classId } = req.body;

  let teacherId: string;
  let studentId: string;

  if (role === "TEACHER") {
    teacherId = userId;
    studentId = receiverId;
  } else {
    teacherId = receiverId;
    studentId = userId;
  }

  const conversation = await getOrCreateConversation(
    teacherId,
    studentId,
    classId
  );

  res.json(conversation);
};


// SEND MESSAGE (REST FALLBACK)
export const sendMessage = async (
  req: Request<{ conversationId: string }>,
  res: Response
) => {
  const { conversationId } = req.params;
  const userId = req.userId!;
  const { content } = req.body;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { teacherId: userId },
        { studentId: userId },
      ],
    },
  });

  if (!conversation) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const message = await createMessage(
    conversationId,
    userId,
    content
  );

  res.json(message);
};


// GET SINGLE CONVERSATION (SECURE)
export const getConversationById = async (
  req: Request<{ conversationId: string }>,
  res: Response
) => {
  const { conversationId } = req.params;
  const userId = req.userId!;
  const role = req.role!;

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { teacherId: userId },
        { studentId: userId },
      ],
    },
    include: {
      teacher: true,
      student: true,
    },
  });

  if (!conversation) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const dto = mapConversationToDto(conversation, role);

  res.json(dto);
};