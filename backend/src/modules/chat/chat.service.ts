import prisma from "../../config/client";

export const getOrCreateConversation = async (
  teacherId: string,
  studentId: string
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
      },
    });
  }

  return convo;
};

export const createMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  return prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
  });
};