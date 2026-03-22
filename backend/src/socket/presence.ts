export const onlineUsers = new Map<string, string>(); 

export const setOnline = (userId: string, socketId: string) => {
  onlineUsers.set(userId, socketId);
};

export const setOffline = (userId: string) => {
  onlineUsers.delete(userId);
};

export const isUserOnline = (userId: string) => {
  return onlineUsers.has(userId);
};

export const getUserSocket = (userId: string) => {
  return onlineUsers.get(userId);
};