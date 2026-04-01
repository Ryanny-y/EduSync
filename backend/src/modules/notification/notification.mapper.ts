import { NotificationDto } from "./notification.types";

export const mapNotificationToDto = (notification: any): NotificationDto => {
  return {
    id: notification.id,
    type: notification.type,
    message: notification.message ?? null,
    isRead: notification.isRead,
    userId: notification.userId,
    senderId: notification.senderId ?? null,
    classId: notification.classId ?? null,
    workId: notification.workId ?? null,
    createdAt: notification.createdAt.toISOString(),
  };
};
