import { Server, Socket } from "socket.io";
import { createMessage } from "../modules/chat/chat.service";

export const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on("send_message", async (data) => {
    const senderId = socket.data.userId;
    const { conversationId, content } = data;

    const message = await createMessage(conversationId, senderId, content);

    // Send to entire room (including sender)
    io.to(conversationId).emit("receive_message", message);
  });
};
