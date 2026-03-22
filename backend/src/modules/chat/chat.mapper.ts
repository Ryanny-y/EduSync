import { Role } from "@prisma/client";
import { format } from "date-fns";

export const mapConversationToDto = (conv: any, role: Role) => {
  const otherUser = role === "TEACHER" ? conv.student : conv.teacher;

  const lastMessage = conv.messages[0];

  const unreadCount = conv.messages.filter(
    (msg: any) => msg.senderId !== otherUser.id && !msg.read,
  ).length;

  return {
    id: conv.id,
    name: `${otherUser.firstName} ${otherUser.lastName}`,
    subject: conv.class?.subject ?? "",
    section: conv.class?.section ?? "",
    lastMessage: lastMessage?.content ?? null,
    timestamp: lastMessage
      ? format(new Date(lastMessage.createdAt), "hh:mm a")
      : null,
    unreadCount,
    isOnline: otherUser.isOnline ?? false,
    lastSeenAt: otherUser.lastSeenAt ?? null,
  };
};
