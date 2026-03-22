import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socketAuth";
import { registerChatHandlers } from "./chat.socket";
import { setOffline, setOnline, onlineUsers } from "./presence";
import prisma from "../config/client";

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // for testing only
      methods: ["GET", "POST"],
    },
    transports: ["websocket"],
  });

  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
    const userId = socket.data.userId;

    console.log(userId);

    // mark online
    setOnline(userId, socket.id);

    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: true },
    });

    socket.join(userId);

    // Send currently online users to this socket (so they know who is online)
    socket.emit("online_users", { userIds: Array.from(onlineUsers.keys()) });

    // Broadcast to everyone else that this user is online
    socket.broadcast.emit("user_online", { userId });

    registerChatHandlers(io, socket);

    socket.on("disconnect", async () => {
      setOffline(userId);

      await prisma.user.update({
        where: { id: userId },
        data: {
          isOnline: false,
          lastSeenAt: new Date(),
        },
      });

      // notify everyone else
      socket.broadcast.emit("user_offline", { userId });
    });
  });

  return io;
};
