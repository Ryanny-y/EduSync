import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socketAuth";
import { registerChatHandlers } from "./chat.socket";
import { setOffline, setOnline, onlineUsers, isUserOnline } from "./presence";
import prisma from "../config/client";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
    const userId = socket.data.userId;

    // Track this socket as online
    setOnline(userId, socket.id);

    // Update DB online status
    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });

    // Join personal room
    socket.join(userId);

    // Handle joining/leaving conversations
    socket.on("join_conversation", ({ conversationId }) => {
      socket.join(conversationId);
    });

    socket.on("leave_conversation", ({ conversationId }) => {
      socket.leave(conversationId);
    });

    // Send list of online users to this socket
    socket.emit("online_users", {
      userIds: Array.from(onlineUsers.keys()),
    });

    // Broadcast to everyone else that this user is online
    socket.broadcast.emit("user_online", { userId });

    // Register chat handlers
    registerChatHandlers(io, socket);

    // Handle disconnect
    socket.on("disconnect", async () => {
      setOffline(userId, socket.id); // <-- pass socket.id now

      // Only mark user offline in DB if they have no active sockets
      if (!isUserOnline(userId)) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isOnline: false,
            lastSeenAt: new Date(),
          },
        });

        // Notify others
        socket.broadcast.emit("user_offline", { userId });
      }
    });
  });

  return io;
};