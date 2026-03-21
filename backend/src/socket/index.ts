import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socketAuth";
import { registerChatHandlers } from "./chat.socket";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log("Connected:", socket.data.userId);

    // join personal room
    socket.join(socket.data.userId);

    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.data.userId);
    });
  });

  return io;
};