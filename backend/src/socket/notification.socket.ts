import { Server, Socket } from "socket.io";
import prisma from "../config/client";
import { NotificationType } from "@prisma/client";

export default function registerNotificationSocket(io: Server, socket: Socket) {
  const userId = socket.data.userId;

  // Helper: Create and emit a notification
  const createAndSendNotification = async ({
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

    // Emit real-time
    io.to(receiverId).emit("notification:new", notification);

    // Update unread count
    const unreadCount = await prisma.notification.count({
      where: { userId: receiverId, isRead: false },
    });
    io.to(receiverId).emit("notification:unread_count", unreadCount);
  };

  /**
   * EVENT: NEW WORK
   */
  // socket.on("notification:new_work", async (workId: string) => {
  //   try {
  //     const work = await prisma.work.findUnique({
  //       where: { id: workId },
  //       include: {
  //         class: { include: { students: true, teacher: true } },
  //       },
  //     });

  //     if (!work) return socket.emit("error", "Work not found");

  //     const classData = work.class;

  //     if (classData.teacherId !== userId)
  //       return socket.emit("error", "Unauthorized");

  //     // Notify all students
  //     await Promise.all(
  //       classData.students.map((student) =>
  //         createAndSendNotification({
  //           receiverId: student.id,
  //           senderId: classData.teacherId,
  //           type: "WORK",
  //           classId: classData.id,
  //           workId: work.id,
  //         })
  //       )
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  /**
   * MARK ALL NOTIFICATIONS AS READ
   */
  socket.on("notification:mark_read", async () => {
    try {
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      io.to(userId).emit("notification:all_read");
      io.to(userId).emit("notification:unread_count", 0);
    } catch (error) {
      console.error(error);
    }
  });

  /**
   * GET UNREAD COUNT
   */
  socket.on("notification:get_unread_count", async () => {
    try {
      const count = await prisma.notification.count({
        where: { userId, isRead: false },
      });
      socket.emit("notification:unread_count", count);
    } catch (error) {
      console.error(error);
    }
  });

  /**
   * MARK SINGLE NOTIFICATION AS READ
   */
  socket.on("notification:mark_single_read", async ({ id }: { id: string }) => {
    try {
      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      const unreadCount = await prisma.notification.count({
        where: { userId, isRead: false },
      });

      socket.emit("notification:unread_count", unreadCount);
    } catch (error) {
      console.error(error);
    }
  });
}