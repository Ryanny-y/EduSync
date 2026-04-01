import { NotificationType } from "@prisma/client";
import prisma from "../../config/client";
import { mapNotificationToDto } from "./notification.mapper";
import { NotificationDto } from "./notification.types";
import { getSocketIO } from "../../socket/socketInstance";

export const sendNotification = async ({
  receiverId,
  senderId,
  type,
  classId,
  workId,
}: {
  receiverId: string;
  senderId?: string;
  type: NotificationType;
  classId?: string;
  workId?: string;
}) => {
  const notification = await prisma.notification.create({
    data: {
      userId: receiverId,
      senderId: senderId ?? null,
      type,
      classId: classId ?? null,
      workId: workId ?? null,
    },
  });

  try {
    const io = getSocketIO();
    io.to(receiverId).emit("notification:new", notification);

    // Update unread count
    const unreadCount = await prisma.notification.count({
      where: { userId: receiverId, isRead: false },
    });
    io.to(receiverId).emit("notification:unread_count", unreadCount);
  } catch (error) {
    console.error("Socket emit failed:", error);
  }

  return notification;
};

export const getUserNotifications = async (
  userId: string,
): Promise<NotificationDto[]> => {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return notifications.map((notification) =>
    mapNotificationToDto(notification),
  );
};
