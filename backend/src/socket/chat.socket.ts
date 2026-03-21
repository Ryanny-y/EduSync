import { Server, Socket } from "socket.io";
import { createMessage } from "../modules/chat/chat.service";

export const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on("send_message", async (data) => {
    const senderId = socket.data.userId;

    const { conversationId, content, receiverId } = data;

    const message = await createMessage(
      conversationId,
      senderId,
      content
    );

    // send to receiver
    io.to(receiverId).emit("receive_message", message);

    // send back to sender
    socket.emit("receive_message", message);
  });
};