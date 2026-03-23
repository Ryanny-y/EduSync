// presence.ts
export const onlineUsers = new Map<string, Set<string>>();

export const setOnline = (userId: string, socketId: string) => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId)!.add(socketId);
};

export const setOffline = (userId: string, socketId: string) => {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return;

  sockets.delete(socketId);

  if (sockets.size === 0) {
    onlineUsers.delete(userId);
  }
};

export const isUserOnline = (userId: string) => {
  return onlineUsers.has(userId);
};

export const getUserSockets = (userId: string) => {
  return onlineUsers.get(userId) ?? new Set();
};