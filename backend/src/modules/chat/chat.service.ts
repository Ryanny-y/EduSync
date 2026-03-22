import { Role } from "@prisma/client";
import prisma from "../../config/client";

export const getOrCreateConversation = async (
  teacherId: string,
  studentId: string,
  classId: string,
) => {
  let convo = await prisma.conversation.findUnique({
    where: {
      teacherId_studentId: {
        teacherId,
        studentId,
      },
    },
  });

  if (!convo) {
    convo = await prisma.conversation.create({
      data: {
        teacherId,
        studentId,
        classId,
      },
    });
  }

  return convo;
};

export const createMessage = async (
  conversationId: string,
  senderId: string,
  content: string,
) => {
  return prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
  });
};

export const getUserConversations = async (userId: string, role: Role) => {
  if (role === "TEACHER") {
    return prisma.conversation.findMany({
      where: { teacherId: userId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        class: {
          select: {
            subject: true,
            section: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (role === "STUDENT") {
    return prisma.conversation.findMany({
      where: { studentId: userId },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            isOnline: true,
            lastSeenAt: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        class: {
          select: {
            subject: true,
            section: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return [];
};
